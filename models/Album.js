import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  artisteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artistes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'albums',
  timestamps: true
});

export default Album;