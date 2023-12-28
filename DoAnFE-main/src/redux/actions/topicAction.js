import { GLOBALTYPES } from './globalTypes';
import axiosInstance from '../../utils/axios';

export const TOPIC_TYPES = {
  CREATE_TOPIC: 'CREATE_TOPIC',
  UPDATE_TOPIC: 'UPDATE_TOPIC',
  GET_TOPICS: 'GET_TOPICS',
};

export const createTopic = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await axiosInstance.post('topics', data);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message },
    });
    dispatch({
      type: TOPIC_TYPES.CREATE_TOPIC,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};

export const updateTopic = (id, data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await axiosInstance.put(`topics/${id}`, data);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message },
    });
    dispatch({
      type: TOPIC_TYPES.UPDATE_TOPIC,
      payload: { ...res.data.data },
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};

export const getTopics = (params) => async (dispatch) => {
  try {
    const res = await axiosInstance.get('topics', { params });
    dispatch({
      type: TOPIC_TYPES.GET_TOPICS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
  }
};
