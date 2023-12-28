// Post Repository class

import { Post } from '@/interfaces/posts.interface';
import postModel from '@/models/posts.model';
import { Document } from 'mongoose';
import BaseRepository from './base.repository';

export default class PostRepository extends BaseRepository<Post & Document> {
  constructor() {
    super(postModel);
  }
}
