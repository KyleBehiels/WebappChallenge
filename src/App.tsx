import {ReactElement, useEffect, useState} from 'react';
import './App.css';
import {ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST} from './consts.js';
import CharacterCard from "./components/CharacterCard";

function App() {
    const [currentRollResults, setCurrentRollResults] = useState<Record<string, any>>();
    const [characterCards, setCharacterCards] = useState<number[]>([1]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>React Coding Exercise - Kyle Behiels</h1>
            </header>
            <section className="App-section">
                <>
                    {currentRollResults && (
                        <>
                            <h2>Skill Check Results</h2>
                            <b>Character: {currentRollResults.characterIndex}</b>
                            <p>Skill: {currentRollResults.skill[0]}: {currentRollResults.skillValue}</p>
                            <p>You rolled: {currentRollResults.roll}</p>
                            <p>The DC was: {currentRollResults.dc}</p>
                            <p>Result: {
                                (currentRollResults.roll + currentRollResults.skillValue) >= currentRollResults.dc ?
                                    "Success" : "Failed"
                            }</p>
                        </>
                    )}
                    {characterCards.map((index) => {
                        return <CharacterCard setSkillCheckResult={setCurrentRollResults} characterIndex={index}/>
                    })}
                </>
            </section>
        </div>
    );
}

export default App;
