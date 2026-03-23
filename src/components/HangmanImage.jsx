import { hangmanImagePath } from "../assets.js";

export default function HangmanImage({ wrongCount }) {
  const src = hangmanImagePath(wrongCount);
  return <img className="hangmanImg" src={src} alt={`Hangman stage ${wrongCount}`} />;
}