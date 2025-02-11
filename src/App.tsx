import { useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';
import CharacterCard from "./components/CharacterCard";

function App() {
  const [num, setNum] = useState<number>(0);
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise - Kyle Behiels</h1>
      </header>
      <section className="App-section">
          <CharacterCard setSkillCheckResult={() => {}} characterIndex={1}/>
      </section>
    </div>
  );
}

export default App;
