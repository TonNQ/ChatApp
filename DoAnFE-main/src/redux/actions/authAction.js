import { GLOBALTYPES } from './globalTypes';
import { EXAM_TYPES } from './examAction';
import axiosInstance from '../../utils/axios';

export const AUTH_TYPES = {
  GENERATE_ACCESS_TOKEN: 'GENERATE_ACCESS_TOKEN',
  UPDATE_USER: 'UPDATE_USER',
};

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await axiosInstance.post('auth/login', data);
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message },
    });
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        access_token: res.data.data.access_token,
        refresh_token: res.data.data.refresh_token,
        user: res.data.data.user,
      },
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};

// eslint-disable-next-line camelcase
export const generateAccessToken = (refresh_token) => async (dispatch) => {
  dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
  try {
    // eslint-disable-next-line camelcase
    const res = await axiosInstance.post('auth/refresh_token', { refresh_token });
    dispatch({
      type: AUTH_TYPES.GENERATE_ACCESS_TOKEN,
      payload: { access_token: res.data.data },
    });
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
  } catch (error) {
    dispatch(logout());
  }
};

export const signup = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await axiosInstance.post('auth/signup', data);
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message },
    });
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        access_token: res.data.data.access_token,
        refresh_token: res.data.data.refresh_token,
        user: res.data.data.user,
      },
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};

export const sendMailResetPassword = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await axiosInstance.post('auth/sendMailResetPassword', data);
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message },
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};

export const resetPassword = (slug, data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await axiosInstance.post(`auth/updatePassword/${slug}`, data);
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message },
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.post('auth/logout');
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: { access_token: undefined, refresh_token: undefined, user: undefined },
    });
    // dispatch({ type: EXAM_TYPES.CLEAR, payload: {} });
    window.location.href = '/';
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } });
  }
};
