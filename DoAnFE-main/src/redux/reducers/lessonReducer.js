import { LESSON_TYPES } from '../actions/lessonAction';

const initialState = { lessons: [] };
const lessonReducer = (state = initialState, action) => {
  switch (action.type) {
    case LESSON_TYPES.CREATE_LESSON:
      return {
        ...state,
        topics: [...state.lessons, action.payload],
      };
    case LESSON_TYPES.GET_LESSONS:
      return {
        ...state,
        topics: [...action.payload],
      };
    default:
      return state;
  }
};

export default lessonReducer;
