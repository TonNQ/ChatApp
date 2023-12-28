import { EditData1 } from '../actions/globalTypes';
import { TOPIC_TYPES } from '../actions/topicAction';

const initialState = { topics: [] };
const topicReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOPIC_TYPES.CREATE_TOPIC:
      return {
        ...state,
        topics: [...state.topics, action.payload],
      };
    case TOPIC_TYPES.GET_TOPICS:
      return {
        ...state,
        topics: [...action.payload],
      };
    case TOPIC_TYPES.UPDATE_TOPIC:
      return {
        ...state,
        topics: EditData1(state.topics, action.payload._id, action.payload),
      };
    default:
      return state;
  }
};

export default topicReducer;
