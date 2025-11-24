import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Song = sequelize.define('Song', {
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
  albumId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'albums',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  lyrics: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'songs',
  timestamps: true
});

export default Song;