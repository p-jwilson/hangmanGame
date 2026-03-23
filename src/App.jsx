import { useMemo, useState } from "react";
import "./App.css";

import Header from "./components/Header.jsx";
import HangmanImage from "./components/HangmanImage.jsx";
import WordDisplay from "./components/WordDisplay.jsx";
import GuessInput from "./components/GuessInput.jsx";
import KeyboardDisplay from "./components/KeyboardDisplay.jsx";
import NewGameButton from "./components/NewGameButton.jsx";

import { WORDS } from "./words.js";
import { pickRandomWord, isAlphaLetter } from "./game.js";

const MAX_WRONG = 6;

export default function App() {
  const initialWord = useMemo(() => pickRandomWord(WORDS), []);
  const [answer, setAnswer] = useState(initialWord);
  const [guessed, setGuessed] = useState(() => new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [status, setStatus] = useState("playing");
  const [message, setMessage] = useState("");

  const normalizedAnswer = String(answer).toUpperCase();

  function resetGame() {
    const next = pickRandomWord(WORDS);
    setAnswer(next);
    setGuessed(new Set());
    setWrongCount(0);
    setStatus("playing");
  }

  function computeWin(nextGuessedSet) {
    const needed = new Set(
      normalizedAnswer.split("").filter((ch) => ch >= "A" && ch <= "Z")
    );

    for (const ch of needed) {
      if (!nextGuessedSet.has(ch)) return false;
    }
    return true;
  }

  function handleGuess(rawLetter) {
    if (status !== "playing") return;

    const letter = String(rawLetter).trim();
    if (letter.length !== 1) return;
    if (!isAlphaLetter(letter)) return;

    const L = letter.toUpperCase();
    if (guessed.has(L)) {
      setMessage(`"${L}" has already been used.`);
      return;
    }

    const nextGuessed = new Set(guessed);
    nextGuessed.add(L);
    setGuessed(nextGuessed);
    setMessage("");

    const isCorrect = normalizedAnswer.includes(L);

    if (!isCorrect) {
      const nextWrong = wrongCount + 1;
      setWrongCount(nextWrong);

      if (nextWrong >= MAX_WRONG) {
        setStatus("lost");
        window.alert("You lost!");
      }
      return;
    }

    if (computeWin(nextGuessed)) {
      setStatus("won");
      window.alert("You won!");
    }
  }

  const reveal = status !== "playing";

  return (
    <div className="page">
      <Header title="Hangman Game" />

      <div className="layout">
        <aside className="left">
          <HangmanImage wrongCount={wrongCount} />
          <div className="spacer" />
          <NewGameButton onClick={resetGame} />
        </aside>

        <main className="center">
          <WordDisplay answer={normalizedAnswer} guessed={guessed} reveal={reveal} />

          <GuessInput
            onGuess={handleGuess}
            disabled={status !== "playing"}
            message={message}
          />

          <KeyboardDisplay guessed={guessed} />

          {reveal && (
            <div className="answerReveal">
              Answer: <strong>{normalizedAnswer}</strong>
            </div>
          )}

          <div className="lives">Lives: {Math.max(0, MAX_WRONG - wrongCount)}</div>
        </main>
      </div>
    </div>
  );
}