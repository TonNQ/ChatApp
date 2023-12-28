import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, List, Button } from '@mui/material';
import BlogPostCommentItem from './BlogPostCommentItem';
import BlogPostReplyList from './BlogPostReplyList';
// ----------------------------------------------------------------------

BlogPostCommentList.propTypes = {
  post: PropTypes.object.isRequired,
};

export default function BlogPostCommentList({ post }) {
  const { comments } = post;
  const [numCommentsToShow, setNumCommentsToShow] = useState(3);

  const handleShowMoreClick = () => {
    setNumCommentsToShow(numCommentsToShow + 2);
  };

  return (
    <List disablePadding>
      {comments.slice(0, numCommentsToShow).map((comment) => {
        const { _id: id, replies, user } = comment;
        const hasReply = replies.length > 0;

        return (
          <Box key={id} sx={{}}>
            <BlogPostCommentItem
              commentId={id}
              name={`${user?.lastName} ${user?.firstName}`}
              avatarUrl={comment.avatarUrl}
              postedAt={comment.createdAt}
              message={comment.content}
            />
            {hasReply && <BlogPostReplyList replies={replies} tagUser={`${user?.lastName} ${user?.firstName}`} />}
          </Box>
        );
      })}
      {numCommentsToShow < comments.length && <Button onClick={handleShowMoreClick}>Show more comments</Button>}
    </List>
  );
}
