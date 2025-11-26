import { Song, Artiste, Album, SongFeaturedArtiste } from '../models/index.js';

export const createSong = async (req, res, next) => {
  try {
    const { name, artisteId, albumId, lyrics, featuredArtistes } = req.body;
    const image = req.file ? req.file.path : null;

    const artiste = await Artiste.findByPk(artisteId);
    if (!artiste) {
      return res.status(404).json({
        success: false,
        message: 'Main artiste not found'
      });
    }

    if (albumId) {
      const album = await Album.findByPk(albumId);
      if (!album) {
        return res.status(404).json({
          success: false,
          message: 'Album not found'
        });
      }
    }

    const song = await Song.create({
      name,
      artisteId,
      albumId,
      lyrics,
      image
    });

    console.log('Featured artistes payload:', featuredArtistes);

let featuredArtisteIds = [];

if (featuredArtistes) {
  // Handle both single and multiple values from form-data
  if (Array.isArray(featuredArtistes)) {
    featuredArtisteIds = featuredArtistes.map(id => parseInt(id));
  } else {
    featuredArtisteIds = [parseInt(featuredArtistes)];
  }

  const featuredArtisteRecords = await Artiste.findAll({
    where: { id: featuredArtisteIds }
  });

  if (featuredArtisteRecords.length > 0) {
    await song.setFeaturedArtistes(featuredArtisteRecords);
  }
}

const songWithDetails = await Song.findByPk(song.id, {
  include: [
    {
      model: Artiste,
      as: 'mainArtiste',
      attributes: ['id', 'name', 'image']
    },
    {
      model: Album,
      as: 'album',
      attributes: ['id', 'name', 'image']
    },
    {
      model: Artiste,
      as: 'featuredArtistes',
      attributes: ['id', 'name', 'image'],
      through: { attributes: [] }
    }
  ]
});

    res.status(201).json({
      success: true,
      message: 'Song created successfully',
      data: { song: songWithDetails }
    });
  } catch (error) {
    next(error);
  }
};

// export const getAllSongs = async (req, res, next) => {
//   try {
//     const songs = await Song.findAll({
//       include: [
//         {
//           model: Artiste,
//           as: 'mainArtiste',
//           attributes: ['id', 'name', 'image']
//         },
//         {
//           model: Album,
//           as: 'album',
//           attributes: ['id', 'name', 'image']
//         },
//         {
//           model: Artiste,
//           as: 'featuredArtistes',
//           attributes: ['id', 'name', 'image'],
//           through: { attributes: [] }
//         }
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     res.status(200).json({
//       success: true,
//       count: songs.length,
//       data: { songs }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;       // Default to page 1
    const limit = parseInt(req.query.limit) || 10;    // Default to 10 items per page
    const offset = (page - 1) * limit;

    const { count, rows: songs } = await Song.findAndCountAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: Artiste,
          as: 'mainArtiste',
          attributes: ['id', 'name', 'image']
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'name', 'image']
        },
        {
          model: Artiste,
          as: 'featuredArtistes',
          attributes: ['id', 'name', 'image'],
          through: { attributes: [] }
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      data: { songs }
    });
  } catch (error) {
    next(error);
  }
};

export const getSongById = async (req, res, next) => {
  try {
    const song = await Song.findByPk(req.params.id, {
      include: [
        {
          model: Artiste,
          as: 'mainArtiste',
          attributes: ['id', 'name']
          // attributes: ['id', 'name', 'image', 'desc']
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'name']
          // attributes: ['id', 'name', 'image', 'releaseYear']
        },
        {
          model: Artiste,
          as: 'featuredArtistes',
          // attributes: ['id', 'name', 'image'],
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { song }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSong = async (req, res, next) => {
  try {
    const song = await Song.findByPk(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    const { name, artisteId, albumId, lyrics, featuredArtistes } = req.body;
    const image = req.file ? req.file.path : song.image;

    if (artisteId) {
      const artiste = await Artiste.findByPk(artisteId);
      if (!artiste) {
        return res.status(404).json({
          success: false,
          message: 'Main artiste not found'
        });
      }
    }

    if (albumId) {
      const album = await Album.findByPk(albumId);
      if (!album) {
        return res.status(404).json({
          success: false,
          message: 'Album not found'
        });
      }
    }

    await song.update({
      name: name || song.name,
      artisteId: artisteId || song.artisteId,
      albumId: albumId !== undefined ? albumId : song.albumId,
      lyrics: lyrics || song.lyrics,
      image
    });

    if (featuredArtistes && Array.isArray(featuredArtistes)) {
      await SongFeaturedArtiste.destroy({ where: { songId: song.id } });
      
      const featuredArtisteRecords = await Artiste.findAll({
        where: { id: featuredArtistes }
      });

      if (featuredArtisteRecords.length > 0) {
        await song.addFeaturedArtistes(featuredArtisteRecords);
      }
    }

    const updatedSong = await Song.findByPk(song.id, {
      include: [
        {
          model: Artiste,
          as: 'mainArtiste',
          attributes: ['id', 'name', 'image']
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'name', 'image']
        },
        {
          model: Artiste,
          as: 'featuredArtistes',
          attributes: ['id', 'name', 'image'],
          through: { attributes: [] }
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Song updated successfully',
      data: { song: updatedSong }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findByPk(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    await song.destroy();

    res.status(200).json({
      success: true,
      message: 'Song deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};