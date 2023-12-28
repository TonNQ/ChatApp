import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto, EditUserDTO } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { adminMiddleWare, authMiddleware, isUserMiddleware } from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, adminMiddleWare, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, authMiddleware, adminMiddleWare, this.usersController.getUserById);
    this.router.get(`${this.path}/:id/info`, authMiddleware, this.usersController.getUserInfoById);
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), authMiddleware, this.usersController.createUser);
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(EditUserDTO, 'body', true),
      authMiddleware,
      isUserMiddleware,
      this.usersController.updateUser,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, adminMiddleWare, this.usersController.deleteUser);
  }
}

export default UsersRoute;
