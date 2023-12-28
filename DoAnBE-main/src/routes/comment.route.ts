import { Router } from 'express';
import CommentsController from '@controllers/comments.controller';
import { CreateCommentDto } from '@dtos/comments.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { PaginationInputDTO } from '@/dtos/pagination.dto';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminOrCommentOwner } from '@/middlewares/comment.middleware';
import { isAllowComment } from '@/middlewares/post.middleware';

class CommentsRoute implements Routes {
  public path = '/comments';
  public router = Router();
  public commentsController = new CommentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, validationMiddleware(PaginationInputDTO, 'query'), this.commentsController.getComments);
    this.router.get(`${this.path}/:id`, this.commentsController.getCommentById);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      isAllowComment,
      validationMiddleware(CreateCommentDto, 'body'),
      this.commentsController.createComment,
    );
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(CreateCommentDto, 'body', true), this.commentsController.updateComment);
    this.router.delete(`${this.path}/:id`, authMiddleware, adminOrCommentOwner, this.commentsController.deleteComment);
  }
}

export default CommentsRoute;
