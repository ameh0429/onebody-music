import { Artiste, Album, Song } from '../models/index.js';

export const createArtiste = async (req, res, next) => {
  try {
    const { name, desc } = req.body;
    const image = req.file ? req.file.path : null;

    const artiste = await Artiste.create({
      name,
      desc,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Artiste created successfully',
      data: { artiste }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllArtistes = async (req, res, next) => {
  try {
    const artistes = await Artiste.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: artistes.length,
      data: { artistes }
    });
  } catch (error) {
    next(error);
  }
};

export const getArtisteById = async (req, res, next) => {
  try {
    const artiste = await Artiste.findByPk(req.params.id, {
      include: [
        {
          model: Album,
          as: 'albums'
        },
        {
          model: Song,
          as: 'songs'
        }
      ]
    });

    if (!artiste) {
      return res.status(404).json({
        success: false,
        message: 'Artiste not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { artiste }
    });
  } catch (error) {
    next(error);
  }
};

export const updateArtiste = async (req, res, next) => {
  try {
    const artiste = await Artiste.findByPk(req.params.id);

    if (!artiste) {
      return res.status(404).json({
        success: false,
        message: 'Artiste not found'
      });
    }

    const { name, desc } = req.body;
    const image = req.file ? req.file.path : artiste.image;

    await artiste.update({
      name: name || artiste.name,
      desc: desc || artiste.desc,
      image
    });

    res.status(200).json({
      success: true,
      message: 'Artiste updated successfully',
      data: { artiste }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArtiste = async (req, res, next) => {
  try {
    const artiste = await Artiste.findByPk(req.params.id);

    if (!artiste) {
      return res.status(404).json({
        success: false,
        message: 'Artiste not found'
      });
    }

    await artiste.destroy();

    res.status(200).json({
      success: true,
      message: 'Artiste deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};