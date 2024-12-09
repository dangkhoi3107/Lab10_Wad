// routes/course_program.js
import { Router } from 'express';
import { Op } from 'sequelize';
import Course from '../models/Course.js';
import Program from '../models/Program.js';
import CourseProgram from '../models/CourseProgram.js';

const router = Router();

/**
 * POST /api/course_program
 * Create new course_program given course_name and program_name (and optional course_code, course_type_id)
 * Example: /api/course_program?course_name=Introduction%20to%20Programming&program_name=ComputerScience&course_code=CS101&course_type_id=1
 */
router.post('/', async (req, res) => {
  const { course_name, program_name, course_code, course_type_id } = req.query;
  try {
    const course = await Course.findOne({ where: { name: course_name }});
    const program = await Program.findOne({ where: { name: program_name }});
    if (!course || !program) return res.status(404).json({ error: "Not found course or program" });

    const cp = await CourseProgram.create({
      courseId: course.id,
      programId: program.id,
      courseCode: course_code,
      courseTypeId: course_type_id
    });
    res.json(cp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * GET /api/course_program/:program_name
 * List all courses of given program, with optional filter/sort
 * Query params: page, size, sortBy, keyword - similar to others
 */
router.get('/:program_name', async (req, res) => {
  const { program_name } = req.params;
  const { page=0, size=10, sortBy='courseCode', keyword } = req.query;
  const offset = page * size;
  const limit = parseInt(size, 10);

  try {
    const program = await Program.findOne({ where: { name: program_name }});
    if (!program) return res.json([]);

    // Retrieve all CourseProgram for this program
    let where = { programId: program.id };
    if (keyword) {
      where.courseCode = { [Op.like]: `%${keyword}%` };
    }

    const result = await CourseProgram.findAndCountAll({
      where,
      include: [Course],
      limit,
      offset,
      order: [[sortBy, 'ASC']]
    });

    const courses = result.rows.map(cp => cp.Course);
    res.json({
      content: courses,
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
 * DELETE /api/course_program/:course_name/:program_name
 * Delete an existing course_program given course_name and program_name
 */
router.delete('/:course_name/:program_name', async (req, res) => {
  const { course_name, program_name } = req.params;
  try {
    const course = await Course.findOne({ where: { name: course_name }});
    const program = await Program.findOne({ where: { name: program_name }});
    if (!course || !program) return res.status(404).json({ error: "Not found course or program" });

    const cp = await CourseProgram.findOne({
      where: { courseId: course.id, programId: program.id }
    });
    if (!cp) return res.status(404).json({ error: "CourseProgram record not found" });
    await cp.destroy();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
