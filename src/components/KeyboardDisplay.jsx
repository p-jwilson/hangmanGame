import { keyImagePath } from "../assets.js";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function KeyboardDisplay({ guessed }) {
  return (
    <div className="keyboard" aria-label="Keyboard display">
      {ALPHABET.map((L) => {
        const used = guessed.has(L);
        const src = keyImagePath(L, used);
        return <img key={L} className="keyImg" src={src} alt={`Key ${L}`} />;
      })}
    </div>
  );
}