import React from 'react';
import './EntryScreen.css';

import { Link } from 'react-router-dom';

function PlayScreen() {
    return (
        <div>
            <div className="background-video">
                <video autoPlay muted loop>
                    <source src="./backgroundClip.mp4" type="video/mp4" />
                </video>
            </div>
            <h1>Decide</h1>
            <Link to="/LoginScreen">
                <input type="button" value="Jogar" />
            </Link>
            <Link to="/MainMenu">
                <input type="button" value="Menu Principal" />
            </Link>
            <Link to="/LeaderBoard">
                <input type="button" value="LeaderBoard" />
            </Link>
            <Link to="/GameScreen">
                <input type="button" value="GameScreen" />
            </Link>
        </div>
    );
}

export default PlayScreen;