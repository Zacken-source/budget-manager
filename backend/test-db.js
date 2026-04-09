import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function test() {
  const conn = await pool.getConnection();
  const [rows] = await conn.query("SELECT 1 AS result");
  console.log("DB OK :", rows);
  conn.release();
}

test().catch(err => {
  console.error("DB ERROR :", err.message);
});