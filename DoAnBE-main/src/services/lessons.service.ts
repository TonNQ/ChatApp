import { Topic } from '@/interfaces/topics.interface';
import LessonRepository from '@/repositories/lesson.repository';
import TopicRepository from '@/repositories/topic.repository';
import { CreateLessonDto } from '@dtos/lessons.dto';
import { HttpException } from '@exceptions/HttpException';
import { Lesson } from '@interfaces/lessons.interface';
import lessonModel from '@models/lessons.model';
import { isEmpty } from '@utils/util';
import { Document, FilterQuery, PaginateOptions } from 'mongoose';

class LessonService {
  private readonly lessons = lessonModel;
  private readonly lessonRepository: LessonRepository;
  private readonly topicRepository: TopicRepository;

  constructor() {
    this.lessonRepository = new LessonRepository();
    this.topicRepository = new TopicRepository();
  }

  public async findPaginateLesson(filter: FilterQuery<Lesson & Document>, options?: PaginateOptions) {
    return this.lessonRepository.findPaginate(filter, options);
  }

  public async findAllLesson(): Promise<Lesson[]> {
    const lessons: Lesson[] = await this.lessonRepository.findAll({}, {});
    return lessons;
  }

  public async findLessonById(lessonId: string): Promise<Lesson> {
    if (isEmpty(lessonId)) throw new HttpException(400, 'LessonId is empty');

    const findLesson: Lesson = await this.lessons.findOne({ _id: lessonId });
    if (!findLesson) throw new HttpException(409, "Lesson doesn't exist");
    return findLesson;
  }

  public async createLesson(data: CreateLessonDto): Promise<Lesson> {
    const { topicId, ...lessonData } = data;
    if (isEmpty(lessonData)) throw new HttpException(400, 'lessonData is empty');
    const findTopic: Topic = await this.topicRepository.findOne({ _id: topicId });
    if (!findTopic) throw new HttpException(409, `This topic id ${topicId} is not exists`);

    const createLessonData: Lesson = await this.lessons.create({ ...lessonData, topic: topicId });
    await this.topicRepository.updateOne({ _id: topicId }, { $addToSet: { lessons: createLessonData._id } });

    return createLessonData;
  }

  public async updateLesson(lessonId: string, data: CreateLessonDto): Promise<Lesson> {
    const { topicId, ...lessonData } = data;
    if (isEmpty(lessonData)) throw new HttpException(400, 'lessonData is empty');

    const findLesson: Lesson = await this.lessons.findOne({ _id: lessonId });
    if (!findLesson) throw new HttpException(409, "Lesson doesn't exist");
    await this.topicRepository.updateOne({ _id: findLesson.topic }, { $pull: { lessons: findLesson._id } });

    const updateLessonById: Lesson = await this.lessons.findByIdAndUpdate(lessonId, lessonData, { new: true });
    await this.topicRepository.updateOne({ _id: topicId }, { $push: { lessons: updateLessonById._id } });

    return updateLessonById;
  }

  public async deleteLesson(lessonId: string): Promise<Lesson> {
    const deleteLessonById: Lesson = await this.lessons.findByIdAndDelete(lessonId);
    if (!deleteLessonById) throw new HttpException(409, "Lesson doesn't exist");

    await this.topicRepository.updateOne({ _id: deleteLessonById.topic }, { $pull: { lessons: deleteLessonById._id } });
    return deleteLessonById;
  }
}

export default LessonService;
