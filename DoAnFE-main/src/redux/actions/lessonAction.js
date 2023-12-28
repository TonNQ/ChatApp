import { GLOBALTYPES } from './globalTypes';
import axiosInstance from '../../utils/axios';

export const LESSON_TYPES = {
  CREATE_LESSON: 'CREATE_LESSON',
  GET_LESSONS: 'GET_LESSONS',
};

export const createLesson = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await axiosInstance.post('lessons', data);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message },
    });
    // dispatch({
    //   type: LESSON_TYPES.CREATE_LESSON,
    //   payload: res.data.data,
    // });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};
