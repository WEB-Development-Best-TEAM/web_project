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
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const handleGameEnd = useCallback(async () => {
    if (userId) {
      try {
        const scoresRef = doc(db, 'scores', userId);
        const scoreDoc = await getDoc(scoresRef);

        const historyRef = doc(db, 'gameHistory', userId);
        // const histDoc = await getDoc(historyRef);

        // Atualiza ou cria o score na coleção "scores"
        if (scoreDoc.exists()) {
          const existingScore = scoreDoc.data().score;

          if (score > existingScore) {
            await updateDoc(scoresRef, {
              score,
              socialScore,
              environmentalScore,
              economicScore,
              date: Timestamp.now(),
            });
            console.log('Recorde atualizado com sucesso!');

            await updateDoc(historyRef, {
              history: decisionHistory,
              finalScore: score,
              socialScore,
              environmentalScore,
              economicScore,
              date: Timestamp.now(),
            });
            console.log('Histórico de jogo armazenado com sucesso!');
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

          // Armazenar o histórico de decisões na coleção "gameHistory"
          await setDoc(historyRef, {
            history: decisionHistory,
            finalScore: score,
            socialScore,
            environmentalScore,
            economicScore,
            date: Timestamp.now(),
          });
          console.log('Histórico de jogo armazenado com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao registrar ou atualizar:', error);
      }
    }
  }, [userId, score, socialScore, environmentalScore, economicScore, decisionHistory]);

  useEffect(() => {
    if (!loading && location.state) {
      setScore(location.state.score || 0);
      setSocialScore(location.state.socialScore || 0);
      setEnvironmentalScore(location.state.environmentalScore || 0);
      setEconomicScore(location.state.economicScore || 0);
      setCurrentQuestionIndex(location.state.currentQuestionIndex);
      setDecisionHistory(location.state.decisionHistory || []);
  
      console.log('Questions Lenght:', questions.length);
      console.log('Current Question Index:', location.state.currentQuestionIndex);
      console.log('Verify: ', location.state.currentQuestionIndex >= questions.length);

      if (location.state.currentQuestionIndex >= questions.length) {
        console.log('handleGameEnd');
        handleGameEnd();
      }
    }
  }, [location.state, questions.length, loading, handleGameEnd]);

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
    
        // const isLastQuestion = currentQuestionIndex === questions.length - 1;
    
        if (currentQuestionIndex < questions.length) {
          navigate('/AnswerDetails', {
            state: {
              answer: selectedAnswer.text,
              score: selectedAnswer.score,
              newScore,
              socialScore: newSocialScore,
              environmentalScore: newEnvironmentalScore,
              economicScore: newEconomicScore,
              currentQuestionIndex: currentQuestionIndex,
              decisionHistory: newHistory,
              isLastQuestion: false,
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
              currentQuestionIndex: currentQuestionIndex,
              decisionHistory: newHistory,
              isLastQuestion: true,
            },
          });
        }
        
      }
  };

  if (loading) return <div>A Carregar...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div>
        <h2>Fim do jogo!</h2>
        <p>Sua pontuação final é: {score}</p>
      </div>
    );
  }

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
