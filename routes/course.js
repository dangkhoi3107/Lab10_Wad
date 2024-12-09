// routes/course.js
import { Router } from 'express';
import { Op } from 'sequelize';
import Course from '../models/Course.js';
import Program from '../models/Program.js';
import CourseProgram from '../models/CourseProgram.js';

const router = Router();

/**
 * POST /api/course
 * Create new course
 */
router.post('/', async (req, res) => {
  try {
    const c = await Course.create(req.body);
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * GET /api/courses
 * List all courses with pagination, sorting, and optional keyword filter
 * Query params: page, size, sortBy, keyword
 */
router.get('/s', async (req, res) => {
  const { page = 0, size = 10, sortBy = 'name', keyword } = req.query;
  const offset = page * size;
  const limit = parseInt(size, 10);

  let where = {};
  if (keyword) {
    where.name = { [Op.like]: `%${keyword}%` };
  }

  try {
    const result = await Course.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, 'ASC']]
    });
    res.json({
      content: result.rows,
      totalElements: result.count,
      page: parseInt(page,10),
      size: parseInt(size,10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * GET /api/course/:program_name
 * Show all courses of a given program
 */
router.get('/:program_name', async (req, res) => {
  const { program_name } = req.params;
  try {
    const program = await Program.findOne({ where: { name: program_name }});
    if (!program) return res.json([]);

    const cps = await CourseProgram.findAll({
      where: { programId: program.id },
      include: [Course]
    });
    const courses = cps.map(cp => cp.Course);
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * PUT /api/course/:id
 * Update an existing course by id
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const c = await Course.findByPk(id);
    if (!c) return res.status(404).json({ error: "Course not found" });
    await c.update(req.body);
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * DELETE /api/course/:id
 * Delete an existing course by id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const c = await Course.findByPk(id);
    if (!c) return res.status(404).json({ error: "Course not found" });
    await c.destroy();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
