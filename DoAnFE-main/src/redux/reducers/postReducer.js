import { EditData1 } from '../actions/globalTypes';
import { POST_TYPES } from '../actions/postAction';

const initialState = {
  posts: [],
  page: 1,
  limit: 10,
};
const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TYPES.CREATE_POST:
      return state.page === 1
        ? {
            ...state,
            posts: [action.payload, ...state.posts],
          }
        : state;
    case POST_TYPES.GET_POST:
      return {
        ...state,
        posts: [...action.payload],
      };
    case POST_TYPES.SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case POST_TYPES.UPDATE_POST:
      return {
        ...state,
        posts: EditData1(state.posts, action.payload._id, action.payload),
      };
    default:
      return state;
  }
};

export default postReducer;
