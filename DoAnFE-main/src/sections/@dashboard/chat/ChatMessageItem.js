import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Image from '../../../components/Image';
import { Config } from '../../../config/config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversationTo: PropTypes.object,
  onOpenLightbox: PropTypes.func,
};

export default function ChatMessageItem({ message, conversationTo, onOpenLightbox }) {
  const { auth } = useSelector((state) => state);
  // const sender = conversation.participants.find((participant) => participant.id === message.senderId);
  const senderDetails =
    message.senderId === auth?.user?._id
      ? { type: 'me' }
      : {
          avatar: `${Config.BACKEND_URL}${conversationTo.avatarUrl}`,
          name: `${conversationTo.lastName} ${conversationTo.firstName}`,
        };

  const isMe = senderDetails.type === 'me';
  const isImage = message.contentType === 'image';

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto',
          }),
        }}
      >
        {senderDetails.type !== 'me' && (
          <Avatar alt={senderDetails.name} src={senderDetails.avatar} sx={{ width: 32, height: 32, mr: 2 }} />
        )}

        <div>
          <InfoStyle
            variant="caption"
            sx={{
              ...(isMe && { justifyContent: 'flex-end' }),
            }}
          >
            {!isMe && `${senderDetails.name},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' }),
              ...(isImage && { p: 0 }),
            }}
          >
            {isImage ? (
              <Image
                alt="attachment"
                src={message.body}
                onClick={() => onOpenLightbox(message.body)}
                sx={{ borderRadius: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              />
            ) : (
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {message.message}
              </Typography>
            )}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}
