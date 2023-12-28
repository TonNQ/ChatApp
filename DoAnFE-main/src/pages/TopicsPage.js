import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Stack, Button } from '@mui/material';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TopicSort, TopicList } from '../sections/@dashboard/topics';
import Iconify from '../components/Iconify';
import { getTopics } from '../redux/actions/topicAction';
import { PATH_DASHBOARD } from '../routes/paths';
import { ROLES_ENUM } from '../config/config';
// ----------------------------------------------------------------------

export default function TopicsPage() {
  const { topic } = useSelector((state) => state);
  const [filters, setFilters] = useState('latest');
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  useEffect(() => {
    let sort = { createdAt: -1 };
    if (filters === 'oldest') {
      sort = { createdAt: 1 };
    }
    dispatch(getTopics({ sort }));
  }, [dispatch, filters]);

  const handleChangeSort = (e) => {
    setFilters(e.target.value);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Topics | Minimal UI </title>
      </Helmet>

      <Container>
        <HeaderBreadcrumbs
          heading="Topic"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Topics' }]}
          action={
            auth?.user?.role === ROLES_ENUM.ADMIN ? (
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.topics.newTopic}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New Topic
              </Button>
            ) : null
          }
        />

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <TopicSort sort={filters} onSort={handleChangeSort} />
          </Stack>
        </Stack>

        <TopicList topics={topic.topics} />
      </Container>
    </>
  );
}
