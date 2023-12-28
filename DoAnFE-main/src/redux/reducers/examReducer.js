import { GLOBALTYPES, EditData } from '../actions/globalTypes';
import { EXAM_TYPES } from '../actions/examAction';

const initialState = { results: [] };
const examReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXAM_TYPES.ANSWERS:
      return {
        results: EditData(state.results, action.payload.id, action.payload),
      };
    case EXAM_TYPES.CLEAR:
      return {
        results: [],
      };
    default:
      return state;
  }
};

export default examReducer;
