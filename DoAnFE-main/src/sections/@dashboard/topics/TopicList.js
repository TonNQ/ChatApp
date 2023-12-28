import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import TopicCard from './TopicCard';

// ----------------------------------------------------------------------

TopicList.propTypes = {
  topics: PropTypes.array.isRequired,
};

export default function TopicList({ topics, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {topics.map((topic) => (
        <Grid key={topic._id} item xs={12} sm={6} md={3}>
          <TopicCard topic={topic} />
        </Grid>
      ))}
    </Grid>
  );
}
