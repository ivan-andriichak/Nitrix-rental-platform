import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from '../docs/swagger.json';
import { configs } from './configs/configs';
import { ApiError } from './errors/api-errors';
import { apartmentRouter } from './routes/apartment.routes';

// Створюємо додаток express
const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Origin', 'Access-Control-Allow-Origin'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

// Налаштовуємо парсер для обробки JSON-запитів
app.use(express.json());

// Налаштовуємо парсер для обробки URL-закодованих запитів
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

// app.use(rateLimit({ windowMs: 60 * 1000, limit: 5 }));
app.use('/api/apartments', apartmentRouter); // Роутер для обробки запитів квартир

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Обробник помилок для всіх маршрутів
// eslint-disable-next-line no-unused-vars
app.use('*', (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json(err.message); // Відправляє відповідь з помилкою і статусом 500
});

// Обробка неперехоплених винятків
process.on('uncaughtException', (e) => {
  console.error('uncaughtException', e.message, e.stack); // Виводить повідомлення та стек помилки
  process.exit(1); // Завершує процес з кодом 1
});

// Запускаємо сервер на вказаному хості та порту
app.listen(configs.APP_PORT, configs.APP_HOST, async () => {
  await mongoose.connect(configs.MONGO_URL, {}); // Підключається до MongoDB
  console.log(`Server is running on port ${configs.APP_PORT}`); // Виводить повідомлення про успішний запуск сервера
});
