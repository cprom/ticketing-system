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

// Get user by UserID
router.get('/:id', async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
        .input('UserID', sql.Int, req.params.id)
        .query(`
            SELECT
                t.UserID,
                t.FullName,
                t.Email,
                t.RoleID
            FROM dbo.Users t
            WHERE t.UserID = @UserID;
                `);
    if (!result.recordset.length) {
        return res.status(404).json({message: 'User not found'});
    }
    res.json(result.recordset[0]);
    }catch (err) {
        res.status(500).json({error: err.message});
    }
});

export default router;