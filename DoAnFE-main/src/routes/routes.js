import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import SimpleLayout from '../layouts/simple';
import UserPage from '../pages/UserPage';
import UserEdit from '../pages/UserEdit';
import ChatPage from '../pages/ChatPage';
import UserProfile from '../pages/UserProfile';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import BlogPost from '../pages/BlogPost';
import BlogPosts from '../pages/BlogPosts';
import BlogNewPost from '../pages/BlogNewPost';
import BlogEditPost from '../pages/BlogEditPost';
import NewTopic from '../pages/NewTopic';
import EditTopic from '../pages/EditTopic';
import NewLesson from '../pages/NewLesson';
import EditLesson from '../pages/EditLesson';
import ExamResultPage from '../pages/ExamResultPage';
import NewQuestion from '../pages/NewQuestion';
import EditQuestion from '../pages/EditQuestion';
import LesonPage from '../pages/LessonPage';
import Page404 from '../pages/Page404';
import TopicsPage from '../pages/TopicsPage';
import TopicPage from '../pages/TopicPage';
import DashboardAppPage from '../pages/DashboardAppPage';
import AuthGuard from '../guards/AuthGuard';
import AdminGuard from '../guards/AdminGuard';
import GuestGuard from '../guards/GuestGuard';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        {
          path: 'app',
          element: <DashboardAppPage />,
        },
        {
          path: 'users',
          children: [
            {
              path: '',
              element: (
                <AdminGuard>
                  <UserPage />
                </AdminGuard>
              ),
            },
            { path: 'edit', element: <UserEdit /> },
            // { path: 'profile', element: <UserProfile /> },
          ],
        },
        {
          path: 'chats',
          element: <ChatPage />,
        },
        {
          path: 'learn',
          children: [
            { element: <Navigate to="/dashboard/learn/topics" replace />, index: true },
            { path: 'topics', element: <TopicsPage /> },
            { path: 'topics/:id', element: <TopicPage /> },
            { path: 'topics/new-topic', element: <NewTopic /> },
            { path: 'topics/:id/edit', element: <EditTopic /> },
            { path: ':topicId/new-lession', element: <NewLesson /> },
            { path: 'lessons/:id', element: <LesonPage /> },
            { path: 'lessons/:id/edit', element: <EditLesson /> },
            { path: 'lessons/:id/result', element: <ExamResultPage /> },
            { path: ':lessonId/new-question', element: <NewQuestion /> },
            { path: 'questions/:id/edit', element: <EditQuestion /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'posts/:id', element: <BlogPost /> },
            { path: 'posts/:id/edit', element: <BlogEditPost /> },
            { path: 'new-post', element: <BlogNewPost /> },
          ],
        },
      ],
    },
    {
      path: 'login',
      element: (
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      ),
    },
    {
      path: 'signup',
      element: (
        <GuestGuard>
          <SignUpPage />
        </GuestGuard>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <GuestGuard>
          <ForgotPasswordPage />
        </GuestGuard>
      ),
    },
    {
      path: 'reset-password/:slug',
      element: (
        <GuestGuard>
          <ResetPasswordPage />
        </GuestGuard>
      ),
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
