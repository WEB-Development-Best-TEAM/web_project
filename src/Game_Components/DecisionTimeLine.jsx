import React from "react";
import "./DecisionTimeLine.css"; // Para estilos personalizados

const Decisions = () => {
  return (
    <div className="game-container">
      <div className="background">
        <img
          src="path-to-your-globe-image.jpg"
          alt="Planeta Terra"
          className="globe-image"
        />
        <div className="overlay">
          <div className="problem">
            <p>(Problema)</p>
          </div>
          <div className="decision">
            <p>(Decisão tomada pelo Jogador)</p>
          </div>
          <div className="effects">
            <div className="effect positive">
              <span className="arrow">↑</span> +15 Social
            </div>
            <div className="effect negative">
              <span className="arrow">↓</span> -10 Ecológico
            </div>
          </div>
          <div className="navigation">
            <button className="nav-button left">←</button>
            <button className="nav-button right">→</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decisions;