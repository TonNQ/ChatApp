import { Router } from 'express';
import PostsController from '@controllers/posts.controller';
import { CreatePostDto } from '@dtos/posts.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { PaginationInputDTO } from '@/dtos/pagination.dto';
import { authMiddleware, adminMiddleWare } from '@/middlewares/auth.middleware';
import { adminOrPostOwner } from '@/middlewares/post.middleware';

class PostsRoute implements Routes {
  public path = '/posts';
  public router = Router();
  public postsController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, validationMiddleware(PaginationInputDTO, 'query'), this.postsController.getPosts);
    this.router.get(`${this.path}/:id`, this.postsController.getPostById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreatePostDto, 'body'), this.postsController.createPost);
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      adminOrPostOwner,
      validationMiddleware(CreatePostDto, 'body', true),
      this.postsController.updatePost,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, adminOrPostOwner, this.postsController.deletePost);
  }
}

export default PostsRoute;
