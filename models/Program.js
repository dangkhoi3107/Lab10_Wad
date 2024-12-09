// models/Program.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  duration: DataTypes.INTEGER,
  version: DataTypes.STRING(4),
  majorId: {
    type: DataTypes.INTEGER,
    field: 'major_id'
  },
  programTypeId: {
    type: DataTypes.INTEGER,
    field: 'program_type_id'
  },
  validFrom: {
    type: DataTypes.STRING(255),
    field: 'valid_from'
  }
}, {
  tableName: 'program',
  timestamps: false
});

export default Program;
