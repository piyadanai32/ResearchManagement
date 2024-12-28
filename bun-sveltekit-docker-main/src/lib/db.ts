import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import type { Pool } from 'mysql2/promise'; // นำเข้า Pool แบบ type-only

dotenv.config();

const db: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

export default db;
