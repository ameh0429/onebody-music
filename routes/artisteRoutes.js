import express from 'express';
import {
  createArtiste,
  getAllArtistes,
  getArtisteById,
  updateArtiste,
  deleteArtiste
} from '../controllers/artisteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getAllArtistes)
  .post(protect, uploadImage('image'), createArtiste);

router
  .route('/:id')
  .get(getArtisteById)
  .put(protect, uploadImage('image'), updateArtiste)
  .delete(protect, deleteArtiste);

export default router;