import { model, Schema, Document, PaginateModel, Types } from 'mongoose';
import { Question } from '@interfaces/questions.interface';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const questionSchema: Schema = new Schema(
  {
    parentQuestion: { type: Schema.Types.ObjectId, ref: 'Question' },
    children: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    audio: {
      type: String,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    hint: {
      type: String,
    },
    choices: [{ type: String }],
    answer: {
      type: String,
      required: true,
    },
    lesson: { type: Types.ObjectId, ref: 'Lesson' },
  },
  { timestamps: true },
);

questionSchema.plugin(paginate);
questionSchema.plugin(aggregatePaginate);

const questionModel = model<Question & Document, PaginateModel<Question & Document>>('Question', questionSchema, 'Question');

export default questionModel;
