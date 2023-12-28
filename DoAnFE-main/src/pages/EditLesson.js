import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PATH_DASHBOARD } from '../routes/paths';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import axiosInstance from '../utils/axios';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { EditLessonFrom } from '../sections/@dashboard/lessons';

// ----------------------------------------------------------------------

export default function EditLesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getLessonById() {
    try {
      const res = await axiosInstance.get(`lessons/${id}`);
      setLesson(res.data.data);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
    }
  }

  useEffect(() => {
    getLessonById();
  }, []);

  return (
    <Page title="Learn: Edit Lesson">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit lesson"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Topic', href: `${PATH_DASHBOARD.topics.root}/${id}` },
            { name: `Edit Lesson ${id}` },
          ]}
        />

        <EditLessonFrom lesson={lesson} id={id} />
      </Container>
    </Page>
  );
}
