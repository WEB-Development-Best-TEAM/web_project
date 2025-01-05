import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase.js';
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';

const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    }

    const fetchQuestions = async () => {
      const questionsRef = collection(db, 'questions');
      const querySnapshot = await getDocs(questionsRef);
      
      const loadedQuestions = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      const sortedQuestions = loadedQuestions.sort((a, b) => a.ordem - b.ordem);
      setQuestions(sortedQuestions);
    };

    fetchQuestions();
  }, []);

  const handleGameEnd = useCallback(async (finalScore) => {
    if (userId) {
      try {
        const scoresRef = doc(db, 'scores', userId);

        const userDoc = await getDoc(scoresRef);

        if (userDoc.exists()) {
          const existingScore = userDoc.data().score;

          if (finalScore > existingScore) {
            await updateDoc(scoresRef, {
              score: finalScore,
              date: Timestamp.now()
            });
            console.log('Recorde atualizado com sucesso!');
          } else {
            console.log('A pontuação atual não supera o recorde anterior.');
          }
        } else {
          await setDoc(scoresRef, {
            score: finalScore,
            date: Timestamp.now()
          });
          console.log('Pontuação registrada com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao registrar ou atualizar pontuação:', error);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (location.state) {
      setScore(location.state.score);
      setCurrentQuestionIndex(location.state.currentQuestionIndex);

      // Verifica se o jogo acabou
      if (location.state.currentQuestionIndex >= questions.length) {
        handleGameEnd(location.state.score);
      }
    }
  }, [location.state, questions.length, handleGameEnd]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswer = (optionId) => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = currentQuestion.answers.find(answer => answer.id === optionId);
  
    if (selectedAnswer) {
      const newScore = score + selectedAnswer.score; // Atualiza a pontuação
      setScore(newScore);
  
      if (currentQuestionIndex < questions.length - 1) {
        navigate('/AnswerDetails', {
          state: {
            resposta: selectedAnswer.text,
            pontuacao: selectedAnswer.score,
            score: newScore,
            currentQuestionIndex: currentQuestionIndex + 1
          }
        });
      } else {
        navigate('/AnswerDetails', {
          state: {
            resposta: selectedAnswer.text,
            pontuacao: selectedAnswer.score,
            score: newScore,
            currentQuestionIndex: currentQuestionIndex + 1,
            isLastQuestion: true
          }
        });
      }
    }
  };
  

  if (questions.length === 0) return <div>Carregando...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

  return (
    <div>
      <h1>Jogo de Decisões</h1>
      <div>
        <p>{currentQuestion.question}</p>
        <div>
          {shuffledAnswers.map((answer) => (
            <button key={answer.id} onClick={() => handleAnswer(answer.id)}>
              {answer.text}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2>Pontuação: {score}</h2>
      </div>
    </div>
  );
};

export default Game;