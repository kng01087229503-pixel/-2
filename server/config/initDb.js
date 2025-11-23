const { pool } = require('./db');
const fs = require('fs');
const path = require('path');

async function initDb() {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  try {
    // 스키마 생성
    await pool.query(sql);
    console.log('✅ 데이터베이스 스키마가 초기화되었습니다.');

    // 기본 메뉴/옵션/재고가 없으면 시드 데이터 삽입
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM menus');
    if (rows[0].count === 0) {
      console.log('🌱 기본 메뉴 데이터를 삽입합니다.');

      // 메뉴 삽입
      const menuInsertResult = await pool.query(
        `INSERT INTO menus (name, price, description, image)
         VALUES 
         ('아메리카노(ICE)', 4000, '시원하고 깔끔한 아이스 아메리카노', NULL),
         ('아메리카노(HOT)', 4000, '따뜻하고 진한 핫 아메리카노', NULL),
         ('카페라떼', 5000, '부드러운 우유와 에스프레소의 조화', NULL),
         ('카푸치노', 5000, '우유 거품이 올라간 클래식한 카푸치노', NULL),
         ('카라멜 마키아토', 6000, '달콤한 카라멜과 에스프레소의 만남', NULL),
         ('바닐라 라떼', 5500, '부드러운 바닐라 향이 일품인 라떼', NULL)
         RETURNING id, name`
      );

      const menus = menuInsertResult.rows;

      // 모든 메뉴에 공통 옵션 추가
      const optionValues = [];
      menus.forEach((m) => {
        optionValues.push(`(${m.id}, '샷 추가', 500)`);
        optionValues.push(`(${m.id}, '시럽 추가', 0)`);
      });

      if (optionValues.length > 0) {
        await pool.query(
          `INSERT INTO menu_options (menu_id, name, price) VALUES ${optionValues.join(',')}`
        );
      }

      // 재고 기본값 10개로 설정
      const inventoryValues = menus.map((m) => `(${m.id}, 10)`);
      if (inventoryValues.length > 0) {
        await pool.query(
          `INSERT INTO inventory (menu_id, stock) VALUES ${inventoryValues.join(',')}`
        );
      }

      console.log('✅ 기본 메뉴/옵션/재고 데이터 삽입 완료');
    }

    // 메뉴 이미지 경로 업데이트 (이미 존재하는 데이터에도 적용)
    await pool.query(
      `UPDATE menus SET image = '/americano-ice.jpg'
       WHERE name = '아메리카노(ICE)'`
    );
    await pool.query(
      `UPDATE menus SET image = '/americano-hot.jpg'
       WHERE name = '아메리카노(HOT)'`
    );
    await pool.query(
      `UPDATE menus SET image = '/caffe-latte.jpg'
       WHERE name = '카페라떼'`
    );
    console.log('🖼 메뉴 이미지 경로가 업데이트되었습니다.');
  } catch (err) {
    console.error('❌ 데이터베이스 초기화 오류:', err);
    throw err;
  }
}

module.exports = { initDb };



