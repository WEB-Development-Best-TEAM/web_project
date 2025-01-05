import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AnswerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resposta, pontuacao, score, currentQuestionIndex, isLastQuestion } = location.state;

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      //alert(`Fim do jogo! Sua pontuação final é: ${score}`);
      navigate('/MainMenu', { state: { score, currentQuestionIndex: currentQuestionIndex + 1 } });
    } else {
      navigate('/Game', { state: { score, currentQuestionIndex: currentQuestionIndex + 1 } });
    }
  };

  return (
    <div>
      <h1>Detalhes da Resposta</h1>
      <p>Opção Selecionada: {resposta}</p>
      <p>Pontos Ganhos: {pontuacao}</p>
      {isLastQuestion ? (
        <button onClick={handleNextQuestion}>Fim</button>
      ) : (
        <button onClick={handleNextQuestion}>Próxima Pergunta</button>
      )}
    </div>
  );
};

export default AnswerDetails;