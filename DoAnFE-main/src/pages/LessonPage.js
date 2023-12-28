import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LessonPageAdmin from './LessonPageAdmin';
import LessonPageCustomer from './LessonPageCustomer';
import { ROLES_ENUM } from '../config/config';
import axiosInstance from '../utils/axios';
import Page from '../components/Page';

export default function LesonPage() {
  const { id } = useParams();
  const { auth } = useSelector((state) => state);
  const [lesson, setLesson] = useState(null);
  const [viewAsUser, setWiewAsUser] = useState(false);

  const getLesson = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`lessons/${id}`);
      setLesson(response.data.data);
    } catch (error) {
      console.error(error);
      setLesson(error.message);
    }
  }, [id]);

  useEffect(() => {
    getLesson();
  }, [getLesson]);

  // --------------------

  return (
    <Page title="Learn: Lesson">
      {auth?.user?.role === ROLES_ENUM.ADMIN && viewAsUser === false ? (
        <LessonPageAdmin
          lesson={lesson}
          viewAsUser={viewAsUser}
          setWiewAsUser={() => {
            setWiewAsUser(!viewAsUser);
          }}
        />
      ) : (
        <LessonPageCustomer
          lesson={lesson}
          viewAsUser={viewAsUser}
          setWiewAsUser={() => {
            setWiewAsUser(!viewAsUser);
          }}
        />
      )}
    </Page>
  );
}
