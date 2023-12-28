// Question Repository class

import { Question } from '@/interfaces/questions.interface';
import questionModel from '@/models/questions.model';
import { Model, Document } from 'mongoose';
import BaseRepository from './base.repository';

export default class QuestionRepository extends BaseRepository<Question & Document> {
  private questionModel: Model<Question & Document>;

  constructor() {
    super(questionModel);
    this.questionModel = questionModel;
  }

  async getAllAloneQuestion(filter) {
    return this.questionModel.find(filter).sort({ createdAt: 1 }).populate('children');
  }
}
