import { pool, poolConnect, sql } from '../db.js';
import express from 'express';
const router = express.Router();

// Get users
router.get('/', async (_, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(
      `SELECT 
      t.FullName, 
      t.UserID, 
      t.FirstName, 
      t.LastName, 
      t.Email, 
      t.RoleID, 
      t.JobTitle, 
      t.DepartmentID, 
      t.PhoneNumber, 
      t.Address, 
      t.ProfileImg, 
      t.ManagerID,
      r.RoleName,
      d.DepartmentName,
      u.FullName as ManagerName
      FROM Users t
      JOIN dbo.Roles r ON r.RoleID = t.RoleID
      JOIN dbo.Department d ON d.DepartmentID = t.DepartmentID
      LEFT JOIN dbo.Users u ON u.UserID = t.ManagerID 
      `
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
                t.ManagerID,
                r.RoleName,
                d.DepartmentName,
                u.FullName as ManagerName
            FROM dbo.Users t
            JOIN dbo.Roles r ON r.RoleID = t.RoleID
            JOIN dbo.Department d ON d.DepartmentID = t.DepartmentID
            LEFT JOIN dbo.Users u ON u.UserID = t.ManagerID
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

// Update User
router.put('/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
 const {name, firstName, lastName, address, phoneNumber, email, roleId, jobTitle, departmentId,  managerId } = req.body || {};

  
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  // Nothing to update
  if (
    name === undefined &&
    firstName === undefined &&
    lastName === undefined &&
    address === undefined &&
    phoneNumber === undefined &&
    email === undefined &&
    roleId === undefined &&
    jobTitle === undefined &&
    departmentId === undefined &&
    managerId === undefined 

  ) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .input('FullName', sql.VarChar(150), name)
      .input('FirstName', sql.VarChar(50), firstName )
      .input('LastName', sql.VarChar(50), lastName )
      .input('Address', sql.VarChar(500), address ?? null)
      .input('PhoneNumber', sql.VarChar(30), phoneNumber ?? null)
      .input('Email', sql.VarChar(100), email ?? null)
      .input('RoleID', sql.Int, roleId ?? null)
      .input('JobTitle', sql.VarChar(150), jobTitle ?? null)
      .input('DepartmentID', sql.Int, departmentId ?? null)
      .input('ManagerID', sql.Int, managerId ?? null)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserID = @UserID)
        BEGIN
          THROW 50001, 'User not found', 1;
        END

        UPDATE dbo.Users
        SET
          FullName = 
          COALESCE(@FirstName, FirstName) + ' ' + 
          COALESCE(@LastName, LastName),
          FirstName = COALESCE(@FirstName, FirstName),
          LastName = COALESCE(@LastName, LastName),
          Address = COALESCE(@Address, Address),
          PhoneNumber = COALESCE(@PhoneNumber, PhoneNumber),
          Email = COALESCE(@Email, Email),
          RoleID = COALESCE(@RoleID, RoleID),
          JobTitle = COALESCE(@JobTitle, JobTitle),
          DepartmentID = COALESCE(@DepartmentID, DepartmentID),
          ManagerID = COALESCE(@ManagerID, ManagerID)
        WHERE UserID = @UserID;

        SELECT
          UserID,
          FullName,
          FirstName,
          LastName,
          Address,
          PhoneNumber,
          Email,
          RoleID,
          JobTitle,
          DepartmentID,
          ManagerID
        FROM dbo.Users
        WHERE UserID = @UserID;
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    if (err.message.includes('User not found')) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ error: err.message });
  }
});


export default router;