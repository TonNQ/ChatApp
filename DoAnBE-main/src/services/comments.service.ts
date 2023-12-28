import CommentRepository from '@/repositories/comment.repository';
import PostRepository from '@/repositories/post.repository';
import { CreateCommentDto } from '@dtos/comments.dto';
import { HttpException } from '@exceptions/HttpException';
import { Comment } from '@interfaces/comments.interface';
import commentModel from '@models/comments.model';
import { isEmpty } from '@utils/util';
import { Document, FilterQuery, PaginateOptions } from 'mongoose';

class CommentService {
  private readonly comments = commentModel;
  private readonly commentRepository: CommentRepository;
  private readonly postRepository: PostRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
    this.postRepository = new PostRepository();
  }

  public async findPaginateComment(filter: FilterQuery<Comment & Document>, options?: PaginateOptions) {
    return this.commentRepository.findPaginate(filter, options);
  }

  public async findAllComment(): Promise<Comment[]> {
    const comments: Comment[] = await this.commentRepository.findAll({}, {});
    return comments;
  }

  public async findCommentById(commentId: string): Promise<Comment> {
    if (isEmpty(commentId)) throw new HttpException(400, 'CommentId is empty');

    const findComment: Comment = await this.comments.findOne({ _id: commentId });
    if (!findComment) throw new HttpException(409, "Comment doesn't exist");
    return findComment;
  }

  public async createComment(comment: CreateCommentDto): Promise<Comment> {
    const { postId, parentComment, ...commentData } = comment;
    if (isEmpty(commentData)) throw new HttpException(400, 'commentData is empty');
    let createCommentData: Comment;
    if (postId) {
      createCommentData = await this.comments.create({ ...commentData, post: postId });
      await this.postRepository.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: createCommentData._id },
        },
        { new: true },
      );
    } else if (parentComment) {
      createCommentData = await this.comments.create({ ...commentData, parentComment: parentComment });
      await this.commentRepository.findOneAndUpdate(
        { _id: parentComment },
        {
          $push: { replies: createCommentData._id },
        },
        { new: true },
      );
    }

    return createCommentData;
  }

  public async updateComment(commentId: string, commentData: CreateCommentDto): Promise<Comment> {
    if (isEmpty(commentData)) throw new HttpException(400, 'commentData is empty');
    const findComment: Comment = await this.comments.findOne({ _id: commentId });
    if (!findComment) throw new HttpException(409, "Comment doesn't exist");
    const updateCommentById: Comment = await this.comments.findByIdAndUpdate(commentId, commentData, { new: true });

    return updateCommentById;
  }

  public async deleteComment(commentId: string): Promise<Comment> {
    const deleteCommentById: Comment = await this.comments.findByIdAndDelete(commentId);
    if (!deleteCommentById) throw new HttpException(409, "Comment doesn't exist");
    if (deleteCommentById.post)
      await this.postRepository.findOneAndUpdate(
        { _id: deleteCommentById.post },
        {
          $pull: { comments: deleteCommentById._id },
        },
        { new: true },
      );
    if (deleteCommentById.parentComment)
      await this.commentRepository.findOneAndUpdate(
        { _id: deleteCommentById.post },
        {
          $pull: { comments: deleteCommentById._id },
        },
        { new: true },
      );
    return deleteCommentById;
  }
}

export default CommentService;
