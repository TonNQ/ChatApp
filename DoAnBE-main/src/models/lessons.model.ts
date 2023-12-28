import { model, Schema, Document, PaginateModel, Types } from 'mongoose';
import { Lesson } from '@interfaces/lessons.interface';
import paginate from 'mongoose-paginate-v2';

const lessonSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
      required: false,
    },
    isToeic: { type: Boolean, default: false },
    questions: [{ type: Types.ObjectId, ref: 'Question' }],
    topic: { type: Types.ObjectId, ref: 'Topic' },
  },
  { timestamps: true },
);

lessonSchema.index({ name: 1, topic: 1 }, { unique: true });
lessonSchema.plugin(paginate);

const lessonModel = model<Lesson & Document, PaginateModel<Lesson & Document>>('Lesson', lessonSchema, 'Lesson');

export default lessonModel;
