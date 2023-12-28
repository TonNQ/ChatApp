import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { GenerateAccessTokenDTO, LoginDTO, SendMailResetPasswordDTO, UpdatePasswordDto } from '@/dtos/auth.dto';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDTO, 'body'), this.authController.logIn);
    this.router.post(`${this.path}/refresh_token`, validationMiddleware(GenerateAccessTokenDTO, 'body'), this.authController.generateAccessToken);
    this.router.post(`${this.path}/logout`, this.authController.logOut);
    this.router.post(
      `${this.path}/sendMailResetPassword`,
      validationMiddleware(SendMailResetPasswordDTO, 'body'),
      this.authController.sendMailResetPassword,
    );
    this.router.post(`${this.path}/updatePassword/:slug`, validationMiddleware(UpdatePasswordDto, 'body'), this.authController.updatePassword);
  }
}

export default AuthRoute;
