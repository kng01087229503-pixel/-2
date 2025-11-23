const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'coffee_order_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃
  connectionTimeoutMillis: 2000, // 연결 타임아웃
});

// 연결 테스트
pool.on('connect', () => {
  console.log('✅ PostgreSQL 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 연결 오류:', err);
  process.exit(-1);
});

// 데이터베이스 연결 테스트 함수
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('📊 데이터베이스 연결 테스트 성공:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 연결 테스트 실패:', error.message);
    return false;
  }
}

// 쿼리 실행 헬퍼 함수
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📝 쿼리 실행:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ 쿼리 실행 오류:', error);
    throw error;
  }
}

// 연결 종료 함수
async function closePool() {
  await pool.end();
  console.log('🔌 데이터베이스 연결 풀이 종료되었습니다.');
}

module.exports = {
  pool,
  query,
  testConnection,
  closePool,
};

