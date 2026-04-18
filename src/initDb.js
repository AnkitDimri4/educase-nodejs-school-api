import { pool } from "./db.js";

async function init() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      );
    `);

    console.log("schools table is ready");
    process.exit(0);
  } catch (err) {
    console.error("Error creating schools table:", err);
    process.exit(1);
  }
}

init();