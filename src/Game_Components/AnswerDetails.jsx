import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AnswerDetails.css';

const AnswerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    answer,
    score,
    newScore,
    socialScore,
    environmentalScore,
    economicScore,
    currentQuestionIndex,
    isLastQuestion,
    decisionHistory,
  } = location.state;

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      alert(`Fim do jogo! Sua pontuação final é: ${newScore}`);
      navigate('/MainMenu', { 
        state: { 
          score: newScore,
          socialScore,
          environmentalScore,
          economicScore,
          currentQuestionIndex: currentQuestionIndex + 1, 
          decisionHistory, 
          isLastQuestion,  
        } 
      });
    } else {
      navigate('/GameScreen', {
        state: {
          score: newScore,
          socialScore,
          environmentalScore,
          economicScore,
          currentQuestionIndex: currentQuestionIndex + 1,
          decisionHistory, 
          isLastQuestion: false,   
        },
      });
    }
  };

  return (
    <div>
      <div className="background-video">
        <video autoPlay muted loop>
          <source src="./backgroundClip.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="container">
        <div className="content">
          <h1>Detalhes da Resposta</h1>
          <p>Opção Selecionada: {answer}</p>
          <p>Pontos Ganhos: {score}</p>
          <button onClick={handleNextQuestion}>
            {isLastQuestion ? 'Fim do Jogo' : 'Próxima Pergunta'}
          </button>
        </div>
      </div>
    </div>
  );
};


export default AnswerDetails;
