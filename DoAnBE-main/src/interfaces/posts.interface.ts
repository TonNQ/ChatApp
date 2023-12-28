import { ObjectId } from 'mongodb';
import { User } from './users.interface';

export interface Post {
  _id: string;
  content: string;
  cover: string;
  title: string;
  metaTitle: string;
  description: string;
  metaDescription: string;
  canComment: boolean;
  tags?: string[];
  metaKeywords?: string[];
  views: number;
  user: ObjectId | User;
}
