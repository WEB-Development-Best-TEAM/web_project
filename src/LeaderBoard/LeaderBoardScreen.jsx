import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import './LeaderBoardScreen.css';
import {  useNavigate } from 'react-router-dom';

const LeaderBoardScreen = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      // Obter scores da coleção "scores" ordenados por score desc
      const scoresQuery = query(collection(db, 'scores'), orderBy('score', 'desc'));
      const scoresSnapshot = await getDocs(scoresQuery);

      // Obter os dados dos utilizadores da coleção "users"
      const usersSnapshot = await getDocs(collection(db, 'users'));

      // Converter os dados dos utilizadores para um mapa de uid -> dados do utilizador
      const usersMap = {};
      usersSnapshot.forEach(doc => {
        usersMap[doc.id] = doc.data();
      });

      // Combinar os scores com os dados dos utilizadores
      const playersList = scoresSnapshot.docs.map(doc => {
        const scoreData = doc.data();
        const userData = usersMap[doc.id] || {}; // Procurar utilizador correspondente
        return {
          id: doc.id,
          score: scoreData.score,
          username: userData.username || 'Unknown',
        };
      });

      setPlayers(playersList);
    };

    fetchPlayers();
  }, []);


  return (
    <div>
      <div className="background-video">
        <video autoPlay muted loop>
          <source src="./backgroundClip.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="leaderboard-container">
        <h1>Leaderboard</h1>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id}>
                <td>{index + 1}</td>
                <td>{player.username}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className = "backButton" onClick={() => navigate("/MainMenu")}>Voltar ao Menu</button>
    </div>
  );
};

export default LeaderBoardScreen;
