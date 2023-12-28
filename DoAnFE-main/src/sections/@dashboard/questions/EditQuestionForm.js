import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import axiosInstance from '../../../utils/axios';
import { uploadFile } from '../../../utils/upload';
import { fData } from '../../../utils/formatNumber';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { ROLES_ENUM, Config } from '../../../config/config';
import Label from '../../../components/label';
import Iconify from '../../../components/Iconify';

import {
  FormProvider,
  RHFSelect,
  RHFSwitch,
  RHFUploadSingleFile,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

EditQuestionForm.propTypes = {
  audio: PropTypes.string,
  lessonId: PropTypes.string,
  question: PropTypes.object,
  id: PropTypes.string,
};

export default function EditQuestionForm({ audio, lessonId, question, id }) {
  const audioRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = audio
    ? Yup.object().shape({
        image: Yup.mixed().nullable(),
        audioCutFrom: Yup.number()
          .required('Audio Cut From is required')
          .test('Is positive?', 'ERROR: The number must be greater than 0!', (value) => value >= 0)
          .test(
            'lessThanEqualDuration',
            'Audio Cut From must be less than or equal audio duration',
            (value) => value <= audioRef.current.duration
          )
          .test({
            name: 'lessThanEqualAudioCutTo',
            exclusive: false,
            params: {},
            message: 'Audio Cut From should less than or equal Audio Cut To',
            test: (value, context) => value <= parseFloat(context.parent.audioCutTo),
          }),
        audioCutTo: Yup.number()
          .required('Audio Cut To is required')
          .test('Is positive?', 'ERROR: The number must be greater than 0!', (value) => value >= 0)
          .test(
            'lessThanEqualDuration',
            'Audio Cut To must be less than or equal audio duration',
            (value) => value <= audioRef.current.duration
          ),
        answer: Yup.string().required('Answer is required'),
      })
    : Yup.object().shape({
        image: Yup.mixed().nullable(),
        answer: Yup.string().required('Answer is required'),
        audio: Yup.mixed().required('Audio is required'),
      });

  const defaultValues = {
    audioCutFrom: 0,
    audioCutTo: 0,
    image: question?.image ?? null,
    audio: question?.audio ?? null,
    answer: question?.answer ?? '',
  };

  useEffect(() => {
    reset(defaultValues);
    if (defaultValues.audio) {
      setValue('audio', `${Config.BACKEND_URL}${defaultValues.audio}`);
    }
    if (defaultValues.image) {
      setValue('image', `${Config.BACKEND_URL}${defaultValues.image}`);
    }
  }, [question]);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      const data = { ...values };
      data.lessonId = lessonId;
      data.audioCutFrom = +data.audioCutFrom;
      data.audioCutTo = +data.audioCutTo;
      if (data.image && (typeof data.image !== 'string' || !data?.image.includes(Config.BACKEND_URL))) {
        data.image = await uploadFile(values.image);
      } else if (data.image !== '') {
        data.image = defaultValues.image;
      }
      if (data.audio && (typeof data.audio !== 'string' || !data?.audio.includes(Config.BACKEND_URL))) {
        data.audio = await uploadFile(values.audio);
      } else if (data.audio !== '') {
        data.audio = defaultValues.audio;
      }
      const res = await axiosInstance.put(`questions/${id}`, data);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message },
      });
      reset();
      navigate(`${PATH_DASHBOARD.lessons.root}/${question?.lesson}`);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleDropAudio = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'audio',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="image"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {audio && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio controls src={`${Config.BACKEND_URL}${audio}`} ref={audioRef}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {audio && (
                <>
                  <RHFTextField
                    name="audioCutFrom"
                    label="Audio Cut From"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              if (audioRef.current) {
                                setValue('audioCutFrom', audioRef.current.currentTime, {
                                  shouldTouch: true,
                                });
                              }
                            }}
                            edge="end"
                          >
                            <Iconify icon={'material-symbols:more-time-rounded'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <RHFTextField
                    name="audioCutTo"
                    label="Audio Cut To"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              if (audioRef.current) {
                                setValue('audioCutTo', audioRef.current.currentTime, {
                                  shouldTouch: true,
                                });
                              }
                            }}
                            edge="end"
                          >
                            <Iconify icon={'material-symbols:more-time-rounded'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
            </Box>
            <RHFTextField name="answer" label="Answer" multiline rows={3} sx={{ mt: '15px' }} />
            {!audio && (
              <RHFUploadSingleFile
                name="audio"
                accept="audio/*"
                maxSize={3145728}
                onDrop={handleDropAudio}
                sx={{ mt: '15px' }}
              />
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
