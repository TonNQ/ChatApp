// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
// sections
import { NewTopicForm } from '../sections/@dashboard/topics';

// ----------------------------------------------------------------------

export default function NewTopic() {
  return (
    <Page title="Learn: New Topic">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new topic"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Topic', href: PATH_DASHBOARD.topics.root },
            { name: 'New Topic' },
          ]}
        />

        <NewTopicForm />
      </Container>
    </Page>
  );
}
