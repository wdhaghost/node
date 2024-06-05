
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const sqlDBConnector = await mysql.createConnection({
  host: process.env.SQL_DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PW,
  database: process.env.SQL_DB_NAME,
});
export default sqlDBConnector;