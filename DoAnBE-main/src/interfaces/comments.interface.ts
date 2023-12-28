import { ObjectId } from 'mongoose';
import { User } from './users.interface';

export interface Comment {
  _id: string;
  content: string;
  user: ObjectId | User;
  post?: ObjectId;
  replies?: ObjectId[];
  parentComment?: ObjectId;
}
