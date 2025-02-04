import type { NextFunction, Request, Response } from 'express';

import { IApartment } from '../interfaces/apartment.interfaces';
import { Apartment } from '../models/apartment.model';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export const createApartment = async (req: Request, res: Response): Promise<void> => {
  const { title, description, price, rooms } = req.body as IApartment;

  // Спроба отримати файли, завантажені через multer
  const files = req.files as unknown as MulterFile[] | MulterFile | undefined;
  // Якщо файли передано – використовуємо їх шлях; якщо ні – дивимося, чи передано фото у тілі запиту
  let photos: string[] = [];
  if (files) {
    photos = Array.isArray(files) ? files.map((file) => `/uploads/${file.filename}`) : [`/uploads/${files.filename}`];
  } else if (req.body.photos) {
    photos = Array.isArray(req.body.photos) ? req.body.photos : [req.body.photos];
  }

  try {
    if (!photos.length) {
      // Якщо немає ні файлів, ні даних з тіла – повертаємо помилку
      res.status(400).json({ message: 'No photos uploaded' });
      return;
    }

    const newApartment = new Apartment({
      title,
      description,
      price,
      rooms,
      photos,
    });

    const savedApartment = await newApartment.save();
    res.status(201).json(savedApartment);
  } catch (err: any) {
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

export const addPhotos = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  console.log(req.files);
  // Отримуємо файли з req.files та приводимо їх до нашого типу
  const files = req.files as unknown as MulterFile[] | MulterFile | undefined;
  const newPhotos = files
    ? Array.isArray(files)
      ? files.map((file) => `/uploads/${file.filename}`)
      : [`/uploads/${(files as MulterFile).filename}`]
    : [];

  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    res.status(400).json({ message: 'No photos uploaded' });
    return;
  }

  try {
    // Знаходимо квартиру за id
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      res.status(404).json({ message: 'Apartment not found' });
      return;
    }

    // Додаємо нові фото до існуючого масиву
    apartment.photos = apartment.photos.concat(newPhotos);

    // Зберігаємо оновлену квартиру
    const updatedApartment = await apartment.save();
    res.status(201).json(updatedApartment);
  } catch (err: any) {
    res.status(500).json({ message: 'Error adding photos', error: err.message });
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
