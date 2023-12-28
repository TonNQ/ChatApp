import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { REFRESH_TOKEN_EXPIRED } from '@/config';
import { LoginDTO } from '@/dtos/auth.dto';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { access_token, refresh_token, createUser: user } = await this.authService.signup(userData);
      user.password = '';
      user.resetPasswordSlug = '';
      // res.setHeader('Set-Cookie', [`REFRESH_TOKEN=${refresh_token}; HttpOnly; Max-Age=${REFRESH_TOKEN_EXPIRED};`]);
      res.status(201).json({ data: { access_token, refresh_token, user }, message: 'Create user success!' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginDTO = req.body;
      const { refresh_token, findUser: user, access_token } = await this.authService.login(userData);
      user.password = '';
      user.resetPasswordSlug = '';
      // res.setHeader('Set-Cookie', [`REFRESH_TOKEN=${refresh_token}; HttpOnly; Max-Age=${REFRESH_TOKEN_EXPIRED};`]);
      res.status(200).json({ data: { access_token, refresh_token, user }, message: 'Login success!' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      res.setHeader('Set-Cookie', ['REFRESH_TOKEN=; Max-age=0']);
      res.status(200).json({ message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public generateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = await this.authService.generateAccessToken(req, res);
      res.status(200).json({ data: access_token, message: 'generateAccessToken' });
    } catch (error) {
      next(error);
    }
  };

  public sendMailResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const info = await this.authService.sendMailResetPassword(req, res);
      res.status(200).json({ info: info.response, message: 'An email was send to your email!' });
    } catch (error) {
      next(error);
    }
  };

  public updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword } = req.body;
      const slug = req.params.slug;
      await this.authService.updatePassword(slug, newPassword);
      res.status(200).json({ message: 'updatePassword' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
