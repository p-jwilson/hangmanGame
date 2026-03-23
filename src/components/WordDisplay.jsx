import { letterImagePath, lineImagePath } from "../assets.js";

function isAlpha(ch) {
  return ch >= "A" && ch <= "Z";
}

export default function WordDisplay({ answer, guessed, reveal = false }) {
  const chars = String(answer).toUpperCase().split("");

  return (
    <div className="wordRow" aria-label="Word display">
      {chars.map((ch, idx) => {
        const showLetter = isAlpha(ch) && (reveal || guessed.has(ch));

        return (
          <div className="letterSlot" key={`${ch}-${idx}`}>
            <div className="slotInner">
              <img className="lineImg" src={lineImagePath()} alt="Line" />
              {showLetter ? (
                <img className="letterImg" src={letterImagePath(ch)} alt={ch} />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}