import React from "react";
import { db } from "./firebase"; // Importar os serviços que precisas

function App() {
  console.log("Firestore:", db);

  return (
    <div className="App">
      <h1>Firebase Initialized</h1>
    </div>
  );
}

export default App;