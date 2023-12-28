import { Topic } from '@/interfaces/topics.interface';
import PostRepository from '@/repositories/post.repository';
import TopicRepository from '@/repositories/topic.repository';
import { CreatePostDto } from '@dtos/posts.dto';
import { HttpException } from '@exceptions/HttpException';
import { Post } from '@interfaces/posts.interface';
import postModel from '@models/posts.model';
import { isEmpty } from '@utils/util';
import { Document, FilterQuery, PaginateOptions } from 'mongoose';

class PostService {
  private readonly posts = postModel;
  private readonly postRepository: PostRepository;
  private readonly topicRepository: TopicRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.topicRepository = new TopicRepository();
  }

  public async findPaginatePost(filter: FilterQuery<Post & Document>, options?: PaginateOptions) {
    return this.postRepository.findPaginate(filter, options);
  }

  public async findAllPost(): Promise<Post[]> {
    const posts: Post[] = await this.postRepository.findAll({}, {});
    return posts;
  }

  public async findPostById(postId: string): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'PostId is empty');

    const findPost: Post = await this.posts.findOneAndUpdate(
      { _id: postId },
      { $inc: { views: 1 } },
      {
        new: true,
        populate: [
          {
            path: 'user',
            select: '-password -resetPasswordSlug',
          },
          {
            path: 'comments',
            populate: [
              {
                path: 'user',
                select: '-password -resetPasswordSlug',
              },
              {
                path: 'replies',
                populate: { path: 'user' },
              },
            ],
          },
        ],
      },
    );
    if (!findPost) throw new HttpException(409, "Post doesn't exist");
    return findPost;
  }

  public async createPost(postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');
    const createPostData: Post = await this.posts.create({ ...postData });
    return createPostData;
  }

  public async updatePost(postId: string, postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');
    const findPost: Post = await this.posts.findOne({ _id: postId });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");
    const updatePostById: Post = await this.posts.findByIdAndUpdate(postId, postData, { new: true });

    return updatePostById;
  }

  public async deletePost(postId: string): Promise<Post> {
    const deletePostById: Post = await this.posts.findByIdAndDelete(postId);
    if (!deletePostById) throw new HttpException(409, "Post doesn't exist");
    return deletePostById;
  }
}

export default PostService;
