import React from "react";
import "./DecisionTimeLine.css"; // Para estilos personalizados

const Decisions = () => {
  return (
    <div>
      <div className="background-video">
        <video autoPlay muted loop>
          <source src="./backgroundClip.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="container">
        <div className="problem-box">(Problema)</div>
        <div className="decision-box">(Decisão tomada pelo Jogador)</div>
        <div className="stats">
          <div className="stat">
            <span className="arrow up">↑</span> +15 Social
          </div>
          <div className="stat">
            <span className="arrow down">↓</span> -10 Ecológico
          </div>
          <div className="stat">
            <span className="arrow environment">⬆</span> +20 Ambiental
          </div>
        </div>
        <button className="nav-button left">←</button>
        <button className="nav-button right">→</button>
      </div>
    </div>
  );
};

export default Decisions;
