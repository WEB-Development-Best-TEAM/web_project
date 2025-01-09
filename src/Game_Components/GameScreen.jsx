import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase.js';
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import './GameScreen.css';

const GameScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [socialScore, setSocialScore] = useState(0);
  const [environmentalScore, setEnvironmentalScore] = useState(0);
  const [economicScore, setEconomicScore] = useState(0);
  const [userId, setUserId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [decisionHistory, setDecisionHistory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPlayerName = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setPlayerName(userData.username);
    }
  };

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      fetchPlayerName(userIdFromStorage);
    }

    const fetchQuestions = async () => {
      const questionsRef = collection(db, 'questions');
      const querySnapshot = await getDocs(questionsRef);

      const loadedQuestions = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const sortedQuestions = loadedQuestions.sort((a, b) => a.ordem - b.ordem);
      setQuestions(sortedQuestions);
    };

    fetchQuestions();
  }, []);

  const handleGameEnd = useCallback(async () => {
    if (userId) {
      try {
        const scoresRef = doc(db, 'scores', userId);
        const userDoc = await getDoc(scoresRef);

        // Atualiza ou cria o score na coleção "scores"
        if (userDoc.exists()) {
          const existingScore = userDoc.data().score;

          if (score > existingScore) {
            await updateDoc(scoresRef, {
              score,
              socialScore,
              environmentalScore,
              economicScore,
              date: Timestamp.now(),
            });
            console.log('Recorde atualizado com sucesso!');
          } else {
            console.log('A pontuação atual não supera o recorde anterior.');
          }
        } else {
          await setDoc(scoresRef, {
            score,
            socialScore,
            environmentalScore,
            economicScore,
            date: Timestamp.now(),
          });
          console.log('Pontuação registrada com sucesso!');
        }

        // Armazenar o histórico de decisões na coleção "gameHistory"
        const historyRef = doc(db, 'gameHistory', userId);
        await setDoc(historyRef, {
          history: decisionHistory,
          finalScore: score,
          socialScore,
          environmentalScore,
          economicScore,
          date: Timestamp.now(),
        });
        console.log('Histórico de jogo armazenado com sucesso!');
      } catch (error) {
        console.error('Erro ao registrar ou atualizar pontuação:', error);
      }
    }
  }, [userId, score, socialScore, environmentalScore, economicScore, decisionHistory]);

  useEffect(() => {
    if (location.state) {
      setScore(location.state.score || 0);
      setSocialScore(location.state.socialScore || 0);
      setEnvironmentalScore(location.state.environmentalScore || 0);
      setEconomicScore(location.state.economicScore || 0);
      setCurrentQuestionIndex(location.state.currentQuestionIndex || 0);
      setDecisionHistory(location.state.decisionHistory || []);

      console.log('isLastQuestion:', location.state.isLastQuestion);

      // Chama `handleGameEnd` se for a última pergunta
      if (location.state.isLastQuestion) {
        console.log('handleGameEnd');
        handleGameEnd();
      }
    }
  }, [location.state, handleGameEnd]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswer = (optionId) => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = currentQuestion.answers.find((answer) => answer.id === optionId);
  
    if (selectedAnswer) {
      const newScore = score + selectedAnswer.score;
      const newSocialScore = socialScore + selectedAnswer.impact.social;
      const newEnvironmentalScore = environmentalScore + selectedAnswer.impact.environmental;
      const newEconomicScore = economicScore + selectedAnswer.impact.economic;
  
      setScore(newScore);
      setSocialScore(newSocialScore);
      setEnvironmentalScore(newEnvironmentalScore);
      setEconomicScore(newEconomicScore);
  
      const newHistory = [
        ...decisionHistory,
        {
          question: currentQuestion.question,
          answer: selectedAnswer.text,
          score: selectedAnswer.score,
          impact: selectedAnswer.impact,
          totalScore: newScore,
          socialScore: newSocialScore,
          environmentalScore: newEnvironmentalScore,
          economicScore: newEconomicScore,
        },
      ];
      setDecisionHistory(newHistory);
  
      const isLastQuestion = currentQuestionIndex === questions.length - 1;
      console.log('isLastQuestion:', isLastQuestion);
  
      if (isLastQuestion) {
        navigate('/AnswerDetails', {
          state: {
            answer: selectedAnswer.text,
            score: selectedAnswer.score,
            newScore,
            socialScore: newSocialScore,
            environmentalScore: newEnvironmentalScore,
            economicScore: newEconomicScore,
            currentQuestionIndex: currentQuestionIndex + 1,
            decisionHistory: newHistory,
            isLastQuestion: true,  // Passando true para a última pergunta
          },
        });
      } else {
        navigate('/AnswerDetails', {
          state: {
            answer: selectedAnswer.text,
            score: selectedAnswer.score,
            newScore,
            socialScore: newSocialScore,
            environmentalScore: newEnvironmentalScore,
            economicScore: newEconomicScore,
            currentQuestionIndex: currentQuestionIndex + 1,
            decisionHistory: newHistory,
            isLastQuestion: false,  // Passando false para perguntas intermediárias
          },
        });
      }
    }
  };

  if (questions.length === 0) return <div>Carregando...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

  return (
    <div>
      <div className="background-video">
        <video autoPlay muted loop>
          <source src="./backgroundClip.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="game-container">
        <div className="main-content">
          <div className="question-container">
            <h1>Pergunta</h1>
            <p>{currentQuestion.question}</p>
          </div>

          <div className="answers-container">
            {shuffledAnswers.map((answer) => (
              <button key={answer.id} className="answer-button" onClick={() => handleAnswer(answer.id)}>
                {answer.text}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar">
          <h2>{playerName}</h2>
          <div className="score-container">
            <h3>Pontuação: {score}</h3>
            <div className="score-item">
              <span>Social</span>
              <span>{socialScore}</span>
            </div>
            <div className="score-item">
              <span>Ambiental</span>
              <span>{environmentalScore}</span>
            </div>
            <div className="score-item">
              <span>Econômico</span>
              <span>{economicScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
