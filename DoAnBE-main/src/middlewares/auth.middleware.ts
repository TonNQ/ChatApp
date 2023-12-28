import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import { ROLES_ENUM } from '@/interfaces/users.interface';

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
    if (Authorization) {
      const secretKey: string = ACCESS_TOKEN_SECRET;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = await userModel.findById(userId);
      findUser.password = '';
      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export const adminMiddleWare = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (user.role != ROLES_ENUM.ADMIN) throw new HttpException(403, 'This action requires administrator privileges');
    next();
  } catch (error) {
    next(new HttpException(403, 'This action requires administrator privileges'));
  }
};

export const isUserMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (user._id.toString() !== req.params.id) throw new HttpException(403, 'You cant edit this profile');
    next();
  } catch (error) {
    next(new HttpException(403, 'You cant edit this profile'));
  }
};
