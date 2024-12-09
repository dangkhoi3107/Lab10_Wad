// models/CourseProgram.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Course from './Course.js';
import Program from './Program.js';

const CourseProgram = sequelize.define('CourseProgram', {
  courseId: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    field: 'course_id'
  },
  programId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'program_id'
  },
  courseCode: {
    type: DataTypes.STRING(255),
    field: 'course_code'
  },
  courseTypeId: {
    type: DataTypes.INTEGER,
    field: 'course_type_id'
  }
}, {
  tableName: 'course_program',
  timestamps: false
});

// Establish relationships
CourseProgram.belongsTo(Course, { foreignKey: 'courseId' });
CourseProgram.belongsTo(Program, { foreignKey: 'programId' });
Program.hasMany(CourseProgram, { foreignKey: 'programId' });
Course.hasMany(CourseProgram, { foreignKey: 'courseId' });

export default CourseProgram;
