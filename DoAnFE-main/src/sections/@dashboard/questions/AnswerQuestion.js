import PropTypes from 'prop-types';
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
  Grid,
  Tooltip,
} from '@mui/material';
// import { v4 as uuidv4 } from 'uuid';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { tooltipClasses } from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import Image from '../../../components/Image';
import axiosInstance from '../../../utils/axios';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { ROLES_ENUM, Config } from '../../../config/config';
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';

const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});
AnswerQuestion.propTypes = {
  question: PropTypes.any,
  nextQuestion: PropTypes.func,
  previousQuestion: PropTypes.func,
  index: PropTypes.number,
  count: PropTypes.number,
};

export default function AnswerQuestion({ question, nextQuestion, index, count, previousQuestion }) {
  const navigate = useNavigate();
  const [checkAnswer, setCheckAnswer] = useState([]);
  const audioRef = useRef(null);
  const [hide, setHide] = useState(true);
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const audioHiddenRef = useRef(null);
  const [render, setRender] = useState(false);

  const AnswerSchema = Yup.object().shape({
    answer: Yup.string().required('Answer is required'),
  });
  const defaultValues = {
    answer: '',
  };

  const methods = useForm({
    resolver: yupResolver(AnswerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      setHide(false);
      const data = { ...values };
      const res = await axiosInstance.post(`questions/${question._id}/answer`, data);
      setCheckAnswer(res.data.data);
      //   data.cover = await uploadFile(values.cover);
      //   dispatch(createPost(data, auth));
      //   reset();
      //   navigate(PATH_DASHBOARD.blog.posts);
    } catch (error) {
      //   dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } });
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.keyCode === 17) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleInputKeyDown = (event) => {
    setHide(true);
    if (event.keyCode === 13 && checkAnswer.length !== 1) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    } else if (event.keyCode === 13 && checkAnswer.length === 1) {
      event.preventDefault();
      setShowPronunciation(false);
      setCheckAnswer([]);
      nextQuestion();
      reset();
    }
  };

  const playAudio = async (word) => {
    const res = await axiosInstance.get(`utils/words/${word}`);
    setAudioURL(res.data.data.audio);
    setRender(!render);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (audioURL && audioURL !== '') {
      audioHiddenRef.current.play();
    }
  }, [render]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}>
              <IconButton
                sx={{ mr: '10px' }}
                onClick={() => {
                  setShowPronunciation(false);
                  setCheckAnswer([]);
                  previousQuestion();
                  reset();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              {` ${index + 1}/${count + 1} `}
              <IconButton
                sx={{ ml: '10px' }}
                onClick={() => {
                  setShowPronunciation(false);
                  setCheckAnswer([]);
                  nextQuestion();
                  reset();
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
            {
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio controls src={`${Config.BACKEND_URL}${question.audio}`} ref={audioRef}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
            }
            <RHFTextField
              onKeyDown={handleInputKeyDown}
              name="answer"
              label="Answer"
              fullWidth
              multiline
              rows={3}
              sx={{ mt: '15px' }}
            />

            <Stack
              alignItems="flex-end"
              sx={{ mt: '15px', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}
            >
              {checkAnswer.length !== 1 && (
                <>
                  <Button
                    variant="outlined"
                    onClick={null}
                    sx={{ mr: '15px' }}
                    onClickCapture={() => {
                      setValue('answer', question.answer);
                    }}
                  >
                    Skip
                  </Button>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Check
                  </LoadingButton>
                </>
              )}

              {checkAnswer.length === 1 && index < count && (
                <Button
                  variant="outlined"
                  onClick={null}
                  sx={{ ml: '15px' }}
                  color="success"
                  onClickCapture={() => {
                    setShowPronunciation(false);
                    setCheckAnswer([]);
                    nextQuestion();
                    reset();
                  }}
                >
                  Next
                </Button>
              )}

              {checkAnswer.length === 1 && index === count && (
                <Button
                  variant="outlined"
                  onClick={null}
                  sx={{ ml: '15px' }}
                  color="success"
                  onClickCapture={() => {
                    navigate(`${PATH_DASHBOARD.topics.root}`);
                  }}
                >
                  Come back
                </Button>
              )}
            </Stack>

            {checkAnswer.length === 1 && (
              <Box>
                <CheckIcon sx={{ color: 'Green', mt: '15px' }} />
                {' You are correct'}
              </Box>
            )}
            {!hide && checkAnswer.length !== 1 && (
              <Box>
                <ReportProblemIcon sx={{ color: 'yellow', mt: '15px' }} />
                {' Correct Answer:'}
                <Box sx={{ display: 'flex' }}>
                  {checkAnswer.map((item, i) => {
                    if (item[0] === -1)
                      return <pre key={i} style={{ color: 'red', fontSize: 'bold' }}>{`(${item[1]})`}</pre>;
                    if (item[0] === 0)
                      return (
                        <pre key={i} style={{ color: 'green', fontSize: 'bold' }}>
                          {item[1]}
                        </pre>
                      );
                    if (item[0] === 1)
                      return (
                        <pre key={i} style={{}}>
                          {item[1]}
                        </pre>
                      );
                    return null;
                  })}
                </Box>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {question.image && (
              <Image
                disabledEffect
                visibleByDefault
                alt="empty content"
                src={`${Config.BACKEND_URL}${question.image}`}
                sx={{ height: 240, mb: 3 }}
              />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}>
              <GraphicEqIcon sx={{ mr: '10px' }} />
              {'Pronunciation'}
              <CustomWidthTooltip title={'Click on each word to see!'} sx={{ ml: '10px' }}>
                <InfoIcon />
              </CustomWidthTooltip>
            </Box>
            {!showPronunciation && (
              <Box sx={{ cursor: 'pointer' }} onClick={() => setShowPronunciation(true)}>
                Click Here to show
              </Box>
            )}
            {
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio controls src={`${Config.BACKEND_URL}${audioURL}`} ref={audioHiddenRef} hidden>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
            }
            {showPronunciation &&
              question.answer.split(' ').map((item, i) => (
                <Box
                  key={i}
                  sx={{ display: 'inline-block', mr: '5px', cursor: 'pointer', borderBottom: '2px dotted grey' }}
                  onClick={() => playAudio(item)}
                >
                  {item}
                </Box>
              ))}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
