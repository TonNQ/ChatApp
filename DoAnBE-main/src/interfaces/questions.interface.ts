import { ObjectId } from 'mongodb';

export interface Question {
  _id: string;
  parentQuestion: ObjectId;
  audio: string;
  text: string;
  image: string;
  hint: string;
  choices: string[];
  answer: string;
  lesson: string;
}
