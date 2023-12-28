import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Button,
  FormControl,
  RadioGroup,
  Stack,
  FormControlLabel,
  Radio,
  IconButton,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { LoadingButton } from '@mui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { EXAM_TYPES } from '../../../redux/actions/examAction';
import Image from '../../../components/Image';
import axiosInstance from '../../../utils/axios';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { Config } from '../../../config/config';
import { FormProvider } from '../../../components/hook-form';

// ----------------------------------------------------------------------

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

const styleValidation = {
  color: '#FF4842',
  lineHeight: 1.5,
  fontSize: '0.75rem',
  fontFamily: 'Public Sans,sans-serif',
  fontWeight: 400,
  textAlign: 'left',
  marginTop: '3px',
  marginRight: '14px',
  marginBottom: 0,
  marginLeft: '14px',
};

AnswerToeicQuestion.propTypes = {
  question: PropTypes.any,
  index: PropTypes.number,
  count: PropTypes.number,
  answers: PropTypes.array,
  updateAnswers: PropTypes.func,
  setIndex: PropTypes.any,
  checkAnswers: PropTypes.any,
  id: PropTypes.any,
};

export default function AnswerToeicQuestion({
  id,
  question,
  index,
  count,
  answers,
  updateAnswers,
  setIndex,
  checkAnswers,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const parentAudioRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [render, setRender] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const AnswerSchema = Yup.object().shape({});

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
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async () => {
    try {
      const { correct, isFinish } = checkAnswers();
      console.log({ correct, isFinish });
      handleOpen();
    } catch (error) {
      /* empty */
    }
  };

  const handleKeyDown = (event) => {
    event.preventDefault();
    if (event.ctrlKey && event.keyCode === 17 && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (event.keyCode === 37) {
      // left arrow key
      if (index > 0) setIndex(index - 1);
    } else if (event.keyCode === 39) {
      // right arrow key
      if (index < count) setIndex(index + 1);
    }
  };

  const handleChangeAnswer = (event) => {
    const selectedChoiceValue = event.target.value;
    setValue('answer', selectedChoiceValue);
    updateAnswers(index, selectedChoiceValue);
  };

  const onExamResult = () => {
    try {
      dispatch({ type: EXAM_TYPES.ANSWERS, payload: { answers, id } });
      navigate(`/dashboard/learn/lessons/${id}/result`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [index, count]);

  useEffect(() => {
    if (answers[index] && answers[index].value) {
      setValue('answer', answers[index].value);
      setRender(!render);
    } else {
      setValue('answer', '');
      setRender(!render);
    }
  }, [index, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            You're going to submit
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
            Do you want to continues?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button variant="contained" onClick={onExamResult} sx={{ padding: '5px', margin: '5px' }}>
              Continues
            </Button>
            <Button variant="outlined" onClick={handleClose} sx={{ padding: '5px', margin: '5px' }}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      <Grid container spacing={3}>
        {answers[index]?.parent?.text && (
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 1, textAlign: 'center', fontSize: 'bold' }}>{answers[index]?.parent?.text}</Card>
          </Grid>
        )}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              {question.image && (
                <Image
                  disabledEffect
                  visibleByDefault
                  alt="empty content"
                  style={{ objectFit: 'contain' }}
                  src={`${Config.BACKEND_URL}${question.image}`}
                  sx={{ height: 240, mb: 3 }}
                />
              )}
              {question.audio && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <audio controls src={`${Config.BACKEND_URL}${question.audio}`} ref={audioRef}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              )}
              {question.text}
            </Box>

            <FormControl component="fieldset" sx={{ display: 'flex', alignItems: 'center', mt: '10px' }}>
              <RadioGroup
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridRowGap: '10px',
                  gridColumnGap: '100px',
                }}
                aria-label="choices"
                name="choices"
                value={getValues('answer')}
                onChange={handleChangeAnswer}
              >
                {question?.choices.map((choice, index) => (
                  <FormControlLabel
                    sx={{
                      gridColumn: index % 2 === 0 ? '1' : '2',
                      gridRow: Math.floor(index / 2) + 1,
                    }}
                    key={index}
                    value={question?.choices[index]}
                    control={<Radio />}
                    label={question?.choices[index]}
                  />
                ))}
              </RadioGroup>
              {errors.choices && <div style={styleValidation}>{errors.choices.message}</div>}
              {errors.answer && <div style={styleValidation}>{errors.answer.message}</div>}
            </FormControl>

            <Stack
              alignItems="flex-end"
              sx={{ mt: '15px', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}
            >
              <Button
                variant="outlined"
                sx={{ mr: '15px' }}
                onClick={null}
                onClickCapture={() => {
                  setValue('answer', '');
                  updateAnswers(index, undefined);
                }}
              >
                Clear
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Submit Answer
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ py: '10px', px: 3, mb: '10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}>
              <ChromeReaderModeIcon sx={{ mr: '5px' }} />
              Parent Question Info
            </Box>

            <Box>
              {answers[index]?.parent?.image && (
                <Image
                  disabledEffect
                  visibleByDefault
                  alt="empty content"
                  src={`${Config.BACKEND_URL}${answers[index].parent.image}`}
                  style={{ objectFit: 'contain' }}
                  sx={{ height: 240, mb: 3 }}
                />
              )}

              {answers[index]?.parent?.audio && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <audio controls src={`${Config.BACKEND_URL}${answers[index].parent.audio}`} ref={parentAudioRef}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              )}
            </Box>
          </Card>
          <Card sx={{ py: '10px', px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}>
              <QuestionAnswerIcon sx={{ mr: '5px' }} />
              Question Palette
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                  sx={{ mr: '10px' }}
                  onClick={() => {
                    if (index > 0) setIndex(index - 1);
                    reset();
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                {` ${index + 1}/${count + 1} `}
                <IconButton
                  sx={{ ml: '10px' }}
                  onClick={() => {
                    if (index < count) setIndex(index + 1);
                    reset();
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            {answers.map((item, i) => {
              if (i === index) {
                return (
                  <Button
                    key={i}
                    onClick={() => {
                      setIndex(i);
                    }}
                    variant="contained"
                    size="large"
                    sx={{ mx: '5px', my: '5px' }}
                  >
                    {i + 1}
                  </Button>
                );
              }
              if (item.value) {
                return (
                  <Button
                    key={i}
                    onClick={() => {
                      setIndex(i);
                    }}
                    color="success"
                    variant="contained"
                    size="large"
                    sx={{ mx: '5px', my: '5px' }}
                  >
                    {i + 1}
                  </Button>
                );
              }
              return (
                <Button
                  key={i}
                  onClick={() => {
                    setIndex(i);
                  }}
                  variant="outlined"
                  size="large"
                  sx={{ mx: '5px', my: '5px' }}
                >
                  {i + 1}
                </Button>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
