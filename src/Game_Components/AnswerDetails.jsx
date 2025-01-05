import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AnswerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answer, score, newScore, socialScore, environmentalScore, economicScore, currentQuestionIndex, isLastQuestion, decisionHistory } = location.state;

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      alert(`Fim do jogo! Sua pontuação final é: ${newScore}`);
      navigate('/MainMenu');
    } else {
      navigate('/GameScreen', {
        state: {
          score: newScore,
          socialScore: socialScore,
          environmentalScore: environmentalScore,
          economicScore: economicScore,
          currentQuestionIndex: currentQuestionIndex,
          decisionHistory: decisionHistory
        }
      });
    }
  };

  return (
    <div>
      <h1>Detalhes da Resposta</h1>
      <p>Opção Selecionada: {answer}</p>
      <p>Pontos Ganhos: {score}</p>
      <button onClick={handleNextQuestion}>
        {isLastQuestion ? 'Fim do Jogo' : 'Próxima Pergunta'}
      </button>
    </div>
  );
};

export default AnswerDetails;