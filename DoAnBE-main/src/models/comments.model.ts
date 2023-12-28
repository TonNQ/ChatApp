import { model, Schema, Document, PaginateModel } from 'mongoose';
import { Comment } from '@interfaces/comments.interface';
import paginate from 'mongoose-paginate-v2';
const mongoose = require('mongoose');

const commentSchema: Schema = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true },
);

commentSchema.plugin(paginate);

const commentModel = model<Comment & Document, PaginateModel<Comment & Document>>('Comment', commentSchema, 'Comment');

export default commentModel;
