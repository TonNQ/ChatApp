import PropTypes from 'prop-types';
import { useEffect, useState, useCallback, useRef } from 'react';
import { sentenceCase } from 'change-case';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  Container,
  Typography,
  Modal,
  Button,
  Table,
  Stack,
  Popover,
  MenuItem,
  Paper,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TablePagination,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ROLES_ENUM, Config } from '../config/config';
import { PATH_DASHBOARD } from '../routes/paths';
import axiosInstance from '../utils/axios';
import { NewQuestionToeicForm, NewQuestionForm, QuestionListToolbar } from '../sections/@dashboard/questions';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import { LessonListHead } from '../sections/@dashboard/lessons';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { SkeletonTopic } from '../components/skeleton';
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
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'answer', label: 'Answer', alignRight: false },
  { id: 'audio', label: 'Audio', alignRight: false },
  { id: 'choices', label: 'Choices', alignRight: false },
  { id: 'text', label: 'Text', alignRight: false },
  { id: 'parent', label: 'Parent Id', alignRight: false },
  { id: 'createAt', label: 'Created At', alignRight: false },
  { id: '' },
];

LessonPageAdmin.propTypes = {
  lesson: PropTypes.any,
  setWiewAsUser: PropTypes.func,
  viewAsUser: PropTypes.bool,
};

export default function LessonPageAdmin({ lesson, viewAsUser, setWiewAsUser }) {
  const { id } = useParams();
  const setTimerRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [render, setRender] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [filterQuestionId, setFilterQuestionId] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);

  const getQuestions = useCallback(async () => {
    try {
      if (setTimerRef.current) {
        clearTimeout(setTimerRef.current);
        setTimerRef.current = null;
      }

      setTimerRef.current = setTimeout(async () => {
        const response = await axiosInstance.get(`questions`, {
          params: { page: page + 1, limit: rowsPerPage, filter: { lesson: id }, searchKey: filterQuestionId },
        });
        setQuestions(response.data.data.data);
        setCount(response.data.data.page.itemCount);

        clearTimeout(setTimerRef.current);
        setTimerRef.current = null;
      }, 500);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }, [filterQuestionId, setTimerRef, id, page, rowsPerPage, render]);

  const onDelete = async () => {
    try {
      const res = await axiosInstance.delete(`lessons/${id}`);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message },
      });
      navigate(`${PATH_DASHBOARD.topics.root}/${lesson?.topic}`);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } });
    }
  };

  const onDeleteQuesion = async () => {
    try {
      const res = await axiosInstance.delete(`questions/${selectId}`);
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

  useEffect(() => {
    getQuestions();
  }, [filterQuestionId, getQuestions]);

  // --------------------
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

  const handleFilterByQuestionId = (event) => {
    setPage(0);
    setFilterQuestionId(event.target.value);
  };

  const isNotFound = !questions.length && !!setFilterQuestionId;
  return (
    <>
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={lesson?.name ?? "Lesson's Name"}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Topics', href: PATH_DASHBOARD.topics.root },
            { name: 'Lesson', href: `${PATH_DASHBOARD.topics.root}/${lesson?.topic}` },
            { name: sentenceCase(id) },
          ]}
          action={
            auth?.user?.role === ROLES_ENUM.ADMIN ? (
              <>
                <IconButton aria-label="delete" size="large" onClick={handleOpen}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => {
                    navigate(`${PATH_DASHBOARD.lessons.root}/${id}/edit`);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <Switch onClick={setWiewAsUser} checked={viewAsUser} />
                <Modal
                  open={openModal}
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

        <Card>
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h6" sx={{ mb: 5 }}>
              {lesson?.isToeic ? 'Toeic' : 'Normal'}
            </Typography>
            {lesson?.isToeic ? (
              <NewQuestionToeicForm audio={lesson?.audio} lessonId={id} setRender={() => setRender(!render)} />
            ) : (
              <NewQuestionForm audio={lesson?.audio} lessonId={id} setRender={() => setRender(!render)} />
            )}
          </Box>
        </Card>

        <Card sx={{ mt: '20px' }}>
          <QuestionListToolbar filterQuestionId={filterQuestionId} onFilterQuestionId={handleFilterByQuestionId} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <LessonListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {questions &&
                    questions.map((row) => {
                      const { audio, choices, answer, createdAt, _id, image, parentQuestion, text } = row;
                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                          <TableCell align="left">
                            <Typography variant="subtitle2" sx={{ pl: '15px' }} noWrap>
                              {_id}
                            </Typography>
                          </TableCell>

                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            // sx={{ cursor: 'pointer' }}
                            // onClick={() => navigate(`${PATH_DASHBOARD.lessons.root}/${_id}`)}
                          >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar src={`${Config.BACKEND_URL}${image}`} />
                              <Typography variant="subtitle2" noWrap>
                                {answer}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            {
                              // eslint-disable-next-line jsx-a11y/media-has-caption
                              <audio controls src={`${Config.BACKEND_URL}${audio}`}>
                                Your browser does not support the
                                <code>audio</code> element.
                              </audio>
                            }
                          </TableCell>

                          <TableCell align="left">
                            <Typography variant="subtitle2" sx={{ pl: '15px' }} noWrap>
                              {choices.map((item) => (
                                <p key={item}>
                                  {item}
                                  <br />
                                </p>
                              ))}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">{text}</TableCell>

                          <TableCell align="left">{parentQuestion}</TableCell>

                          <TableCell align="left">{createdAt}</TableCell>

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
                            <strong>&quot;{filterQuestionId}&quot;</strong>.
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

        {!lesson && !error && <SkeletonTopic />}

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
        <MenuItem
          onClick={() => {
            console.log(`${PATH_DASHBOARD.questions.root}/${selectId}/edit`);
            navigate(`${PATH_DASHBOARD.questions.root}/${selectId}/edit`);
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={onDeleteQuesion}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
