import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PATH_DASHBOARD } from '../routes/paths';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { EditTopicForm } from '../sections/@dashboard/topics';
import axiosInstance from '../utils/axios';
import { GLOBALTYPES } from '../redux/actions/globalTypes';

// ----------------------------------------------------------------------

export default function EditTopic() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getTopicById() {
    try {
      const res = await axiosInstance.get(`topics/${id}`);
      setTopic(res.data.data);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
    }
  }

  useEffect(() => {
    getTopicById();
  }, []);

  return (
    <Page title="Learn: Edit Topic">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit topic"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Topic', href: PATH_DASHBOARD.topics.root },
            { name: `Edit Topic ${id}` },
          ]}
        />

        <EditTopicForm topic={topic} id={id} />
      </Container>
    </Page>
  );
}
