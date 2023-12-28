import { model, Schema, Document, Types, PaginateModel } from 'mongoose';
import { Topic } from '@interfaces/topics.interface';
import paginate from 'mongoose-paginate-v2';

const topicSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      require: true,
    },
    lessons: [{ type: Types.ObjectId, ref: 'Lesson' }],
  },
  { timestamps: true },
);
topicSchema.plugin(paginate);

const topicModel = model<Topic & Document, PaginateModel<Topic & Document>>('Topic', topicSchema, 'Topic');

export default topicModel;
