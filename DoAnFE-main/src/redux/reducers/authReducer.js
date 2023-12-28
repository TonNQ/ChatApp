import { GLOBALTYPES } from '../actions/globalTypes';
import { AUTH_TYPES } from '../actions/authAction';

const initialState = { access_token: undefined, refresh_token: undefined, user: undefined };
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.AUTH:
      return action.payload;
    case AUTH_TYPES.GENERATE_ACCESS_TOKEN:
      return { ...state, ...action.payload };
    case AUTH_TYPES.UPDATE_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default authReducer;
