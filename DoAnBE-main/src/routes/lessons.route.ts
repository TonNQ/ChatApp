import { Router } from 'express';
import LessonsController from '@controllers/lessons.controller';
import { CreateLessonDto } from '@dtos/lessons.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { PaginationInputDTO } from '@/dtos/pagination.dto';
import { authMiddleware, adminMiddleWare } from '@/middlewares/auth.middleware';

class LessonsRoute implements Routes {
  public path = '/lessons';
  public router = Router();
  public lessonsController = new LessonsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, validationMiddleware(PaginationInputDTO, 'query'), this.lessonsController.getLessons);
    this.router.get(`${this.path}/:id`, this.lessonsController.getLessonById);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      adminMiddleWare,
      validationMiddleware(CreateLessonDto, 'body'),
      this.lessonsController.createLesson,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      adminMiddleWare,
      validationMiddleware(CreateLessonDto, 'body', true),
      this.lessonsController.updateLesson,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, adminMiddleWare, this.lessonsController.deleteLesson);
  }
}

export default LessonsRoute;
