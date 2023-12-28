import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useCallback, useRef } from 'react';
import { sentenceCase } from 'change-case';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// @mui
import {
  Box,
  Card,
  Container,
  Typography,
  Avatar,
  Table,
  Stack,
  Popover,
  MenuItem,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { PATH_DASHBOARD } from '../routes/paths';
import axiosInstance from '../utils/axios';
import Page from '../components/Page';
import Label from '../components/label';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { ROLES_ENUM, Config } from '../config/config';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
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

const TABLE_HEAD = [
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserPage() {
  const setTimerRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const [open, setOpen] = useState(false);
  const [selectId, setSelectId] = useState(null);

  const [render, setRender] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);

  const getUsers = useCallback(async () => {
    try {
      if (setTimerRef.current) {
        clearTimeout(setTimerRef.current);
        setTimerRef.current = null;
      }

      setTimerRef.current = setTimeout(async () => {
        const response = await axiosInstance.get(`users`, {
          params: { page: page + 1, limit: rowsPerPage, searchKey: filterName },
        });
        setUsers(response.data.data.data);
        setCount(response.data.data.page.itemCount);

        clearTimeout(setTimerRef.current);
        setTimerRef.current = null;
      }, 500);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }, [filterName, setTimerRef, page, rowsPerPage, render]);

  useEffect(() => {
    getUsers();
  }, [filterName, getUsers]);

  const handleOpenMenu = (event, id) => {
    setSelectId(id);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const onDeleteUser = async () => {
    try {
      const res = await axiosInstance.delete(`users/${selectId}`);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message },
      });
      setOpen(null);
      setRender(!render);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } });
    }
  };

  const isNotFound = !users.length && !!filterName;

  return (
    <Page title="Learn: Lesson">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Users'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Users', href: PATH_DASHBOARD.users.root },
          ]}
        />

        <Card sx={{ mt: '20px' }}>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {users &&
                    users.map((row) => {
                      const { email, firstName, lastName, avatarUrl, role, _id } = row;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(`${PATH_DASHBOARD.lessons.root}/${_id}`)}
                          >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" sx={{ pl: '15px' }} noWrap>
                                {email}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={`${lastName} ${firstName}`} src={`${Config.BACKEND_URL}${avatarUrl}`} />
                              <Typography variant="subtitle2" noWrap>
                                {`${lastName} ${firstName}`}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            <Label color={(role === ROLES_ENUM.USER && 'warning') || 'success'}>{role}</Label>
                          </TableCell>

                          <TableCell align="left">
                            <Label color={'success'}>{'True'}</Label>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, _id)}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[1, 5, 10, 15, 20]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* {!topic && !error && <SkeletonTopic />} */}

        {error && <Typography variant="h6">404 {error}!</Typography>}
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={onDeleteUser}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </Page>
  );
}
