import { useEffect, useState } from 'react';
import { Box, Divider, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';
import axiosInstance from '../../../utils/axios';

// ----------------------------------------------------------------------
ChatWindow.propTypes = {
  activeConversationId: PropTypes.string,
  handleSendMessage: PropTypes.func,
  conversation: PropTypes.array,
};

export default function ChatWindow({ activeConversationId, handleSendMessage, conversation }) {
  const [conversationTo, setConversationTo] = useState(null);
  useEffect(() => {
    if (activeConversationId) getUserInfo();
  }, [activeConversationId]);

  const getUserInfo = async () => {
    const res = await axiosInstance.get(`users/${activeConversationId}/info`);
    setConversationTo(res.data.data);
  };
  return (
    <Stack sx={{ minWidth: '1px', flexGrow: 1, width: '100%' }}>
      <Box sx={{ display: 'flex', overflow: 'hidden', flexGrow: 1, width: '100%' }}>
        <Stack sx={{ flexGrow: 1, width: '100%' }}>
          <ChatMessageList conversation={conversation} conversationTo={conversationTo} />

          <Divider />

          <ChatMessageInput
            conversationId={activeConversationId}
            onSend={handleSendMessage}
            disabled={activeConversationId === null}
          />
        </Stack>
      </Box>
    </Stack>
  );
}
