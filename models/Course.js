// models/Course.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  courseLevelId: {
    type: DataTypes.INTEGER,
    field: 'course_level_id'
  },
  name: {
    type: DataTypes.STRING(255)
  },
  nameVn: {
    type: DataTypes.STRING(255),
    field: 'name_vn'
  },
  creditTheory: {
    type: DataTypes.INTEGER,
    field: 'credit_theory'
  },
  creditLab: {
    type: DataTypes.INTEGER,
    field: 'credit_lab'
  },
  description: DataTypes.TEXT
}, {
  tableName: 'course',
  timestamps: false
});

export default Course;
