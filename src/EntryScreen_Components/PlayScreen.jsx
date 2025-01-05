import React from 'react';
import './PlayScreen.css';
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
                <input className='playbutton' type="button" value="Jogar" />
            </Link>
        </div>
    );
}

export default PlayScreen;