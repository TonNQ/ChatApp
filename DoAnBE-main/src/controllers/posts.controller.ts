import { NextFunction, Request, Response } from 'express';
import { CreatePostDto } from '@dtos/posts.dto';
import { Post } from '@interfaces/posts.interface';
import PostService from '@/services/posts.service';
import { pipeDTO } from '@/utils/pipeDTO';
import { RequestWithUser } from '@/interfaces/auth.interface';

class PostsController {
  public postService = new PostService();

  public getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = pipeDTO(req.query);
      const { searchKey, limit, page, sort = { createdAt: -1 }, filter = {} } = query;
      if (searchKey) {
        filter['title'] = { $regex: new RegExp('.*' + searchKey + '.*', 'i') };
      }
      const options = { limit: +limit ?? 10, page: +page ?? 1, sort: sort, populate: [{ path: 'user', select: '-password -resetPasswordSlug' }] };
      const findAllPostsData: Post[] = await this.postService.findPaginatePost(filter, options);

      res.status(200).json({ data: findAllPostsData, message: 'Get All Post' });
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const findOnePostData: Post = await this.postService.findPostById(postId);

      res.status(200).json({ data: findOnePostData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const postData: CreatePostDto = req.body;
      postData.user = req.user._id;
      const createPostData: Post = await this.postService.createPost(postData);

      res.status(201).json({ data: createPostData, message: 'Create post success' });
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const postData: CreatePostDto = req.body;
      postData.user = req.user._id;
      const updatePostData: Post = await this.postService.updatePost(postId, postData);

      res.status(200).json({ data: updatePostData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const deletePostData: Post = await this.postService.deletePost(postId);

      res.status(200).json({ data: deletePostData, message: 'Delete post success' });
    } catch (error) {
      next(error);
    }
  };
}

export default PostsController;
