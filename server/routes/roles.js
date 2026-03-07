import { pool, poolConnect, sql } from '../config/db.js';
import express from 'express';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Get all roles
router.get('/',authenticate, authorize(["Admin", "User", "Agent"]), async (_req, res) => {
  try {
    await poolConnect;

    const result = await pool.request().query(`
      SELECT
        RoleID,
        RoleName
      FROM dbo.Roles
      ORDER BY RoleID;
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;