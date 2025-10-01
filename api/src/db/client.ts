import { Pool } from "pg";
import { DB_URL } from "../config/env";

const pool = new Pool({
  connectionString: DB_URL,
});

export const initDatabase = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();

    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

export default pool;
