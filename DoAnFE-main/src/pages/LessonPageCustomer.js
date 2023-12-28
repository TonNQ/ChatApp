import PropTypes from 'prop-types';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  Container,
  Typography,
  Modal,
  Button,
  Table,
  Stack,
  Popover,
  MenuItem,
  Paper,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TablePagination,
  Switch,
} from '@mui/material';
import { sentenceCase } from 'change-case';
import { ROLES_ENUM, Config } from '../config/config';
import { PATH_DASHBOARD } from '../routes/paths';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import axiosInstance from '../utils/axios';
import { AnswerQuestion, AnswerToeicQuestion } from '../sections/@dashboard/questions';

LessonPageCustomer.propTypes = {
  lesson: PropTypes.any,
  setWiewAsUser: PropTypes.func,
  viewAsUser: PropTypes.bool,
};

export default function LessonPageCustomer({ lesson, setWiewAsUser, viewAsUser }) {
  const { id } = useParams();
  const { auth } = useSelector((state) => state);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  async function fetchQuestions() {
    try {
      const response = await axiosInstance.get(`questionsAlone`, {
        params: { filter: { lesson: id } },
      });
      setQuestions(response.data.data);
      const data = response.data.data.reduce((accumulator, currentValue) => {
        if (!currentValue.children || currentValue.children.length === 0) {
          return [
            ...accumulator,
            { _id: currentValue._id, value: undefined, answer: currentValue.answer, data: currentValue },
          ];
        }
        const temp = currentValue.children.map((item) => ({
          _id: item._id,
          value: undefined,
          answer: item.answer,
          data: item,
          parent: {
            _id: currentValue._id,
            text: currentValue.text,
            image: currentValue?.image ?? null,
            audio: currentValue?.audio ?? null,
          },
        }));
        return [...accumulator, ...temp];
      }, []);
      setAnswers(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  const nextQuestion = () => {
    if (index < questions.length - 1) setIndex(index + 1);
  };

  const previousQuestion = () => {
    if (index > 0) setIndex(index - 1);
  };

  const findQuestion = (key) => {
    let question = questions.filter((item) => item._id === key);
    if (question.length === 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].children.length !== 0 && question.length === 0) {
          question = questions[i].children.filter((item) => item._id === key);
        }
      }
    }
    return question[0];
  };

  const updateAnswers = (index, newValue) => {
    const newArray = [...answers];
    newArray[index].value = newValue;
    // console.log(newArray);
    setAnswers(newArray);
  };

  const checkAnswers = () => {
    const correct = answers.filter((item) => item.value === item.answer).length;
    const isFinish = answers.filter((item) => item.value === undefined).length === 0;
    return {
      correct,
      isFinish,
    };
  };

  return (
    <>
      {/* <pre>{JSON.stringify(questions, null, 2)}</pre> */}
      <Container maxWidth={true ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={lesson?.name ?? "Lesson's Name"}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Topics', href: PATH_DASHBOARD.topics.root },
            { name: 'Lesson', href: `${PATH_DASHBOARD.topics.root}/${lesson?.topic}` },
            { name: sentenceCase(id) },
          ]}
          action={
            auth?.user?.role === ROLES_ENUM.ADMIN ? (
              <>
                <Switch onClick={setWiewAsUser} checked={viewAsUser} />
              </>
            ) : null
          }
        />

        {questions.length !== 0 && lesson.isToeic === false && (
          <AnswerQuestion
            question={questions[index]}
            nextQuestion={nextQuestion}
            previousQuestion={previousQuestion}
            index={index}
            count={questions.length - 1}
          />
        )}

        {questions.length !== 0 && lesson.isToeic === true && (
          <AnswerToeicQuestion
            id={id}
            question={findQuestion(answers[index]._id)}
            index={index}
            count={answers.length - 1}
            answers={answers}
            updateAnswers={updateAnswers}
            setIndex={setIndex}
            checkAnswers={checkAnswers}
          />
        )}
      </Container>
    </>
  );
}
