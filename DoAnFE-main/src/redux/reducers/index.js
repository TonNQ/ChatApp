import { combineReducers } from 'redux';
import auth from './authReducer';
import alert from './alertReducer';
import post from './postReducer';
import topic from './topicReducer';
import lesson from './lessonReducer';
import exam from './examReducer';

export default combineReducers({ auth, alert, post, topic, lesson, exam });
