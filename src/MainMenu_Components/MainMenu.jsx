import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MainMenu.css";
import { db } from '../firebase.js';
import { doc, getDoc } from 'firebase/firestore';

function MainMenu() {
    const [playerName, setPlayerName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayerName = async () => {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setPlayerName(userData.username);
            }
          }
        };
    
        fetchPlayerName();
      }, []);

    const handlePlay = () => {
        navigate('/GameScreen');
    };

    const handleGlobalScore = () => {
        navigate('/globalScore');
    };

    const handleExit = () => {
        window.close();
    };

    return (
        <div>
            <div className="background-video">
                <video autoPlay muted loop>
                    <source src="./backgroundClip.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="tittle">
                <h1>Bem-Vindo {playerName}</h1>
                <hr />
                <div className="button-container">
                    <button onClick={handlePlay}>Jogar</button>
                    <button onClick={handleGlobalScore}>Placar de Classificação</button>
                    <button onClick={handleExit}>Sair</button>
                </div>
            </div>
        </div>
    );
}

export default MainMenu;
