import express from 'express';
import {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong
} from '../controllers/songController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getAllSongs)
  .post(protect, uploadImage('image'), createSong);

router
  .route('/:id')
  .get(getSongById)
  .put(protect, uploadImage('image'), updateSong)
  .delete(protect, deleteSong);

export default router;