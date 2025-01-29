import { NextFunction, Request, Response } from 'express';

import { IApartment } from '../interfaces/apartment.interfaces';
import { Apartment } from '../models/apartment.model';

// eslint-disable-next-line no-unused-vars
export const createApartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, description, price, rooms, photos }: IApartment = req.body;

  try {
    const newApartment = new Apartment({ title, description, price, rooms, photos });
    const savedApartment = await newApartment.save();
    res.status(201).json(savedApartment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding apartment', error: err.message });
  }
};

// eslint-disable-next-line no-unused-vars
export const getApartments = async (req: Request, res: Response, next: NextFunction) => {
  const { priceMin, priceMax, rooms }: { priceMin?: number; priceMax?: number; rooms?: number } = req.query;

  try {
    const filters: any = {};
    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.$gte = priceMin;
      if (priceMax) filters.price.$lte = priceMax;
    }
    if (rooms) {
      filters.rooms = rooms;
    }

    const apartments = await Apartment.find(filters);
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving apartments', error: err.message });
  }
};

// eslint-disable-next-line no-unused-vars
export const getApartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      res.status(404).json({ message: 'Apartment not found' });
    }
    res.json(apartment);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving apartment', error: err.message });
  }
};

// eslint-disable-next-line no-unused-vars
export const updateApartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedApartment = await Apartment.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedApartment) {
      res.status(404).json({ message: 'Apartment not found' });
    }
    res.json(updatedApartment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating apartment', error: err.message });
  }
};

// eslint-disable-next-line no-unused-vars
export const deleteApartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedApartment = await Apartment.findByIdAndDelete(id);
    if (!deletedApartment) {
      res.status(404).json({ message: 'Apartment not found' });
    }
    res.status(200).json({ message: 'Apartment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting apartment', error: err.message });
  }
};
