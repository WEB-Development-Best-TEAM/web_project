import React from "react";
import { db } from "./firebase";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginScreen from "./EntryScreen_Components/LoginScreen";
import RegisterScreen from "./EntryScreen_Components/RegisterScreen";
import MainMenu from "./MainMenu_Components/MainMenu";
import AnswerDetails from "./Game_Components/AnswerDetails";
import LeaderBoardScreen from "./LeaderBoard/LeaderBoardScreen";
import GameScreen from "./Game_Components/GameScreen";
import DecisionTimeLine from "./Game_Components/DecisionTimeLine";


function App() {
  console.log("Firebase: ", db);

  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<MainMenu />} />
        <Route path="/LoginScreen" element={<LoginScreen />} />
        <Route path="/RegisterScreen" element={<RegisterScreen />} />
        <Route path="/MainMenu" element={<MainMenu />} />
        <Route path="/AnswerDetails" element={<AnswerDetails />} />
        <Route path="/LeaderBoard" element={<LeaderBoardScreen />} />
        <Route path="/GameScreen" element={<GameScreen />} />
        <Route path="/DecisionTimeLine" element={<DecisionTimeLine />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;