import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
const { v4: uuidv4 } = require('uuid');

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const fileStorage = multer.diskStorage({
  destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
    callback(null, path.join(__dirname, '../public/uploads/'));
  },

  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    callback(null, uuidv4() + path.extname(file.originalname));
  },
});

export const fileFilter = (request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
