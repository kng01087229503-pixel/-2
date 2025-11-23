const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// 재고 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT i.menu_id AS "menuId",
              m.name AS "menuName",
              i.stock
       FROM inventory i
       JOIN menus m ON m.id = i.menu_id
       ORDER BY i.menu_id`,
      []
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// 재고 수정
router.put('/:menuId', async (req, res, next) => {
  const { menuId } = req.params;
  const { stock } = req.body || {};

  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'stock은 0 이상의 숫자여야 합니다.' });
  }

  try {
    const result = await query(
      `UPDATE inventory
       SET stock = $1
       WHERE menu_id = $2
       RETURNING menu_id AS "menuId", $1::int AS stock`,
      [stock, menuId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: '해당 메뉴의 재고 정보를 찾을 수 없습니다.' });
    }

    // 메뉴명도 함께 반환
    const menuResult = await query(
      'SELECT name AS "menuName" FROM menus WHERE id = $1',
      [menuId]
    );

    res.json({
      menuId: result.rows[0].menuId,
      menuName: menuResult.rows[0]?.menuName || '',
      stock: result.rows[0].stock,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


