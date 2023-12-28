import { useEffect, useState, useCallback } from 'react';
import { sentenceCase } from 'change-case';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Card, Divider, Container, Typography, IconButton, Modal, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ROLES_ENUM } from '../config/config';
import { PATH_DASHBOARD } from '../routes/paths';
import axiosInstance from '../utils/axios';
import Page from '../components/Page';
import Markdown from '../components/Markdown';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { SkeletonPost } from '../components/skeleton';
import {
  BlogPostHero,
  BlogPostTags,
  BlogPostRecent,
  BlogPostCommentList,
  BlogPostCommentForm,
} from '../sections/@dashboard/blog';
import { GLOBALTYPES } from '../redux/actions/globalTypes';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '15px',
  p: 4,
};

// ----------------------------------------------------------------------

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const [recentPosts, setRecentPosts] = useState([]);

  const [post, setPost] = useState(null);

  const [error, setError] = useState(null);

  const getPost = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`posts/${id}`);
      setPost(response.data.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }, [id]);

  // const getRecentPosts = useCallback(async () => {
  //   try {
  //     const response = await axiosInstance.get('/posts', {
  //       params: { page: 1, limit: 10, sort: { createdAt: -1 } },
  //     });
  //     setRecentPosts(response.data.data.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  const onDelete = async () => {
    try {
      const res = await axiosInstance.delete(`posts/${id}`);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message },
      });
      navigate(PATH_DASHBOARD.blog.posts);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } });
    }
  };

  useEffect(() => {
    getPost();
    // getRecentPosts();
  }, [/* getRecentPosts , */ getPost]);

  return (
    <Page title="Blog: Post Details">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Post Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: sentenceCase(id) },
          ]}
          action={
            auth?.user?._id.toString() === post?.user?._id.toString() || auth?.user?.role === ROLES_ENUM.ADMIN ? (
              <>
                <IconButton aria-label="delete" size="large" onClick={handleOpen}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  size="large"
                  onClick={() => {
                    navigate(`${PATH_DASHBOARD.blog.posts}/${id}/edit`);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={styleModal}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      Would you like to delete this!
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                      Once you delete this, you cannot undo it
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                      <Button variant="contained" onClick={onDelete} sx={{ padding: '5px', margin: '5px' }}>
                        Delete
                      </Button>
                      <Button variant="outlined" onClick={handleClose} sx={{ padding: '5px', margin: '5px' }}>
                        Close
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </>
            ) : null
          }
        />

        {post && (
          <Card>
            <BlogPostHero post={post} />

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h6" sx={{ mb: 5 }}>
                {post.description}
              </Typography>

              {/* <Markdown children={post.content} /> */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />

              <Box sx={{ my: 5 }}>
                <Divider />
                <BlogPostTags post={post} />
                <Divider />
              </Box>

              {post.canComment && (
                <>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography variant="h4">Comments</Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                      ({post.comments.length})
                    </Typography>
                  </Box>

                  <BlogPostCommentList post={post} />

                  <BlogPostCommentForm postId={id} />
                </>
              )}
            </Box>
          </Card>
        )}
        {!post && !error && <SkeletonPost />}
        {error && <Typography variant="h6">404 {error}!</Typography>}
        {/* <BlogPostRecent posts={recentPosts} /> */}
      </Container>
    </Page>
  );
}
