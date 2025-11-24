import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SongFeaturedArtiste = sequelize.define('SongFeaturedArtiste', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  songId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'songs',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  artisteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artistes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'song_featured_artistes',
  timestamps: false
});

export default SongFeaturedArtiste;