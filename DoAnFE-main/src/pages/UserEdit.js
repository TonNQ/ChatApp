import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { PATH_DASHBOARD } from '../routes/paths';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import UserEditForm from '../sections/@dashboard/user/UserEditForm';

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { pathname } = useLocation();
  const { name = '' } = useParams();

  const { auth } = useSelector((state) => state);

  return (
    <Page title="User: Edit user">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.users.root },
            { name: capitalCase(name) },
          ]}
        />

        <UserEditForm currentUser={auth?.user} />
      </Container>
    </Page>
  );
}
