import PropTypes from 'prop-types';
// @mui
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

BlogPostsSort.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
  sort: PropTypes.string,
};

export default function BlogPostsSort({ options, sort, onSort }) {
  return (
    <FormControl size="small">
      <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={sort} label="Sort By" onChange={onSort}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
