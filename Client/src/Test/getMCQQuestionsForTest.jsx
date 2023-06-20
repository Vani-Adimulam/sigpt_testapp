import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Service/helper';
import DOMPurify from 'dompurify';

const getMCQQuestionsForTest = () => {
  const navigate = useNavigate();
  const [mcqquestions, setMCQQuestions] = useState(JSON.parse(localStorage.getItem('mcqquestions')) || []);
  const [selectedAnswers, setSelectedAnswers] = useState(JSON.parse(localStorage.getItem('selectedAnswers')) || {});
  const [hasFetched, setHasFetched] = useState(localStorage.getItem('hasFetched') || false);
  const email = JSON.parse(localStorage.getItem('email'));

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Check if the MCQ questions have already been fetched
    if (!hasFetched && mcqquestions.length === 0) {
      axios
        .get(`${BASE_URL}/getMCQQuestionsforTest/${email}`)
        .then((response) => {
          const questionsWithImage = response.data.questions.map((question) => {
            if (question.image && question.image.data) {
              const base64Image = question.image.data;
              question.imageURL = `data:${question.image.contentType};base64,${base64Image}`;
            }
            question.question = DOMPurify.sanitize(question.question);
            return question;
          });

          localStorage.setItem('mcqquestions', JSON.stringify(questionsWithImage));
          setMCQQuestions(questionsWithImage);
          setHasFetched(true);
          localStorage.setItem('hasFetched', true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [hasFetched, mcqquestions, email]);

  function handleBeforeUnload(event) {
    event.preventDefault();
    event.returnValue = '';
  }

  function handleNextClick() {
    const missingAnswers = mcqquestions.some((question) => !selectedAnswers[question._id]);

    if (missingAnswers) {
      alert('Please answer all questions before continuing.');
    } else {
      const selectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'));
      const requestBody = {
        email,
        selectedAnswers,
      };

      axios
        .post(`${BASE_URL}/testresults`, requestBody)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      const requestBody2 = {
        email,
        testStatus: 'Test Taken',
      };

      axios
        .patch(`${BASE_URL}/updateCandidateTeststatus`, requestBody2)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      localStorage.clear();
      navigate('../Results');
    }
  }

  function handleRadioChange(event, questionId) {
    const selectedAnswer = event.target.value;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: selectedAnswer,
    });
    localStorage.setItem(
      'selectedAnswers',
      JSON.stringify({
        ...selectedAnswers,
        [questionId]: selectedAnswer,
      })
    );
  }

  return (
    <div style={{ backgroundColor: '#BDCCDA' }}>
      <h2 style={{ marginTop: '90px' }}>MCQ Questions</h2>
      <div className="mcq-questions-list">
        {mcqquestions.map((question) => (
          <div key={question._id} className="card" style={{ width: '100%', marginTop: '10px' }}>
            <div className="card-header">
              <h3 dangerouslySetInnerHTML={{ __html: question.question }} />
            </div>
            {question.imageURL && (
              <div className="card-body">
                <img src={question.imageURL} alt="Question Image" style={{ width: auto, height: auto }} />
              </div>
            )}
            <div className="card-body">
              <label>
                <input
                  type="radio"
                  name={question._id}
                  value={1}
                  checked={selectedAnswers[question._id] == 1}
                  onChange={(e) => handleRadioChange(e, question._id)}
                />
                {question.choice1}
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name={question._id}
                  value={2}
                  checked={selectedAnswers[question._id] == 2}
                  onChange={(e) => handleRadioChange(e, question._id)}
                />
                {question.choice2}
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name={question._id}
                  value={3}
                  checked={selectedAnswers[question._id] == 3}
                  onChange={(e) => handleRadioChange(e, question._id)}
                />
                {question.choice3}
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name={question._id}
                  value={4}
                  checked={selectedAnswers[question._id] == 4}
                  onChange={(e) => handleRadioChange(e, question._id)}
                />
                {question.choice4}
              </label>
            </div>
          </div>
        ))}
      </div>
      <center>
        <div>
          <button className="btn" style={{ marginTop: '3px', backgroundColor: '#FFFFFF' }} onClick={handleNextClick}>
            Submit
          </button>
        </div>
      </center>
    </div>
  );
};

export default getMCQQuestionsForTest;
