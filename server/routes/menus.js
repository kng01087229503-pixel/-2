const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// 메뉴 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const menuResult = await query('SELECT * FROM menus ORDER BY id', []);
    const optionResult = await query(
      'SELECT id, menu_id, name, price FROM menu_options ORDER BY id',
      []
    );

    const optionsByMenu = optionResult.rows.reduce((acc, opt) => {
      if (!acc[opt.menu_id]) acc[opt.menu_id] = [];
      acc[opt.menu_id].push({
        id: opt.id,
        name: opt.name,
        price: opt.price,
      });
      return acc;
    }, {});

    const menus = menuResult.rows.map((m) => ({
      id: m.id,
      name: m.name,
      price: m.price,
      description: m.description,
      image: m.image,
      options: optionsByMenu[m.id] || [],
    }));

    res.json(menus);
  } catch (err) {
    next(err);
  }
});

module.exports = router;


