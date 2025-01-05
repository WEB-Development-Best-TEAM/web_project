import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./DecisionTimeLine.css";

const Decisions = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentDecision = data[currentIndex]?.history[0]; // Ajuste conforme sua estrutura

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
            <div className="decision-box">{currentDecision.answer}</div>
            <div className="stats">
              <div className="stat">
                <span className="arrow up">↑</span> {currentDecision.impact.economic} Económico
              </div>
              <div className="stat">
                <span className="arrow down">↓</span> {currentDecision.impact.social} Social
              </div>
              <div className="stat">
                <span className="arrow environment">⬆</span> {currentDecision.impact.environmental} Ambiental
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
    </div>
  );
};

export default Decisions;
