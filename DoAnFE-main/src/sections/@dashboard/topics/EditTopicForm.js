import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import { uploadFile } from '../../../utils/upload';
import { createTopic, updateTopic } from '../../../redux/actions/topicAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { Config } from '../../../config/config';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------
EditTopicForm.propTypes = {
  topic: PropTypes.object,
  id: PropTypes.string,
};

export default function EditTopicForm({ topic, id }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const NewBlogSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    cover: Yup.mixed().required('Cover is required'),
  });

  const defaultValues = {
    name: topic?.name ?? '',
    description: topic?.description ?? '',
    cover: topic?.cover ?? null,
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

  useEffect(() => {
    reset(defaultValues);
    if (defaultValues.cover) {
      setValue('cover', `${Config.BACKEND_URL}${defaultValues.cover}`);
    }
  }, [topic]);

  const onSubmit = async () => {
    try {
      const data = { ...values };
      if (typeof data.cover !== 'string' || !data?.cover.includes(Config.BACKEND_URL)) {
        data.cover = await uploadFile(values.cover);
      } else if (data.cover !== '') {
        data.cover = defaultValues.cover;
      }
      dispatch(updateTopic(id, data));
      reset();
      navigate(PATH_DASHBOARD.topics.root);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'cover',
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

                <RHFTextField name="description" label="Description" multiline rows={3} />

                <div>
                  <LabelStyle>Cover</LabelStyle>
                  <RHFUploadSingleFile name="cover" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
                </div>
              </Stack>
            </Card>
            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
