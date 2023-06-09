import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Service/helper';

const getMCQQuestionsForTest = () => {
  const navigate = useNavigate();
  const [mcqquestions, setMCQQuestions] = useState(JSON.parse(localStorage.getItem('mcqquestions')) || []);
  const [selectedAnswers, setSelectedAnswers] = useState(JSON.parse(localStorage.getItem('selectedAnswers')) || {});
  const [hasFetched, setHasFetched] = useState(localStorage.getItem('hasFetched') || false);
  // const [providedAnswers] = useState(JSON.parse(localStorage.getItem("providedAnswers")) || {});
  const email = JSON.parse(localStorage.getItem("email"));

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
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
          localStorage.setItem('mcqquestions', JSON.stringify(response.data.questions));
          setMCQQuestions(response.data.questions);
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
    const missingAnswers = mcqquestions.some(
      (question) => !selectedAnswers[question._id]
    );

    if (missingAnswers) {
      alert('Please answer all questions before continuing.');
    } else 
    // {
    //   navigate('../getParagraphQuestionsForTest', {
    //     state: { selectedAnswers, providedAnswers },
    //   });
    // }
    {
      const selectedAnswers = JSON.parse(localStorage.getItem("selectedAnswers"));
      // const providedAnswers = JSON.parse(localStorage.getItem("providedAnswers"));
      const requestBody = {
        email,
        selectedAnswers,
        // providedAnswers,
      };

      axios.post(`${BASE_URL}/testresults`, requestBody)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      // create a sample patch request using axios
      const requestBody2 = {
        email,
        testStatus: "Test Taken",
      };

      axios.patch(`${BASE_URL}/updateCandidateTeststatus`, requestBody2)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      localStorage.clear();
      // Update the candidate collection and set "test status" as "Completed"
      navigate("../Results");
    }
  }

  function handleRadioChange(event, questionId) {
    const selectedAnswer = event.target.value;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: selectedAnswer,
    });
    localStorage.setItem('selectedAnswers', JSON.stringify({
      ...selectedAnswers,
      [questionId]: selectedAnswer,
    }));
  }

  return (
    <div style={{ backgroundColor: "#BDCCDA"}}>
      <h2 style={{ marginTop: "90px" }}>MCQ Questions</h2>
      <div className="mcq-questions-list">
        {mcqquestions.map((question) => (
          <div key={question._id} className="card" style={{ width: "100%", marginTop: "10px" }}>
            <div className="card-header">
              <h3>{question.question}</h3>
            </div>
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
          <button className="btn" style={{ marginTop: "3px", backgroundColor: "#FFFFFF" }} onClick={handleNextClick}>
            Submit
          </button>
        </div>
      </center>
    </div>
  );
};

export default getMCQQuestionsForTest;