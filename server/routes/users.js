import { pool, poolConnect, sql } from '../config/db.js';
import express from 'express';
import  authenticate  from '../middleware/authenticate.js';
import  authorize  from "../middleware/authorize.js";

const router = express.Router();


// Register user to firebase
router.put('/register/', async (req, res) => {
  try {
    const { uid, email } = req.body;
    // 🔎 Basic validation

    if (!uid || !email) {
      return res.status(400).json({
        message: "uid and email are required"
      });
    }

    await poolConnect;

    // 🔐 Parameterized query (NO injection risk)
    const result = await pool.request()
      .input("FirebaseUID", sql.NVarChar, uid)
      .input("Email", sql.VarChar, email)
      .query(`
        UPDATE dbo.Users
        SET FirebaseUID = @FirebaseUID
        WHERE Email = @Email
      `);

    // 🧠 Check if row was updated
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "User not found or already linked"
      });
    }

    res.status(200).json({
      message: "Firebase UID successfully linked to user"
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
});

// Get users
router.get('/',authenticate, async (_, res) => {
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




// Delete User (Hard)
//! Need to make constraints admin only
router.delete('/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .query(`
        -- Ensure user exists
        IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserID = @UserID)
        BEGIN
          THROW 50001, 'User not found', 1;
        END

        -- Prevent delete if tickets exist
        IF EXISTS (SELECT 1 FROM dbo.Tickets WHERE CreatedBy = @UserID)
        BEGIN
          THROW 50002, 'Cannot delete user with existing tickets', 1;
        END

        -- Remove user comments
        DELETE FROM dbo.TicketComments
        WHERE UserID = @UserID;

        -- Delete the user
        DELETE FROM dbo.Users
        WHERE UserID = @UserID;

        SELECT @@ROWCOUNT AS AffectedRows;
      `);

    if (result.recordset[0].AffectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, userId });

  } catch (err) {
    if (err.message.includes('User not found')) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (err.message.includes('existing tickets')) {
      return res.status(400).json({
        message: 'User cannot be deleted because tickets are associated with them'
      });
    }

    res.status(500).json({ error: err.message });
  }
});

// Delete User (Soft)
router.delete('/soft/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const deletedBy = req.body?.deletedBy || null; // optional admin id

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .input('DeletedBy', sql.Int, deletedBy)
      .query(`
        -- Ensure user exists
        IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserID = @UserID)
        BEGIN
          THROW 50001, 'User not found', 1;
        END

        -- Prevent double delete
        IF EXISTS (
          SELECT 1 FROM dbo.Users 
          WHERE UserID = @UserID AND IsActive = 0
        )
        BEGIN
          THROW 50002, 'User already deleted', 1;
        END

        -- Soft delete
        UPDATE dbo.Users
        SET 
          IsActive = 0,
          DeletedAt = GETDATE(),
          DeletedBy = @DeletedBy
        WHERE UserID = @UserID;

        SELECT 
          UserID,
          FirstName,
          LastName,
          Email,
          IsActive,
          DeletedAt,
          DeletedBy
        FROM dbo.Users
        WHERE UserID = @UserID;
      `);

    res.json({
      success: true,
      user: result.recordset[0]
    });

  } catch (err) {
    if (err.message.includes('User not found')) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (err.message.includes('already deleted')) {
      return res.status(400).json({ message: 'User already deleted' });
    }

    res.status(500).json({ error: err.message });
  }
});




export default router;