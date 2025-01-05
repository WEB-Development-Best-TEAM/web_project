import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase.js';  // Supondo que o Firestore está configurado no firebase.js
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';

const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Recupera o ID do usuário do localStorage
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

      // Ordena as perguntas pela 'ordem'
      const sortedQuestions = loadedQuestions.sort((a, b) => a.ordem - b.ordem);
      setQuestions(sortedQuestions);
    };

    fetchQuestions();
  }, []);

  const handleGameEnd = useCallback(async (finalScore) => {
    if (userId) {
      try {
        const scoresRef = doc(db, 'scores', userId);

        // Verifica se já existe um documento para o usuário
        const userDoc = await getDoc(scoresRef);

        if (userDoc.exists()) {
          // O jogador já tem uma pontuação registrada, vamos atualizar se a nova for maior
          const existingScore = userDoc.data().score;

          if (finalScore > existingScore) {
            // Atualiza o score se o novo for maior
            await updateDoc(scoresRef, {
              score: finalScore,
              date: Timestamp.now()
            });
            console.log('Recorde atualizado com sucesso!');
          } else {
            console.log('A pontuação atual não supera o recorde anterior.');
          }
        } else {
          // O jogador ainda não tem uma pontuação registrada, cria um novo documento
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

  const handleAnswer = (option) => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = currentQuestion.respostas.find(resposta => resposta.id === option);

    if (selectedAnswer) {
      const newScore = score + selectedAnswer.pontuacao;
      setScore(newScore);

      if (currentQuestionIndex < questions.length - 1) {
        navigate('/AnswerDetails', { state: { resposta: selectedAnswer.texto, pontuacao: selectedAnswer.pontuacao, score: newScore, currentQuestionIndex } });
      } else {
        navigate('/AnswerDetails', { state: { resposta: selectedAnswer.texto, pontuacao: selectedAnswer.pontuacao, score: newScore, currentQuestionIndex: currentQuestionIndex + 1, isLastQuestion: true } });
      }
    }
  };

  if (questions.length === 0) return <div>Carregando...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const shuffledAnswers = shuffleArray([...currentQuestion.respostas]);

  return (
    <div>
      <h1>Jogo de Decisões</h1>
      <div>
        <p>{currentQuestion.pergunta}</p>
        <div>
          {shuffledAnswers.map((resposta) => (
            <button key={resposta.id} onClick={() => handleAnswer(resposta.id)}>
              {resposta.texto}
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