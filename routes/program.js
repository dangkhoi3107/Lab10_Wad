// routes/program.js
import { Router } from 'express';
import Program from '../models/Program.js';
import { Op } from 'sequelize';

const router = Router();

/**
 * POST /api/program
 * Create a new program
 */
router.post('/', async (req, res) => {
  try {
    const p = await Program.create(req.body);
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * GET /api/program
 * List all programs with pagination, sorting, and filtering by keyword
 * Query params: page, size, sortBy, keyword
 */
router.get('/', async (req, res) => {
  const { page = 0, size = 10, sortBy = 'name', keyword } = req.query;
  const offset = page * size;
  const limit = parseInt(size, 10);
  
  let where = {};
  if (keyword) {
    where.name = { [Op.like]: `%${keyword}%` };
  }

  try {
    const result = await Program.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, 'ASC']]
    });
    res.json({
      content: result.rows,
      totalElements: result.count,
      page: parseInt(page, 10),
      size: parseInt(size, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * GET /api/program/:program_name
 * Show detail for given program by name
 */
router.get('/:program_name', async (req, res) => {
  const { program_name } = req.params;
  try {
    const p = await Program.findOne({ where: { name: program_name } });
    if (!p) return res.status(404).json({ error: "Program not found" });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * PUT /api/program/:id
 * Update an existing program by id
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const p = await Program.findByPk(id);
    if (!p) return res.status(404).json({ error: "Program not found" });
    await p.update(req.body);
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * DELETE /api/program/:id
 * Delete an existing program by id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const p = await Program.findByPk(id);
    if (!p) return res.status(404).json({ error: "Program not found" });
    await p.destroy();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
