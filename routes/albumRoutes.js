import express from 'express';
import {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum
} from '../controllers/albumController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getAllAlbums)
  .post(protect, uploadImage('image'), createAlbum);

router
  .route('/:id')
  .get(getAlbumById)
  .put(protect, uploadImage('image'), updateAlbum)
  .delete(protect, deleteAlbum);

export default router;