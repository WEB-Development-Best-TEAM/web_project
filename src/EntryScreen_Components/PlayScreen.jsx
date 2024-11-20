import React from 'react';
import './EntryScreen.css';

import { Link } from 'react-router-dom';

function PlayScreen() {
    return (
        <div>
            <div class="background-blur"></div>
            <h1>Decide</h1>
            <Link to="/LoginScreen">
                <input type="button" value="Jogar"/>
            </Link>
        </div>
    );
}

export default PlayScreen;