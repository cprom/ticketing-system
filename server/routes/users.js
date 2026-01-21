import { pool, poolConnect, sql } from '../db.js';
import express from 'express';
const router = express.Router();

// Get users
router.get('/', async (_, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(
      'SELECT UserID, FullName, Email, RoleID FROM Users'
    );
    res.json(result.recordset);
    console.log(result)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;