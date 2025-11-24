import sequelize from '../config/database.js';
import User from './User.js';
import Artiste from './Artiste.js';
import Album from './Album.js';
import Song from './Song.js';
import SongFeaturedArtiste from './SongFeaturedArtiste.js';

// Define associations
Artiste.hasMany(Album, { foreignKey: 'artisteId', as: 'albums' });
Album.belongsTo(Artiste, { foreignKey: 'artisteId', as: 'artiste' });

Artiste.hasMany(Song, { foreignKey: 'artisteId', as: 'songs' });
Song.belongsTo(Artiste, { foreignKey: 'artisteId', as: 'mainArtiste' });

Album.hasMany(Song, { foreignKey: 'albumId', as: 'songs' });
Song.belongsTo(Album, { foreignKey: 'albumId', as: 'album' });

Song.belongsToMany(Artiste, {
  through: SongFeaturedArtiste,
  foreignKey: 'songId',
  otherKey: 'artisteId',
  as: 'featuredArtistes'
});

Artiste.belongsToMany(Song, {
  through: SongFeaturedArtiste,
  foreignKey: 'artisteId',
  otherKey: 'songId',
  as: 'featuredInSongs'
});

export {
  sequelize,
  User,
  Artiste,
  Album,
  Song,
  SongFeaturedArtiste
};