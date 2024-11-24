import React from "react";
import "./MainMenu.css";

function MainMenu() {
    return (
        <div>
            <div className="background-video">
                <video autoPlay muted loop>
                    <source src="./backgroundClip.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="tittle">
                <h1>Bem-Vindo "Player"</h1>
                <hr />
                <div className="button-container">
                    <button>Jogar</button>
                    <button>Placar de Classificação</button>
                    <button>Sair</button>
                </div>
            </div>
        </div>
    );
}

export default MainMenu;
