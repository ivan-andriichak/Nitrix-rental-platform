import { Router } from 'express';

import {
  addPhotos,
  createApartment,
  deleteApartment,
  getApartment,
  getApartments,
  updateApartment,
} from '../controllers/apartment.controller';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', upload.array('photos', 10), createApartment);
router.get('/', getApartments);
router.get('/:id', getApartment);
router.put('/:id', updateApartment);
router.delete('/:id', deleteApartment);
router.post('/:id/photos', upload.array('photos', 10), addPhotos);

export const apartmentRouter = router;
