import express from 'express';
import { pool, poolConnect } from '../db.js';

const router = express.Router();

// Get all categories
router.get('/', async (_req, res) => {
  try {
    await poolConnect;

    const result = await pool.request().query(`
      SELECT
        CategoryID,
        CategoryName
      FROM dbo.Categories
      ORDER BY CategoryID;
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get category by id
router.get('/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);

  if (isNaN(categoryId)) {
    return res.status(400).json({ message: 'Invalid category id' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('CategoryID', categoryId)
      .query(`
        SELECT
          CategoryID,
          CategoryName
        FROM dbo.Categories
        WHERE CategoryID = @CategoryID;
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;