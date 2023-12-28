import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import UtilsRoute from '@/routes/utils.route';
import TopicRoute from '@routes/topics.route';
import LessonRoute from '@routes/lessons.route';
import QuestionRoute from '@routes/question.route';
import PostsRoute from './routes/post.route';
import validateEnv from '@utils/validateEnv';
import CommentsRoute from './routes/comment.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new UtilsRoute(),
  new TopicRoute(),
  new LessonRoute(),
  new QuestionRoute(),
  new PostsRoute(),
  new CommentsRoute(),
]);

app.listen();

module.exports = app;
