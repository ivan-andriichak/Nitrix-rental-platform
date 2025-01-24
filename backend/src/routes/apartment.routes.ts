import { Router } from 'express';

import {
  createApartment,
  deleteApartment,
  getApartment,
  getApartments,
  updateApartment,
} from '../controllers/apartment.controller';

const router = Router();

router.post('/', createApartment);
router.get('/', getApartments);
router.get('/:id', getApartment);
router.put('/:id', updateApartment);
router.delete('/:id', deleteApartment);

export const apartmentRouter = router;
