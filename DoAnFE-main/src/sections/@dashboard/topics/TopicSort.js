import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

TopicSort.propTypes = {
  onSort: PropTypes.func,
  sort: PropTypes.string,
};

export default function TopicSort({ sort, onSort }) {
  return (
    <FormControl size="small">
      <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={sort} label="Sort By" onChange={onSort}>
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
