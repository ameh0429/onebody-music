import { Album, Artiste, Song } from '../models/index.js';

export const createAlbum = async (req, res, next) => {
  try {
    const { name, artisteId, releaseYear } = req.body;
    const image = req.file ? req.file.path : null;

    const artiste = await Artiste.findByPk(artisteId);
    if (!artiste) {
      return res.status(404).json({
        success: false,
        message: 'Artiste not found'
      });
    }

    const album = await Album.create({
      name,
      artisteId,
      releaseYear,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Album created successfully',
      data: { album }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.findAll({
      include: [
        {
          model: Artiste,
          as: 'artiste',
          attributes: ['id', 'name', 'image']
        }
      ],
      order: [['releaseYear', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: albums.length,
      data: { albums }
    });
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const album = await Album.findByPk(req.params.id, {
      include: [
        {
          model: Artiste,
          as: 'artiste',
          attributes: ['id', 'name', 'image', 'desc']
        },
        {
          model: Song,
          as: 'songs',
          include: [
            {
              model: Artiste,
              as: 'mainArtiste',
              attributes: ['id', 'name', 'image']
            },
            {
              model: Artiste,
              as: 'featuredArtistes',
              attributes: ['id', 'name', 'image'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { album }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const album = await Album.findByPk(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    const { name, artisteId, releaseYear } = req.body;
    const image = req.file ? req.file.path : album.image;

    if (artisteId) {
      const artiste = await Artiste.findByPk(artisteId);
      if (!artiste) {
        return res.status(404).json({
          success: false,
          message: 'Artiste not found'
        });
      }
    }

    await album.update({
      name: name || album.name,
      artisteId: artisteId || album.artisteId,
      releaseYear: releaseYear || album.releaseYear,
      image
    });

    res.status(200).json({
      success: true,
      message: 'Album updated successfully',
      data: { album }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const album = await Album.findByPk(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    await album.destroy();

    res.status(200).json({
      success: true,
      message: 'Album deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};