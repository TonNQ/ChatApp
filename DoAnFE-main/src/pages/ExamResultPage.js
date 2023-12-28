import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  Button,
  FormControl,
  RadioGroup,
  Stack,
  FormControlLabel,
  Radio,
  IconButton,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Config, ROLES_ENUM } from '../config/config';
import Image from '../components/Image';
import LessonPageAdmin from './LessonPageAdmin';
import LessonPageCustomer from './LessonPageCustomer';
import axiosInstance from '../utils/axios';
import { PATH_DASHBOARD } from '../routes/paths';
import Page from '../components/Page';

export default function LesonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, exam } = useSelector((state) => state);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const temp = exam.results.filter((item) => item.id === id);
    if (temp.length === 0) navigate(PATH_DASHBOARD.root);
    setAnswers(temp[0].answers);
    // console.log(temp[0].answers);
  }, [exam.results, id]);

  const scrollIntoView = (id) => {
    const element = document.getElementById(`Question ${id}`);
    element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Page title="Learn: Exam Result">
      {/* <pre>{JSON.stringify(answers, null, 2)}</pre> */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          {answers.map((item, i) =>
            !item.parent ? (
              <Card sx={{ p: 3, mb: 5 }} id={`Question ${item._id}`} key={item._id}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}>
                  <QuestionAnswerIcon sx={{ mr: '5px' }} />
                  {`Question ${i + 1}:`}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  {item.data.image && (
                    <Image
                      disabledEffect
                      visibleByDefault
                      alt="empty content"
                      style={{ objectFit: 'contain' }}
                      src={`${Config.BACKEND_URL}${item.data.image}`}
                      sx={{ height: 240, mb: 3 }}
                    />
                  )}
                  {item.data.audio && (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <audio controls src={`${Config.BACKEND_URL}${item.data.audio}`}>
                      Your browser does not support the
                      <code>audio</code> element.
                    </audio>
                  )}
                  {item.data.text}
                </Box>
                <FormControl component="fieldset" sx={{ display: 'flex', alignItems: 'center', mt: '10px' }}>
                  <RadioGroup
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gridRowGap: '10px',
                      gridColumnGap: '100px',
                    }}
                    aria-label="choices"
                    name="choices"
                    value={item?.value}
                  >
                    {item.data?.choices.map((choice, index) => (
                      <FormControlLabel
                        sx={{
                          gridColumn: index % 2 === 0 ? '1' : '2',
                          gridRow: Math.floor(index / 2) + 1,
                          color: item?.answer === item.data?.choices[index] ? 'limegreen' : 'black',
                        }}
                        key={index}
                        value={item.data?.choices[index]}
                        control={<Radio />}
                        label={item.data?.choices[index]}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Card>
            ) : (
              item.parent &&
              answers[i - 1]?.parent?._id !== item?.parent?._id && (
                <Grid
                  container
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    mb: 5,
                    boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)',
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sx={{
                      display: 'flex',
                      mb: '5px',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {item?.parent?.text && <Box sx={{ mb: '5px' }}>{item?.parent?.text}</Box>}
                    {item?.parent?.audio && (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <audio controls src={`${Config.BACKEND_URL}${item.parent.audio}`}>
                        Your browser does not support the
                        <code>audio</code> element.
                      </audio>
                    )}
                  </Grid>
                  <Grid item xs={12} md={item.parent?.image ? 5 : 0}>
                    <Box>
                      {item.parent?.image && (
                        <Image
                          disabledEffect
                          visibleByDefault
                          alt="empty content"
                          src={`${Config.BACKEND_URL}${item.parent.image}`}
                          style={{ objectFit: 'contain' }}
                          sx={{ height: 240, mb: 3 }}
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={item.parent?.image ? 7 : 12}>
                    {answers
                      .filter((itemFilter) => itemFilter?.parent?._id === item?.parent?._id)
                      .map((itemMap, j) => (
                        <Card sx={{ p: 3 }} id={`Question ${itemMap._id}`} key={itemMap._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}>
                            <QuestionAnswerIcon sx={{ mr: '5px' }} />
                            {`Question ${i + j + 1}:`}
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            {itemMap.data.image && (
                              <Image
                                disabledEffect
                                visibleByDefault
                                alt="empty content"
                                style={{ objectFit: 'contain' }}
                                src={`${Config.BACKEND_URL}${itemMap.data.image}`}
                                sx={{ height: 240, mb: 3 }}
                              />
                            )}

                            {itemMap.data.text}
                          </Box>
                          <FormControl component="fieldset" sx={{ alignItems: 'center', mt: '10px' }}>
                            <RadioGroup
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gridColumnGap: '100px',
                              }}
                              aria-label="choices"
                              name="choices"
                              value={itemMap?.value}
                            >
                              {itemMap.data?.choices.map((choice, index) => (
                                <FormControlLabel
                                  sx={{
                                    color: itemMap?.answer === itemMap.data?.choices[index] ? 'limegreen' : 'black',
                                  }}
                                  key={index}
                                  value={itemMap.data?.choices[index]}
                                  control={<Radio />}
                                  label={itemMap.data?.choices[index]}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </Card>
                      ))}
                  </Grid>
                </Grid>
              )
            )
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ py: '10px', px: 3, mb: '10px' }}>
            <Box sx={{ textAlign: 'center', fontSize: '30px', color: 'limegreen' }}>
              {`${answers.filter((item) => item.value === item.data.answer).length}/${answers.length}`}
            </Box>
          </Card>
          <Card sx={{ py: '10px', px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}>
              <QuestionAnswerIcon sx={{ mr: '5px' }} />
              Question Palette
            </Box>
            {answers.map((item, i) => {
              if (item.value === item.data.answer) {
                return (
                  <Button
                    key={i}
                    onClick={() => {
                      scrollIntoView(item._id);
                    }}
                    color="success"
                    variant="contained"
                    size="large"
                    sx={{ mx: '5px', my: '5px' }}
                  >
                    {i + 1}
                  </Button>
                );
              }
              return (
                <Button
                  key={i}
                  onClick={() => {
                    scrollIntoView(item._id);
                  }}
                  color="error"
                  variant="contained"
                  size="large"
                  sx={{ mx: '5px', my: '5px' }}
                >
                  {i + 1}
                </Button>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
}
