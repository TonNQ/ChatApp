import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PATH_DASHBOARD } from '../routes/paths';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import axiosInstance from '../utils/axios';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { EditQuestionForm, EditQuestionToeicForm } from '../sections/@dashboard/questions';

// ----------------------------------------------------------------------

export default function EditQuestion() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [lesson, setLesson] = useState(null);
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getQuestionById() {
    try {
      const res = await axiosInstance.get(`questions/${id}`);
      setQuestion(res.data.data);
      const res1 = await axiosInstance.get(`lessons/${res.data.data.lesson}`);
      setLesson(res1.data.data);
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.message } });
    }
  }

  useEffect(() => {
    getQuestionById();
  }, []);

  return (
    <Page title="Learn: Edit Question">
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit question"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Lesson', href: `${PATH_DASHBOARD.lessons.root}/${question?.lesson}` },
            { name: `Edit question ${id}` },
          ]}
        />

        {lesson?.isToeic ? (
          <EditQuestionToeicForm question={question} id={id} audio={lesson?.audio} lessonId={lesson?._id} />
        ) : (
          <EditQuestionForm question={question} id={id} audio={lesson?.audio} lessonId={lesson?._id} />
        )}
      </Container>
    </Page>
  );
}
