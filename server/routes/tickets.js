import { sql, pool, poolConnect } from '../db.js';
import express from 'express'
const router =  express.Router();

// Get all tickets
router.get('/', async (_, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT t.*, s.StatusName, p.PriorityName, c.CategoryName
      FROM Tickets t
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

// Create ticket
router.post('/', async (req, res) => {
  const { title, description, createdBy, priorityId, categoryId } = req.body;

  try {
    await poolConnect;
    const result = await pool.request()
      .input('Title', sql.VarChar, title)
      .input('Description', sql.Text, description)
      .input('CreatedBy', sql.Int, createdBy)
      .input('PriorityID', sql.Int, priorityId)
      .input('CategoryID', sql.Int, categoryId)
      .query(`
        INSERT INTO Tickets
          (Title, Description, CreatedBy, StatusID, PriorityID, CategoryID)
        VALUES
          (@Title, @Description, @CreatedBy, 1, @PriorityID, @CategoryID);

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

export default router;