import { model, Schema, Document, PaginateModel } from 'mongoose';
import { User } from '@interfaces/users.interface';
import paginate from 'mongoose-paginate-v2';

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    province: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
    },
    commune: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    resetPasswordSlug: { type: String, default: '' },
    dateResetPasswordAllowed: { type: Date, default: () => new Date(Date.now()) },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  { timestamps: true },
);

userSchema.plugin(paginate);

const userModel = model<User & Document, PaginateModel<User & Document>>('User', userSchema, 'User');

export default userModel;
