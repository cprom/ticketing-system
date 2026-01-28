import express from 'express';
import { pool, poolConnect } from '../db.js';

const router = express.Router();

// Get all statuses
router.get('/', async (_req, res) => {
  try {
    await poolConnect;

    const result = await pool.request().query(`
      SELECT
        StatusID,
        StatusName
      FROM dbo.TicketStatus
      ORDER BY StatusID;
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get status by id
router.get('/:id', async (req, res) => {
  const statusId = parseInt(req.params.id, 10);

  if (isNaN(statusId)) {
    return res.status(400).json({ message: 'Invalid status id' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('StatusID', statusId)
      .query(`
        SELECT
          StatusID,
          StatusName
        FROM dbo.TicketStatus
        WHERE StatusID = @StatusID;
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: 'Status not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;