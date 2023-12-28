import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PATH_DASHBOARD } from '../routes/paths';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { BlogEditPostForm } from '../sections/@dashboard/blog';
import axiosInstance from '../utils/axios';
import { GLOBALTYPES } from '../redux/actions/globalTypes';

// ----------------------------------------------------------------------

export default function BlogEditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getPostById() {
    try {
      const res = await axiosInstance.get(`posts/${id}`);
      setPost(res.data.data);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
    }
  }

  useEffect(() => {
    getPostById();
  }, []);

  return (
    <Page title="Blog: Edit Post">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit post"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: `Edit Post ${id}` },
          ]}
        />

        <BlogEditPostForm post={post} id={id} />
      </Container>
    </Page>
  );
}
