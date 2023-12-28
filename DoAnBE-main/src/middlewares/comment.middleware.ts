import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { ROLES_ENUM, User } from '@/interfaces/users.interface';
import postModel from '@/models/posts.model';
import commentModel from '@/models/comments.model';
import { NextFunction, Response } from 'express';
import { Comment } from '@/interfaces/comments.interface';

export const adminOrCommentOwner = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (user.role != ROLES_ENUM.ADMIN) {
      const commentId = req.params.id;
      const findOneCommentData: Comment = await (await commentModel.findById(commentId)).populate('user');
      if ((findOneCommentData.user as User)._id.toString() !== user._id.toString())
        throw new HttpException(403, 'This action requires administrator privileges or you are post owner');
    }
    next();
  } catch (error) {
    next(new HttpException(403, 'This action requires administrator privileges or you are post owner'));
  }
};
