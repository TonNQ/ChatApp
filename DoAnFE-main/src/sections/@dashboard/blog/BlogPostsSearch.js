import PropTypes from 'prop-types';

// @mui
import { styled } from '@mui/material/styles';
import { Autocomplete, InputAdornment, Popper, TextField } from '@mui/material';

// ----------------------------------------------------------------------

BlogPostsSearch.propTypes = {
  search: PropTypes.string,
  onChange: PropTypes.func,
};

export default function BlogPostsSearch({ search, onChange }) {
  return <TextField placeholder="Search post..." value={search} onChange={onChange} />;
}
