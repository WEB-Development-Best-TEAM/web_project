import React from 'react';
import './GameScreen.css';

const GameScreen = () => {
  return (
    <div className="game-container">
      <div className="main-content">
        <div className="question-container">
          <h1>Pergunta</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio augue, vehicula vitae aliquam ut,
            dignissim vitae felis. Aliquam at risus sit amet nunc imperdiet tempor eu at erat. Nulla ante nisi, sollicitudin
            nec mattis tincidunt, gravida et ipsum. Nulla at tristique dolor.
          </p>
        </div>

        <div className="answers-container">
          <button className="answer-button">Resposta 1</button>
          <button className="answer-button">Resposta 2</button>
          <button className="answer-button">Resposta 3</button>
          <button className="answer-button">Resposta 4</button>
        </div>
      </div>

      <div className="sidebar">
        <h2>Nome Jogador</h2>
        <div className="score-container">
          <h3>Pontuação</h3>
          <div className="score-item">
            <span>Social</span>
            <span>n.</span>
          </div>
          <div className="score-item">
            <span>Ambiental</span>
            <span>n.</span>
          </div>
          <div className="score-item">
            <span>Económico</span>
            <span>n.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
