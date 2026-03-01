import pkg from 'pg';
const { Pool } = pkg;

const DB_NAME = 'loginform_users';
const USERS_TABLE = 'users';

let pool;

export async function connectDB() {
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '12345',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: DB_NAME,
  });

  try {
    const result = await pool.query('SELECT NOW()');
    const host = process.env.DB_HOST || 'localhost';
    console.log('PostgreSQL connected:', host);
    console.log('Data is stored in:', DB_NAME + '.' + USERS_TABLE);
    return pool;
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err.message);
    throw err;
  }
}

export function getPool() {
  if (!pool) throw new Error('Database not connected');
  return pool;
}

export { DB_NAME, USERS_TABLE };

