import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = { loading: undefined, success: undefined, error: undefined };
const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.ALERT:
      return action.payload;
    default:
      return state;
  }
};

export default alertReducer;
