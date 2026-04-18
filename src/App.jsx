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

const API_BASE = "http://localhost:3001"

const MAX_WRONG = 6;

export default function App() {
  const initialWord = useMemo(() => pickRandomWord(WORDS), []);
  const [answer, setAnswer] = useState(initialWord);
  const [guessed, setGuessed] = useState(() => new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [status, setStatus] = useState("playing");
  const [message, setMessage] = useState("");

  const [usernameInput, setUsernameInput] = useState("")
  const [player, setPlayer] = useState(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [authMessage, setAuthMessage] = useState("");

  const [authMode, setAuthMode] = useState("default");

  const normalizedAnswer = String(answer).toUpperCase();

  const isAuthenticated = Boolean(player);

  function resetBoard() {
    const next = pickRandomWord(WORDS);
    setAnswer(next);
    setGuessed(new Set());
    setWrongCount(0);
    setStatus("playing");
    setMessage("");
  }

  function resetGame() {
    resetBoard();
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


  async function handleLogin() {
    const name = usernameInput.trim();

    if (!name) {
      setAuthMessage("Enter a username.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/player/${encodeURIComponent(name)}`);

      if (res.status === 404) {
        setAuthMessage("User not found. Register this username first.");
        return;
      }

      if (!res.ok) {
        setAuthMessage("Login failed.");
        return;
      }

      const data = await res.json();
      setPlayer(data);
      setWins(data.wins);
      setLosses(data.losses);
      setAuthMessage(`Welcome back, ${data.name}.`);
      resetBoard();
    } catch (error) {
      setAuthMessage("Could not connect to server.");
    }
  }

  function handleLogout() {
    setPlayer(null);
    setUsernameInput("");
    setAuthMessage("");
    setAuthMode("default");
  }


  async function handleRegister() {
    const name = usernameInput.trim();

    if (!name) {
      setAuthMessage("Enter a username.");
      return;
    }

    try {
      const checkRes = await fetch(`${API_BASE}/player/${encodeURIComponent(name)}`);

      if (checkRes.ok) {
        setAuthMessage("That username is already taken.");
        return;
      }

      const res = await fetch(`${API_BASE}/player`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (res.status === 409) {
        setAuthMessage("That username is already taken.");
        return;
      }

      if (!res.ok) {
        setAuthMessage("Registration failed.");
        return;
      }

      const data = await res.json();
      setPlayer(data);
      setWins(data.wins);
      setLosses(data.losses);
      setAuthMessage(`Registered ${data.name}.`);
      resetBoard();
    } catch (error) {
      setAuthMessage("Could not connect to server.");
    }
  }

  function beginRegistration() {
    setAuthMode("register");
    setAuthMessage("");
  }

  async function updateStats(newWins, newLosses) {
    if (!player) return;

    try {
      await fetch(`${API_BASE}/player/${encodeURIComponent(player.name)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wins: newWins,
          losses: newLosses,
        }),
      });
    } catch (error) {
      console.error("Failed to persist player stats.");
    }
  }


  async function handleWin() {
    const newWins = wins + 1;
    setWins(newWins);
    setStatus("won");
    await updateStats(newWins, losses);
    window.alert("You won!");
  }


  async function handleLoss() {
    const newLosses = losses + 1;
    setLosses(newLosses);
    setStatus("lost");
    await updateStats(wins, newLosses);
    window.alert("You lost!");
  }

  async function handleGuess(rawLetter) {
    if (!player) {
      setAuthMessage("Login or register before playing.");
      return;
    }
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
        await handleLoss();
      }
      return;
    }

    if (computeWin(nextGuessed)) {
      await handleWin();
    }
  }

  const reveal = status !== "playing";


  const totalGames = wins + losses;
  const winPercentage =
    totalGames === 0 ? "0.0" : ((wins / totalGames) * 100).toFixed(1);

  return (
    <div className="page">
      <Header title="Hangman Game" />


      {!isAuthenticated && (
        <div className="authScreen">
          <div className="authPanel">

            <input
              className="authInput"
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter username"
            />

            <div className="authButtons authButtonsVertical">
              {authMode === "default" && (
                <button className="authButton" onClick={handleLogin}>
                  Login
                </button>
              )}

              {authMode === "default" ? (
                <button className="authButton" onClick={beginRegistration}>
                  Register
                </button>
              ) : (
                <button className="authButton" onClick={handleRegister}>
                  Complete Registration
                </button>
              )}
            </div>

            {authMode === "default" && (
              <p className="authSubtext">Don&apos;t have an account registered?</p>
            )}

            {authMode === "register" && (
              <p className="authSubtext">Choose a username to complete registration.</p>
            )}

            {authMessage && <p className="authMessage">{authMessage}</p>}
          </div>
        </div>
      )}



      {isAuthenticated && (
        <div className="layout">
          <aside className="left">

            <div className="playerCard">
              <h3>{player.name}</h3>
              <p>Wins: {wins}</p>
              <p>Losses: {losses}</p>
              <p>Win %: {winPercentage}%</p>
            </div>

            <HangmanImage wrongCount={wrongCount} />
            <div className="spacer" />
            <NewGameButton onClick={resetGame} />
            <button className="btn" onClick={handleLogout}>
              Back to Login
            </button>
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


            {authMessage && <p className="authMessage">{authMessage}</p>}
          </main>
        </div>
      )}
    </div>
  );
}