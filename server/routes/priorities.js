import { sql, pool, poolConnect } from '../config/db.js';
import express from 'express'
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router =  express.Router();



// Get all priorities
router.get('/', authenticate, authorize(["Admin", "User", "Agent","Tech"]), async (_req, res) => {
  try {
    await poolConnect;

    const result = await pool.request().query(`
      SELECT
        PriorityID,
        PriorityName
      FROM dbo.TicketPriority
      ORDER BY PriorityID;
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get priority by id
router.get('/:id', authenticate, authorize(["Admin", "User", "Agent","Tech"]), async (req, res) => {
  const priorityId = parseInt(req.params.id, 10);

  if (isNaN(priorityId)) {
    return res.status(400).json({ message: 'Invalid priority id' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('PriorityID', priorityId)
      .query(`
        SELECT
          PriorityID,
          PriorityName
        FROM dbo.TicketPriority
        WHERE PriorityID = @PriorityID;
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: 'Priority not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;