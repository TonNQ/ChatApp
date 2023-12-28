import { Router } from 'express';
import UtilController from '@/controllers/utils.controller';
import { Routes } from '@interfaces/routes.interface';
import multer from 'multer';
import { fileFilter, fileStorage } from '@/utils/multer';

class UtilsRoute implements Routes {
  public path = '/utils';
  public router = Router();
  public utilController = new UtilController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}/words/:word`, this.utilController.findAudio);
    this.router.post(`${this.path}/file`, multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'), this.utilController.uploadFile);
  }
}

export default UtilsRoute;
