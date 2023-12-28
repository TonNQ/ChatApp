import { Date } from 'mongoose';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl: string;
  resetPasswordSlug: string;
  dateResetPasswordAllowed: Date;
  role: ROLES_ENUM;
}

export enum ROLES_ENUM {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
