import { NextFunction, Request, Response } from 'express';
import { CreateQuestionDto } from '@dtos/questions.dto';
import { Question } from '@interfaces/questions.interface';
import QuestionService from '@services/question.service';
import { pipeDTO } from '@/utils/pipeDTO';
import { CutMp3 } from '@/utils/mp3-cutter';
import LessonService from '@/services/lessons.service';
const mongoose = require('mongoose');

class QuestionsController {
  public questionService = new QuestionService();
  public lessonService = new LessonService();

  public getQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = pipeDTO(req.query);
      const { searchKey, limit, page, sort = { createdAt: -1 }, filter } = query;
      let pipeline = [];
      if (filter['lesson']) {
        pipeline = [
          ...pipeline,
          {
            $match: {
              lesson: new mongoose.Types.ObjectId(filter['lesson']),
            },
          },
        ];
      }
      if (searchKey && searchKey != '') {
        pipeline = [
          ...pipeline,
          {
            $addFields: {
              questionId: { $toString: '$_id' },
            },
          },
          {
            $match: {
              questionId: { $regex: '.*' + searchKey + '.*', $options: 'i' },
            },
          },
        ];
      }
      const options = { limit: +limit ?? 10, page: +page ?? 1, sort: sort };
      const findAllQuestionsData: Question[] = await this.questionService.findAggregatePaginate(pipeline, options);

      res.status(200).json({ data: findAllQuestionsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getAllAloneQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = pipeDTO(req.query);
      const { filter = {} } = query;
      filter['parentQuestion'] = null;
      const findAllQuestionsData: Question[] = await this.questionService.getAllAloneQuestion(filter);

      res.status(200).json({ data: findAllQuestionsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId: string = req.params.id;
      const findOneQuestionData: Question = await this.questionService.findQuestionById(questionId);

      res.status(200).json({ data: findOneQuestionData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public answerQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId: string = req.params.id;
      const { answer } = req.body;
      const findOneQuestionData: any = await this.questionService.answerQuestion(questionId, answer);

      res.status(200).json({ data: findOneQuestionData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { audioCutFrom, audioCutTo, ...questionData }: CreateQuestionDto = req.body;
      if (!questionData.audio) {
        const lession = await this.lessonService.findLessonById(questionData.lessonId);
        if (lession.audio && lession.isToeic == false) {
          const audio = CutMp3(lession.audio, audioCutFrom, audioCutTo);
          questionData.audio = audio;
        }
      }
      const createQuestionData: Question = await this.questionService.createQuestion(questionData);
      res.status(201).json({ data: createQuestionData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId: string = req.params.id;
      const { audioCutFrom, audioCutTo, ...questionData }: CreateQuestionDto = req.body;
      if (audioCutFrom != 0 || audioCutTo != 0) {
        const lession = await this.lessonService.findLessonById(questionData.lessonId);
        const audio = CutMp3(lession.audio, audioCutFrom, audioCutTo);
        questionData.audio = audio;
      }
      const updateQuestionData: Question = await this.questionService.updateQuestion(questionId, questionData);

      res.status(200).json({ data: updateQuestionData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId: string = req.params.id;
      const deleteQuestionData: Question = await this.questionService.deleteQuestion(questionId);

      res.status(200).json({ data: deleteQuestionData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default QuestionsController;
