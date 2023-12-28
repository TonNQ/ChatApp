import { Lesson } from '@/interfaces/lessons.interface';
import QuestionRepository from '@/repositories/question.repository';
import LessonRepository from '@/repositories/lesson.repository';
import { CreateQuestionDto } from '@dtos/questions.dto';
import { HttpException } from '@exceptions/HttpException';
import { Question } from '@interfaces/questions.interface';
import questionModel from '@models/questions.model';
import { isEmpty } from '@utils/util';
import { Document, FilterQuery, PaginateOptions, PipelineStage } from 'mongoose';
import DiffMatchPatch from 'diff-match-patch';

class QuestionService {
  private readonly questions = questionModel;
  private readonly questionRepository: QuestionRepository;
  private readonly lessonRepository: LessonRepository;

  constructor() {
    this.questionRepository = new QuestionRepository();
    this.lessonRepository = new LessonRepository();
  }

  public async answerQuestion(questionId: string, answer: string): Promise<any> {
    const findQuestion: Question = await this.questions.findOne({ _id: questionId });
    if (!findQuestion) throw new HttpException(409, "Question doesn't exist");
    const findLesson: Lesson = await this.lessonRepository.findOne({ _id: findQuestion.lesson });
    if (!findLesson.isToeic) {
      const dmp = new DiffMatchPatch();
      const diff = dmp.diff_main(answer.toLowerCase(), findQuestion.answer.toLowerCase());
      return diff;
    }
    return findQuestion.answer == answer;
  }

  public async findPaginateQuestion(filter: FilterQuery<Question & Document>, options?: PaginateOptions) {
    return this.questionRepository.findPaginate(filter, options);
  }

  public async findAggregatePaginate(pipeline?: PipelineStage[], options?: PaginateOptions) {
    return this.questionRepository.findAggregatePaginate(pipeline, options);
  }

  public async findAllQuestion(): Promise<Question[]> {
    const questions: Question[] = await this.questionRepository.findAll({}, {});
    return questions;
  }

  public async getAllAloneQuestion(filter): Promise<Question[]> {
    const questions: Question[] = await this.questionRepository.getAllAloneQuestion(filter);
    return questions;
  }

  public async findQuestionById(questionId: string): Promise<Question> {
    if (isEmpty(questionId)) throw new HttpException(400, 'QuestionId is empty');

    const findQuestion: Question = await this.questions.findOne({ _id: questionId }, {}, { populate: { path: 'parentQuestion' } });
    if (!findQuestion) throw new HttpException(409, "Question doesn't exist");
    return findQuestion;
  }

  public async createQuestion(data: Omit<CreateQuestionDto, 'audioCutFrom' | 'audioCutTo'>): Promise<Question> {
    const { lessonId, parentQuestion, ...questionData } = data;
    if (isEmpty(questionData)) throw new HttpException(400, 'questionData is empty');
    let createQuestionData: Question = null;

    if (parentQuestion && lessonId) {
      const findLesson: Lesson = await this.lessonRepository.findOne({ _id: lessonId });
      if (!findLesson) throw new HttpException(409, `This lesson id ${lessonId} is not exists`);
      const findQuestion: Question = await this.questionRepository.findOne({ _id: parentQuestion });
      if (!findQuestion) throw new HttpException(409, `This question id ${parentQuestion} is not exists`);
      if (!!findQuestion.parentQuestion) throw new HttpException(409, `Cant not create child for another child question`);
      if (findQuestion.text == '' && findQuestion.audio == null && findQuestion.text == null) throw new HttpException(409, `Parent data is empty`);
      if (findQuestion.answer != '' || findQuestion.choices.length != 0)
        await this.questions.findByIdAndUpdate(parentQuestion, { choices: [], answer: '' }, { new: true });
      createQuestionData = await this.questions.create({ ...questionData, parentQuestion: parentQuestion, lesson: lessonId });
      await this.questionRepository.findOneAndUpdate(
        { _id: parentQuestion },
        {
          $push: { children: createQuestionData._id },
        },
        { new: true },
      );
    } else if (lessonId) {
      const findLesson: Lesson = await this.lessonRepository.findOne({ _id: lessonId });
      if (!findLesson) throw new HttpException(409, `This lesson id ${lessonId} is not exists`);
      createQuestionData = await this.questions.create({ ...questionData, lesson: lessonId });
      await this.lessonRepository.updateOne({ _id: lessonId }, { $addToSet: { questions: createQuestionData._id } });
    }
    if (createQuestionData == null) throw new HttpException(409, 'Cant create question');
    return createQuestionData;
  }

  public async updateQuestion(questionId: string, data: Omit<CreateQuestionDto, 'audioCutFrom' | 'audioCutTo'>): Promise<Question> {
    const { lessonId, ...questionData } = data;
    if (isEmpty(questionData)) throw new HttpException(400, 'questionData is empty');

    const findQuestion: Question = await this.questions.findOne({ _id: questionId });
    await this.lessonRepository.updateOne({ _id: findQuestion.lesson }, { $pull: { questions: findQuestion._id } });

    const updateQuestionById: Question = await this.questions.findByIdAndUpdate(questionId, questionData, { new: true });
    if (!updateQuestionById) throw new HttpException(409, "Question doesn't exist");
    await this.lessonRepository.updateOne({ _id: lessonId }, { $push: { questions: updateQuestionById._id } });

    return updateQuestionById;
  }

  public async deleteQuestion(questionId: string): Promise<Question> {
    const deleteQuestionById: Question = await this.questions.findByIdAndDelete(questionId);
    if (!deleteQuestionById) throw new HttpException(409, "Question doesn't exist");

    await this.lessonRepository.updateOne({ _id: deleteQuestionById.lesson }, { $pull: { questions: deleteQuestionById._id } });
    return deleteQuestionById;
  }
}

export default QuestionService;
