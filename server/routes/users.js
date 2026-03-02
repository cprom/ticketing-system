import { pool, poolConnect, sql } from '../db.js';
import express from 'express';
const router = express.Router();

// Get users
router.get('/', async (_, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(
      'SELECT FullName, UserID, FirstName, LastName, Email, RoleID, JobTitle, DepartmentID, PhoneNumber, Address, ProfileImg, ManagerID FROM Users'
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
                t.FirstName,
                t.LastName,
                t.Email,
                t.RoleID,
                t.JobTitle,
                t.DepartmentID,
                t.PhoneNumber,
                t.Address,
                t.ProfileImg,
                t.ManagerID
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
  
  const {name, firstName, lastName, address, phoneNumber, email, roleId, jobTitle, departmentId,  managerId,  passwordHash } = req.body || {};
  try {
    await poolConnect;
    const result = await pool.request()
    .input('FullName',sql.VarChar, name )
    .input('FirstName', sql.VarChar(30), firstName)
    .input('LastName', sql.VarChar(30), lastName)
    .input('Address', sql.VarChar(500), address)
    .input('PhoneNumber', sql.VarChar(20), phoneNumber)
    .input('Email', sql.VarChar(255), email)
    .input('RoleID', sql.Int, roleId)
    .input('JobTitle', sql.VarChar(50), jobTitle)
    .input('DepartmentID', sql.Int, departmentId)
    .input('ManagerID', sql.Int, managerId)
    .input('PasswordHash', sql.Text, passwordHash)
    .query(`
      INSERT INTO Users
      ( FullName, FirstName, LastName, Address, PhoneNumber, Email, RoleID, JobTitle, DepartmentID, ManagerID, PasswordHash )
      VALUES
      (@FullName, @FirstName, @LastName, @Address, @PhoneNumber, @Email, @RoleID, @JobTitle, @DepartmentID, @ManagerID, @PasswordHash );
      SELECT SCOPE_IDENTITY() AS UserID;
      `);
      res.status(201).json({userId: result.recordset[0].UserID});
    }catch (err){
       if (err.number === 2627 || err.number === 2601) {
    return res.status(409).json({
      code: 'EMAIL_EXISTS',
      message: 'An account with this email already exists.'
    });
  }

  res.status(500).json({
    message: 'Something went wrong. Please try again.'
  });
    }
});


export default router;