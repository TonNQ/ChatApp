// Lesson Repository class

import { Lesson } from '@/interfaces/lessons.interface';
import lessonModel from '@/models/lessons.model';
import { Document } from 'mongoose';
import BaseRepository from './base.repository';

export default class LessonRepository extends BaseRepository<Lesson & Document> {
  constructor() {
    super(lessonModel);
  }
}
