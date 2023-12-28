import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Post } from '@/interfaces/posts.interface';
import { ROLES_ENUM, User } from '@/interfaces/users.interface';
import postModel from '@/models/posts.model';
import { NextFunction, Response } from 'express';

export const adminOrPostOwner = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (user.role != ROLES_ENUM.ADMIN) {
      const postId: string = req.params.id;
      const findOnePostData: Post = await (await postModel.findById(postId)).populate('user');
      if ((findOnePostData.user as User)._id.toString() !== user._id.toString())
        throw new HttpException(403, 'This action requires administrator privileges or you are post owner');
    }
    next();
  } catch (error) {
    next(new HttpException(403, 'This action requires administrator privileges or you are post owner'));
  }
};

export const isAllowComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const postId: string = req.body.postId;
    if (postId) {
      const findOnePostData: Post = await postModel.findById(postId);
      if (!findOnePostData.canComment) throw new HttpException(403, 'This post not allowed comment');
    }
    next();
  } catch (error) {
    next(new HttpException(403, 'This post not allowed comment'));
  }
};
