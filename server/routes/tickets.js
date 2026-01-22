import { sql, pool, poolConnect } from '../db.js';
import express from 'express'
const router =  express.Router();

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
  const { title, description, createdBy, assignedTo, statusId, priorityId, categoryId } = req.body;

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

// Update status / assignment
router.put('/:id', async (req, res) => {
  const { statusId, assignedTo } = req.body;

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

export default router;