import { sql, pool, poolConnect } from '../db.js';
import express from 'express'
const router =  express.Router();


// ---------------------------------------
// Tickets
// -------------------------------------
// Get all tickets
router.get('/', async (_, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT t.*, creator.FullName AS CreatedByName, assignee.FullName AS AssignedToName, s.StatusName, p.PriorityName, c.CategoryName 
      FROM Tickets t
      JOIN dbo.Users creator ON t.CreatedBy = creator.UserID
      LEFT JOIN dbo.Users assignee ON t.AssignedTo = assignee.UserID
      JOIN TicketStatus s ON t.StatusID = s.StatusID
      JOIN TicketPriority p ON t.PriorityID = p.PriorityID
      JOIN Categories c ON t.CategoryID = c.CategoryID
      ORDER BY t.CreatedAt DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Ticket by TicketID
router.get('/:id', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .input('TicketID', sql.Int, req.params.id)
      .query(`
        SELECT 
          t.TicketID,
          t.Title,
          t.Description,
          t.CreatedAt,
          t.UpdatedAt,
          creator.FullName AS CreatedByName,
          assignee.FullName AS AssignedToName,
          s.StatusName,
          p.PriorityName,
          c.CategoryName
        FROM dbo.Tickets t
        JOIN dbo.Users creator ON t.CreatedBy = creator.UserID
        LEFT JOIN dbo.Users assignee ON t.AssignedTo = assignee.UserID
        JOIN dbo.TicketStatus s ON t.StatusID = s.StatusID
        JOIN dbo.TicketPriority p ON t.PriorityID = p.PriorityID
        JOIN dbo.Categories c ON t.CategoryID = c.CategoryID
        WHERE t.TicketID = @TicketID;
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create ticket
router.post('/', async (req, res) => {
  const { title, description, createdBy, assignedTo, statusId, priorityId, categoryId } = req.body || {};

  try {
    await poolConnect;
    const result = await pool.request()
      .input('Title', sql.VarChar, title)
      .input('Description', sql.Text, description)
      .input('CreatedBy', sql.Int, createdBy)
      .input('AssignedTo', sql.Int, assignedTo)
      .input('StatusID', sql.Int, statusId)
      .input('PriorityID', sql.Int, priorityId)
      .input('CategoryID', sql.Int, categoryId)
      .query(`
        INSERT INTO Tickets
          (Title, Description, CreatedBy, AssignedTo, StatusID, PriorityID, CategoryID)
        VALUES
          (@Title, @Description, @CreatedBy, @AssignedTo, @StatusID, @PriorityID, @CategoryID);

        SELECT SCOPE_IDENTITY() AS TicketID;
      `);

    res.status(201).json({ ticketId: result.recordset[0].TicketID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update ticket
router.put('/:id', async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  const {
    title,
    description,
    statusId,
    priorityId,
    categoryId,
    assignedTo
  } = req.body || {};

  if (isNaN(ticketId)) {
    return res.status(400).json({ message: 'Invalid ticket id' });
  }

  // Nothing to update
  if (
    title === undefined &&
    description === undefined &&
    statusId === undefined &&
    priorityId === undefined &&
    categoryId === undefined &&
    assignedTo === undefined
  ) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('TicketID', sql.Int, ticketId)
      .input('Title', sql.VarChar, title ?? null)
      .input('Description', sql.Text, description ?? null)
      .input('StatusID', sql.Int, statusId ?? null)
      .input('PriorityID', sql.Int, priorityId ?? null)
      .input('CategoryID', sql.Int, categoryId ?? null)
      .input('AssignedTo', sql.Int, assignedTo ?? null)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM dbo.Tickets WHERE TicketID = @TicketID)
        BEGIN
          THROW 50001, 'Ticket not found', 1;
        END

        UPDATE dbo.Tickets
        SET
          Title = COALESCE(@Title, Title),
          Description = COALESCE(@Description, Description),
          StatusID = COALESCE(@StatusID, StatusID),
          PriorityID = COALESCE(@PriorityID, PriorityID),
          CategoryID = COALESCE(@CategoryID, CategoryID),
          AssignedTo = @AssignedTo,
          UpdatedAt = GETDATE()
        WHERE TicketID = @TicketID;

        SELECT
          TicketID,
          Title,
          Description,
          StatusID,
          PriorityID,
          CategoryID,
          AssignedTo,
          UpdatedAt
        FROM dbo.Tickets
        WHERE TicketID = @TicketID;
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    if (err.message.includes('Ticket not found')) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------
// tickets End
// -------------------------------------

// Update status / assignment
router.put('/:id', async (req, res) => {
  const { statusId, assignedTo } = req.body || {};

  try {
    await poolConnect;
    await pool.request()
      .input('TicketID', sql.Int, req.params.id)
      .input('StatusID', sql.Int, statusId)
      .input('AssignedTo', sql.Int, assignedTo)
      .query(`
        UPDATE Tickets
        SET StatusID = @StatusID,
            AssignedTo = @AssignedTo,
            UpdatedAt = GETDATE()
        WHERE TicketID = @TicketID
      `);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete ticket by id
router.delete('/:id', async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);

  if (isNaN(ticketId)) {
    return res.status(400).json({ message: 'Invalid ticket id' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('TicketID', sql.Int, ticketId)
      .query(`
        -- Remove dependent records first
        DELETE FROM dbo.TicketAttachments WHERE TicketID = @TicketID;
        DELETE FROM dbo.TicketComments   WHERE TicketID = @TicketID;

        -- Delete the ticket
        DELETE FROM dbo.Tickets WHERE TicketID = @TicketID;

        SELECT @@ROWCOUNT AS AffectedRows;
      `);

    if (result.recordset[0].AffectedRows === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ success: true, ticketId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------
// Comments
// ---------------------------------------

// Create a comment for a ticket
router.post('/:id/comments', async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  const { userId, comment } = req.body || {};

  if (isNaN(ticketId)) {
    return res.status(400).json({ message: 'Invalid ticket id' });
  }

  if (!userId || !comment?.trim()) {
    return res.status(400).json({ message: 'userId and comment are required' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('TicketID', sql.Int, ticketId)
      .input('UserID', sql.Int, userId)
      .input('Comment', sql.Text, comment)
      .query(`
        -- Ensure ticket exists
        IF NOT EXISTS (SELECT 1 FROM dbo.Tickets WHERE TicketID = @TicketID)
        BEGIN
          THROW 50001, 'Ticket not found', 1;
        END

        -- Ensure user exists
        IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserID = @UserID)
        BEGIN
          THROW 50002, 'User not found', 1;
        END

        INSERT INTO dbo.TicketComments (TicketID, UserID, Comment)
        VALUES (@TicketID, @UserID, @Comment);

        SELECT
          SCOPE_IDENTITY() AS CommentID,
          @TicketID       AS TicketID,
          @UserID         AS UserID,
          @Comment        AS Comment,
          GETDATE()       AS CreatedAt;
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    if (err.message.includes('Ticket not found')) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (err.message.includes('User not found')) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get comments for a ticket
// GET /api/tickets/:id/comments
// Body (Json)
// {
//   "userId": 2,
//   "comment": "I am looking into this issue now."
// }
router.get('/:id/comments', async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);

  if (isNaN(ticketId)) {
    return res.status(400).json({ message: 'Invalid ticket id' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('TicketID', sql.Int, ticketId)
      .query(`
        SELECT
          c.CommentID,
          c.Comment,
          c.CreatedAt,
          u.UserID,
          u.FullName
        FROM dbo.TicketComments c
        JOIN dbo.Users u ON c.UserID = u.UserID
        WHERE c.TicketID = @TicketID
        ORDER BY c.CreatedAt ASC;
      `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update comment
// PUT /api/tickets/comments/:commentId
router.put('/comments/:commentId', async (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const { comment } = req.body || {};

  if (isNaN(commentId) || !comment?.trim()) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('CommentID', sql.Int, commentId)
      .input('Comment', sql.Text, comment)
      .query(`
        UPDATE dbo.TicketComments
        SET Comment = @Comment
        WHERE CommentID = @CommentID;

        SELECT @@ROWCOUNT AS AffectedRows;
      `);

    if (result.recordset[0].AffectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ success: true, commentId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete comment
// DELETE /api/tickets/comments/:commentId
router.delete('/comments/:commentId', async (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);

  if (isNaN(commentId)) {
    return res.status(400).json({ message: 'Invalid comment id' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('CommentID', sql.Int, commentId)
      .query(`
        DELETE FROM dbo.TicketComments
        WHERE CommentID = @CommentID;

        SELECT @@ROWCOUNT AS AffectedRows;
      `);

    if (result.recordset[0].AffectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ success: true, commentId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------
// Comments End
// ---------------------------------------



export default router;