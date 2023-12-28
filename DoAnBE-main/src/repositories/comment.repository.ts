// Comment Repository class

import { Comment } from '@/interfaces/comments.interface';
import commentModel from '@/models/comments.model';
import { Document } from 'mongoose';
import BaseRepository from './base.repository';

export default class CommentRepository extends BaseRepository<Comment & Document> {
  constructor() {
    super(commentModel);
  }
}
