import { useState } from "react";
import { isAlphaLetter } from "../game.js";

export default function GuessInput({ onGuess, disabled, message }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (disabled) return;

    const raw = value.trim();

    if (raw.length !== 1) {
      window.alert("Please enter a single letter.");
      setValue("");
      return;
    }

    if (!isAlphaLetter(raw)) {
      window.alert("Only alphabetical characters are allowed.");
      setValue("");
      return;
    }

    onGuess(raw);
    setValue("");
  }

  return (
    <>
      <form className="guessForm" onSubmit={handleSubmit}>
        <label>
          Guess a letter:
          <input
            type="text"
            inputMode="text"
            maxLength={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
          />
        </label>
  
        <button type="submit" disabled={disabled}>
          Submit
        </button>
      </form>
  
      {message && <div className="guessMessage">{message}</div>}
    </>
  );
}