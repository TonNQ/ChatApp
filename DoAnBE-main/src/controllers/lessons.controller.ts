import { NextFunction, Request, Response } from 'express';
import { CreateLessonDto } from '@dtos/lessons.dto';
import { Lesson } from '@interfaces/lessons.interface';
import LessonService from '@/services/lessons.service';
import { pipeDTO } from '@/utils/pipeDTO';

class LessonsController {
  public lessonService = new LessonService();

  public getLessons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = pipeDTO(req.query);
      const { searchKey, limit, page, sort = { createdAt: -1 }, filter = {} } = query;
      if (searchKey) {
        filter['name'] = { $regex: new RegExp('.*' + searchKey + '.*', 'i') };
      }
      const options = { limit: +limit ?? 10, page: +page ?? 1, sort: sort };
      const findAllLessonsData: Lesson[] = await this.lessonService.findPaginateLesson(filter, options);

      res.status(200).json({ data: findAllLessonsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getLessonById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lessonId: string = req.params.id;
      const findOneLessonData: Lesson = await this.lessonService.findLessonById(lessonId);

      res.status(200).json({ data: findOneLessonData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lessonData: CreateLessonDto = req.body;
      const createLessonData: Lesson = await this.lessonService.createLesson(lessonData);

      res.status(201).json({ data: createLessonData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lessonId: string = req.params.id;
      const lessonData: CreateLessonDto = req.body;
      const updateLessonData: Lesson = await this.lessonService.updateLesson(lessonId, lessonData);

      res.status(200).json({ data: updateLessonData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lessonId: string = req.params.id;
      const deleteLessonData: Lesson = await this.lessonService.deleteLesson(lessonId);

      res.status(200).json({ data: deleteLessonData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default LessonsController;
