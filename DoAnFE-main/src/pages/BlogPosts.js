import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// @mui
import { Grid, Button, Container, Stack, Box, Pagination } from '@mui/material';
// utils
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { SkeletonPostItem } from '../components/skeleton';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
// sections
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
import { getPosts } from '../redux/actions/postAction';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Popular' },
];

// ----------------------------------------------------------------------

export default function BlogPosts() {
  const [filters, setFilters] = useState('latest');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { post } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      let sort = { createdAt: -1 };
      if (filters === 'oldest') {
        sort = { createdAt: 1 };
      }
      if (filters === 'popular') {
        sort = { views: -1 };
      }
      dispatch(getPosts({ page: currentPage, limit: 10, sort, searchKey: search }));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, filters, search, currentPage]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeSort = (e) => {
    setFilters(e.target.value);
  };

  return (
    <Page title="Blog: Posts">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Blog"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: 'Posts' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.blog.newPost}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Post
            </Button>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch search={search} onChange={(e) => setSearch(e.target.value)} />
          <BlogPostsSort sort={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
        </Stack>

        <Grid container spacing={3}>
          {(!post.posts.length ? [...Array(12)] : post.posts).map((post, index) =>
            post ? <BlogPostCard key={post._id} post={post} index={index} /> : <SkeletonPostItem key={index} />
          )}
        </Grid>
        <Box sx={{ justifyContent: 'end', display: 'flex' }}>
          <Pagination count={post.page ?? 1} color="primary" page={currentPage} onChange={handlePageChange} />
        </Box>
      </Container>
    </Page>
  );
}
