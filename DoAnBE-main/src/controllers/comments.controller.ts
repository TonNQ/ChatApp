import { NextFunction, Request, Response } from 'express';
import { CreateCommentDto } from '@dtos/comments.dto';
import { Comment } from '@interfaces/comments.interface';
import CommentService from '@/services/comments.service';
import { pipeDTO } from '@/utils/pipeDTO';
import { RequestWithUser } from '@/interfaces/auth.interface';

class CommentsController {
  public commentService = new CommentService();

  public getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = pipeDTO(req.query);
      const { searchKey, limit, page, sort = { createdAt: -1 }, filter = {} } = query;
      if (searchKey) {
        filter['title'] = { $regex: new RegExp('.*' + searchKey + '.*', 'i') };
      }
      const options = { limit: +limit ?? 10, page: +page ?? 1, sort: sort };
      const findAllCommentsData: Comment[] = await this.commentService.findPaginateComment(filter, options);

      res.status(200).json({ data: findAllCommentsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId: string = req.params.id;
      const findOneCommentData: Comment = await this.commentService.findCommentById(commentId);

      res.status(200).json({ data: findOneCommentData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const commentData: CreateCommentDto = req.body;
      commentData.user = req.user._id;
      const createCommentData: Comment = await this.commentService.createComment(commentData);

      res.status(201).json({ data: createCommentData, message: 'Create comment success' });
    } catch (error) {
      next(error);
    }
  };

  public updateComment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const commentId: string = req.params.id;
      const commentData: CreateCommentDto = req.body;
      commentData.user = req.user._id;
      const updateCommentData: Comment = await this.commentService.updateComment(commentId, commentData);

      res.status(200).json({ data: updateCommentData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId: string = req.params.id;
      const deleteCommentData: Comment = await this.commentService.deleteComment(commentId);

      res.status(200).json({ data: deleteCommentData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CommentsController;
