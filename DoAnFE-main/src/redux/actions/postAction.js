import { GLOBALTYPES } from './globalTypes';
// import { imageUpload } from '../../utils/imageUpload';
import axiosInstance from '../../utils/axios';

export const POST_TYPES = {
  CREATE_POST: 'CREATE_POST',
  UPDATE_POST: 'UPDATE_POST',
  GET_POST: 'GET_POST',
  SET_PAGE: 'SET_PAGE',
};

export const createPost = (data, auth) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await axiosInstance.post('posts', data);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message },
    });
    dispatch({
      type: POST_TYPES.CREATE_POST,
      payload: { ...res.data.data, user: auth.user },
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};

export const updatePost = (id, data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await axiosInstance.put(`posts/${id}`, data);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message },
    });
    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: { ...res.data.data },
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};

export const getPosts = (params) => async (dispatch) => {
  try {
    const res = await axiosInstance.get('posts', { params });
    dispatch({
      type: POST_TYPES.GET_POST,
      payload: res.data.data.data,
    });
    dispatch({
      type: POST_TYPES.SET_PAGE,
      payload: res.data.data.page.pageCount,
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};
