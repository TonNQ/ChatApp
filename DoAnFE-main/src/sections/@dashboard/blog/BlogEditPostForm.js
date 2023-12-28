import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Chip, Stack, TextField, Typography, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import { uploadFile } from '../../../utils/upload';
import { updatePost } from '../../../redux/actions/postAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { Config } from '../../../config/config';

// ----------------------------------------------------------------------

const TAGS_OPTION = [
  'TOEIC',
  'TOEFL',
  'IELTS',
  'LEARNING',
  'NEWS',
  'READING',
  'LISTENING',
  'WRITING',
  'SPEAKING',
  'TIPS',
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------
BlogEditPostForm.propTypes = {
  post: PropTypes.object,
  id: PropTypes.string,
};

export default function BlogEditPostForm({ post, id }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    content: Yup.string().min(100).required('Content is required'),
    cover: Yup.mixed().required('Cover is required'),
    metaTitle: Yup.string().required('Meta title is required'),
    metaDescription: Yup.string().required('Meta description is required'),
  });

  const defaultValues = {
    title: post?.title ?? '',
    description: post?.description ?? '',
    content: post?.content ?? '',
    cover: post?.cover ?? null,
    tags: post?.tags ?? [],
    canComment: post?.canComment ?? true,
    metaTitle: post?.metaTitle ?? '',
    metaDescription: post?.metaDescription ?? '',
    metaKeywords: post?.metaKeywords ?? [],
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
    getValues,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    if (defaultValues.cover) {
      setValue('cover', `${Config.BACKEND_URL}${defaultValues.cover}`);
    }
  }, [post]);

  const onSubmit = async () => {
    try {
      const data = { ...values };
      if (typeof data.cover !== 'string' || !data?.cover.includes(Config.BACKEND_URL)) {
        data.cover = await uploadFile(values.cover);
      } else if (data.cover !== '') {
        data.cover = defaultValues.cover;
      }
      dispatch(updatePost(id, data));
      reset();
      navigate(PATH_DASHBOARD.blog.posts);
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
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Post Title" />

                <RHFTextField name="description" label="Description" multiline rows={3} />

                <div>
                  <LabelStyle>Content</LabelStyle>
                  <RHFEditor name="content" />
                </div>

                <div>
                  <LabelStyle>Cover</LabelStyle>
                  <RHFUploadSingleFile name="cover" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <RHFSwitch
                    name="canComment"
                    label="Enable comment"
                    labelPlacement="start"
                    sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                  />
                </div>

                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      value={getValues('tags')}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Tags" {...params} />}
                    />
                  )}
                />

                <RHFTextField name="metaTitle" label="Meta title" />

                <RHFTextField name="metaDescription" label="Meta description" fullWidth multiline rows={3} />

                <Controller
                  name="metaKeywords"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      value={getValues('metaKeywords')}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Meta keywords" {...params} />}
                    />
                  )}
                />
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
