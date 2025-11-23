const express = require('express');
const router = express.Router();
const { pool, query } = require('../config/db');

// 주문 생성
router.post('/', async (req, res, next) => {
  const { items, totalAmount, orderDate } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items 배열이 비어있습니다.' });
  }
  if (typeof totalAmount !== 'number') {
    return res.status(400).json({ error: 'totalAmount가 올바르지 않습니다.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (total_amount, order_date, status)
       VALUES ($1, $2, $3)
       RETURNING id, total_amount AS "totalAmount", order_date AS "orderDate", status`,
      [totalAmount, orderDate ? new Date(orderDate) : new Date(), 'pending']
    );
    const order = orderResult.rows[0];

    const orderItems = [];

    for (const item of items) {
      const itemResult = await client.query(
        `INSERT INTO order_items (order_id, menu_id, menu_name, quantity, price)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, menu_id AS "menuId", menu_name AS "menuName", quantity, price`,
        [order.id, item.menuId, item.menuName, item.quantity, item.price]
      );
      const orderItem = itemResult.rows[0];
      orderItem.options = Array.isArray(item.options) ? item.options : [];
      orderItems.push(orderItem);

      // 선택된 옵션 이름 저장
      if (Array.isArray(item.options) && item.options.length > 0) {
        const values = item.options.map((name, idx) => `($1, $${idx + 2})`).join(',');
        await client.query(
          `INSERT INTO order_item_options (order_item_id, option_name)
           VALUES ${values}`,
          [orderItem.id, ...item.options]
        );
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      id: order.id,
      items: orderItems,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      status: order.status,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// 주문 목록 조회 (관리자용)
router.get('/', async (req, res, next) => {
  try {
    const ordersResult = await query(
      `SELECT id,
              total_amount AS "totalAmount",
              order_date AS "orderDate",
              status
       FROM orders
       ORDER BY order_date DESC`,
      []
    );

    const itemsResult = await query(
      `SELECT oi.id,
              oi.order_id,
              oi.menu_id AS "menuId",
              oi.menu_name AS "menuName",
              oi.quantity,
              oi.price,
              oio.option_name AS "optionName"
       FROM order_items oi
       LEFT JOIN order_item_options oio ON oio.order_item_id = oi.id
       ORDER BY oi.order_id, oi.id`,
      []
    );

    const itemsByOrder = {};
    for (const row of itemsResult.rows) {
      if (!itemsByOrder[row.order_id]) {
        itemsByOrder[row.order_id] = [];
      }
      let item = itemsByOrder[row.order_id].find((i) => i.id === row.id);
      if (!item) {
        item = {
          id: row.id,
          menuId: row.menuId,
          menuName: row.menuName,
          quantity: row.quantity,
          price: row.price,
          options: [],
        };
        itemsByOrder[row.order_id].push(item);
      }
      if (row.optionName) {
        item.options.push(row.optionName);
      }
    }

    const orders = ordersResult.rows.map((o) => ({
      id: o.id,
      items: (itemsByOrder[o.id] || []).map((i) => ({
        menuId: i.menuId,
        menuName: i.menuName,
        quantity: i.quantity,
        price: i.price,
        options: i.options,
      })),
      totalAmount: o.totalAmount,
      orderDate: o.orderDate,
      status: o.status,
    }));

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// 주문 통계 조회
router.get('/statistics', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE status IN ('pending', 'received'))::int AS received,
         COUNT(*) FILTER (WHERE status = 'inProgress')::int AS "inProgress",
         COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
       FROM orders`,
      []
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// 주문 상태 변경
router.put('/:orderId/status', async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body || {};

  const allowed = ['pending', 'received', 'inProgress', 'completed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: '유효하지 않은 상태 값입니다.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 이전 상태 확인
    const prevResult = await client.query(
      'SELECT status FROM orders WHERE id = $1',
      [orderId]
    );
    if (prevResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });
    }

    const prevStatus = prevResult.rows[0].status;

    await client.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      [status, orderId]
    );

    // 선택사항: 제조 완료 시 재고 차감
    if (status === 'completed' && prevStatus !== 'completed') {
      const itemsResult = await client.query(
        'SELECT menu_id, quantity FROM order_items WHERE order_id = $1',
        [orderId]
      );
      for (const row of itemsResult.rows) {
        await client.query(
          `UPDATE inventory
           SET stock = GREATEST(stock - $1, 0)
           WHERE menu_id = $2`,
          [row.quantity, row.menu_id]
        );
      }
    }

    await client.query('COMMIT');

    // 변경 후 주문 정보 반환
    const updatedOrder = await query(
      `SELECT id,
              total_amount AS "totalAmount",
              order_date AS "orderDate",
              status
       FROM orders
       WHERE id = $1`,
      [orderId]
    );

    res.json(updatedOrder.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;



