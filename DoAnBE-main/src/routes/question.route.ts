import { Router } from 'express';
import QuestionsController from '@controllers/questions.controller';
import { AnswerQuestionDto, CreateQuestionDto, AloneQuestionDTO } from '@dtos/questions.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { authMiddleware, adminMiddleWare } from '@/middlewares/auth.middleware';
import { PaginationInputDTO } from '@/dtos/pagination.dto';

class QuestionsRoute implements Routes {
  public path = '/questions';
  public router = Router();
  public questionsController = new QuestionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, validationMiddleware(PaginationInputDTO, 'query'), this.questionsController.getQuestions);
    this.router.get(`${this.path}Alone`, validationMiddleware(AloneQuestionDTO, 'query'), this.questionsController.getAllAloneQuestion);
    this.router.get(`${this.path}/:id`, this.questionsController.getQuestionById);
    this.router.post(`${this.path}/:id/answer`, validationMiddleware(AnswerQuestionDto, 'body'), this.questionsController.answerQuestion);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      adminMiddleWare,
      validationMiddleware(CreateQuestionDto, 'body'),
      this.questionsController.createQuestion,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      adminMiddleWare,
      validationMiddleware(CreateQuestionDto, 'body', true),
      this.questionsController.updateQuestion,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, adminMiddleWare, this.questionsController.deleteQuestion);
  }
}

export default QuestionsRoute;
