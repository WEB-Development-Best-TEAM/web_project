import React from "react";
import { db } from "./firebase";

function App() {
  console.log("Firestore:", db);

  return (
    <div className="App">
      <h1>Game ON</h1>
    </div>
  );
}

export default App;