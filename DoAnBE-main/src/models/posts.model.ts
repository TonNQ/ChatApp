import { model, Schema, Document, PaginateModel } from 'mongoose';
import { Post } from '@interfaces/posts.interface';
import paginate from 'mongoose-paginate-v2';
const mongoose = require('mongoose');

const postSchema: Schema = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    cover: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    metaTitle: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    metaDescription: {
      type: String,
      require: true,
    },
    tags: [{ type: String }],
    metaKeywords: [{ type: String }],
    canComment: { type: Boolean, default: true },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    views: {
      type: Number,
      default: 0,
    },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

postSchema.plugin(paginate);

const postModel = model<Post & Document, PaginateModel<Post & Document>>('Post', postSchema, 'Post');

export default postModel;
