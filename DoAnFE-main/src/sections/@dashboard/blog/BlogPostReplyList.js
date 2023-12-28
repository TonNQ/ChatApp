import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, List, Button } from '@mui/material';
import BlogPostCommentItem from './BlogPostCommentItem';

// ----------------------------------------------------------------------

BlogPostReplyList.propTypes = {
  replies: PropTypes.array,
  tagUser: PropTypes.string,
};

export default function BlogPostReplyList({ replies, tagUser }) {
  const [numCommentsToShow, setNumCommentsToShow] = useState(3);

  const handleShowMoreClick = () => {
    setNumCommentsToShow(numCommentsToShow + 2);
  };

  return (
    <>
      {replies.slice(0, numCommentsToShow).map((reply) => {
        const userReply = reply.user;
        return (
          <BlogPostCommentItem
            key={reply._id}
            message={reply.content}
            tagUser={tagUser}
            postedAt={reply.createdAt}
            name={`${userReply?.lastName} ${userReply?.firstName}`}
            avatarUrl={userReply.avatarUrl}
            hasReply
          />
        );
      })}
      {numCommentsToShow < replies.length && (
        <Button
          sx={{
            alignItems: 'flex-start',
            py: 3,
            ml: 'auto',
            width: (theme) => `calc(100% - ${theme.spacing(7)})`,
          }}
          onClick={handleShowMoreClick}
        >
          Show more comments
        </Button>
      )}
    </>
  );
}
