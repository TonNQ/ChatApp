import * as Yup from 'yup';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Stack, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField, RHFUploadSingleFile, RHFSwitch } from '../../../components/hook-form';
import { uploadFile } from '../../../utils/upload';
import { createLesson } from '../../../redux/actions/lessonAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function NewLessonFrom() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { topicId } = useParams();

  const NewBlogSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    name: '',
    audio: null,
    isToeic: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
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
      const data = { ...values };
      if (values.audio) {
        data.audio = await uploadFile(values.audio);
      }
      data.topicId = topicId;
      await dispatch(createLesson(data));
      reset();
      navigate(`${PATH_DASHBOARD.topics.root}/${topicId}`);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } });
    }
  };

  const handleDrop = useCallback(
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
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Name" />

                <div>
                  <LabelStyle>Audio</LabelStyle>
                  <RHFUploadSingleFile name="audio" accept="audio/*" maxSize={3145728} onDrop={handleDrop} />
                </div>

                <div>
                  <RHFSwitch
                    name="isToeic"
                    label="Is this lesson Toeic?"
                    labelPlacement="start"
                    sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                  />
                </div>
              </Stack>
            </Card>
            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                Create
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
