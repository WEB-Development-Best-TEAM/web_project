import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./DecisionTimeLine.css";
import {  useNavigate } from 'react-router-dom';

const Decisions = () => {
  const [data, setData] = useState([]);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "gameHistory"));
      const decisionsData = [];
      querySnapshot.forEach((doc) => {
        decisionsData.push({ id: doc.id, ...doc.data() });
      });
      setData(decisionsData);
    };

    fetchData();
  }, []);

  const handleNext = () => {
    const currentDoc = data[currentDocIndex];
    if (currentDoc) {
      if (currentHistoryIndex < currentDoc.history.length - 1) {
        setCurrentHistoryIndex(currentHistoryIndex + 1);
      } else if (currentDocIndex < data.length - 1) {
        setCurrentDocIndex(currentDocIndex + 1);
        setCurrentHistoryIndex(0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    } else if (currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1);
      const previousDoc = data[currentDocIndex - 1];
      setCurrentHistoryIndex(previousDoc.history.length - 1);
    }
  };

  const currentDecision =
    data[currentDocIndex]?.history[currentHistoryIndex];

  return (
    <div>
      <div className="background-video">
        <video autoPlay muted loop>
          <source src="./backgroundClip.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="container">
        {currentDecision ? (
          <>
            <div className="problem-box">{currentDecision.question}</div>
            <div className="decision-box">{currentDecision.selectedAnswer}</div>
            <div className="stats">
              <div className="stat">
                <span className="arrow up">↑</span> {currentDecision.economicImpact} Económico
              </div>
              <div className="stat">
                <span className="arrow down">↓</span> {currentDecision.socialImpact} Social
              </div>
              <div className="stat">
                <span className="arrow environment">⬆</span> {currentDecision.environmentalImpact} Ambiental
              </div>
            </div>
          </>
        ) : (
          <p>Carregando...</p>
        )}
        <button className="nav-button left" onClick={handlePrevious}>
          ←
        </button>
        <button className="nav-button right" onClick={handleNext}>
          →
        </button>
      </div>
      <button className = "backButton" onClick={() => navigate("/MainMenu")}>Voltar ao Menu</button>
    </div>
  );
};

export default Decisions;
