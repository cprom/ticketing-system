import { pool, poolConnect, sql } from '../config/db.js';
import express from 'express';
const router = express.Router();

// Get all roles
router.get('/', async (_req, res) => {
  try {
    await poolConnect;

    const result = await pool.request().query(`
      SELECT
        DepartmentID,
        DepartmentName
      FROM dbo.Department
      ORDER BY DepartmentID;
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;