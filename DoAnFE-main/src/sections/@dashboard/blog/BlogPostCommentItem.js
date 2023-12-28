import { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Button, Avatar, Divider, ListItem, Typography, ListItemText, ListItemAvatar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../utils/axios';
import { fDate } from '../../../utils/formatTime';
import { Config } from '../../../config/config';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

// ----------------------------------------------------------------------

BlogPostCommentItem.propTypes = {
  name: PropTypes.string,
  avatarUrl: PropTypes.string,
  message: PropTypes.string,
  tagUser: PropTypes.string,
  postedAt: PropTypes.string,
  hasReply: PropTypes.bool,
  commentId: PropTypes.string,
};

export default function BlogPostCommentItem({ commentId, name, avatarUrl, message, tagUser, postedAt, hasReply }) {
  const [openReply, setOpenReply] = useState(false);

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
        parentComment: commentId,
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

  const handleReply = () => {
    setOpenReply(!openReply);
  };

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          alignItems: 'flex-start',
          py: 3,
          ...(hasReply && {
            ml: 'auto',
            width: (theme) => `calc(100% - ${theme.spacing(7)})`,
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar alt={name} src={`${Config.BACKEND_URL}${avatarUrl}`} sx={{ width: 48, height: 48 }} />
        </ListItemAvatar>

        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: 'subtitle1' }}
          secondary={
            <>
              <Typography
                gutterBottom
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.disabled',
                }}
              >
                {fDate(postedAt)}
              </Typography>
              <Typography component="span" variant="body2">
                {tagUser && 'Reply '}
                {tagUser && <strong style={{ color: 'black' }}>{tagUser}:</strong>} {message}
              </Typography>
            </>
          }
        />

        {!hasReply && (
          <Button size="small" onClick={handleReply} sx={{ position: 'absolute', right: 0 }}>
            {openReply ? 'Close' : 'Reply'}
          </Button>
        )}
      </ListItem>

      {!hasReply && openReply && (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'end',
              ml: 'auto',
              width: (theme) => `calc(100% - ${theme.spacing(7)})`,
            }}
          >
            <RHFTextField
              fullWidth
              size="small"
              name="comment"
              label="Reply"
              multiline
              rows={2}
              placeholder="Write comment"
              sx={{
                mr: 1,
                '& fieldset': {
                  borderWidth: `1px !important`,
                  borderColor: (theme) => `${theme.palette.grey[500_32]} !important`,
                },
              }}
            />

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Reply
            </LoadingButton>
          </Box>
        </FormProvider>
      )}

      <Divider
        sx={{
          ml: 'auto',
          width: (theme) => `calc(100% - ${theme.spacing(7)})`,
        }}
      />
    </>
  );
}
