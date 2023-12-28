import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../routes/paths';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { NewLessonFrom } from '../sections/@dashboard/lessons';

// ----------------------------------------------------------------------

export default function NewLesson() {
  const { topicId } = useParams();
  return (
    <Page title="Learn: New Lesson">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new lesson"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Topic', href: `${PATH_DASHBOARD.topics.root}/${topicId}` },
            { name: 'New Lesson' },
          ]}
        />

        <NewLessonFrom />
      </Container>
    </Page>
  );
}
