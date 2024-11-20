import React from "react";
import { db } from "./firebase";
import Register from "./pages/register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  console.log("Firebase: ", db);

  console.log("Register", <Register/>);

  return (
    <Router>
      <Routes>
        <Route path="/pages/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;