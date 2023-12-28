import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../utils/axios';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

// ----------------------------------------------------------------------

const RootStyles = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------
BlogPostCommentForm.propTypes = {
  postId: PropTypes.string,
};

export default function BlogPostCommentForm({ postId }) {
  const dispatch = useDispatch();

  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
  });

  const defaultValues = {
    comment: '',
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post('/comments', {
        content: data.comment,
        postId,
      });
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message },
      });
      reset();
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } });
    }
  };

  return (
    <RootStyles>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Add Comment
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="comment" label="Comment *" multiline rows={3} />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Post comment
          </LoadingButton>
        </Stack>
      </FormProvider>
    </RootStyles>
  );
}
