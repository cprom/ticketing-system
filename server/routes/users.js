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

// POST /api/users
router.post('/', async (req, res) => {
  
  const { name, email, passwordHash, roleId } = req.body || {};
  try {
    await poolConnect;
    const result = await pool.request()
    .input('FullName', sql.VarChar, name)
    .input('Email', sql.VarChar(255), email)
    .input('PasswordHash', sql.Text, passwordHash)
    .input('RoleID', sql.Int, roleId)
    .query(`
      INSERT INTO Users
      (FullName, Email, PasswordHash, RoleID)
      VALUES
      (@FullName, @Email, @PasswordHash, @RoleID);
      SELECT SCOPE_IDENTITY() AS UserID;
      `);
      res.status(201).json({userId: result.recordset[0].UserID});
    }catch (err){
      res.status(500).json({ error: err.message });
    }
});


export default router;