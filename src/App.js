import React, { useState } from "react";
import { db } from "./firebase";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginScreen from "./EntryScreen_Components/LoginScreen";
import PlayScreen from "./EntryScreen_Components/PlayScreen";
import RegisterScreen from "./EntryScreen_Components/RegisterScreen";

function App() {
  console.log("Firebase: ", db);

  // console.log("Register", <Register/>);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlayScreen />} />
        <Route path="/LoginScreen" element={<LoginScreen />} />
        <Route path="/RegisterScreen" element={<RegisterScreen />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;