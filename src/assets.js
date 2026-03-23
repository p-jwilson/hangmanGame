export function letterImagePath(letter) {
  const L = String(letter).toUpperCase();
  return `/assets/letters/${L}.drawio.png`;
}

export function keyImagePath(letter, used) {
  const L = String(letter).toUpperCase();
  return `/assets/keys/${L}${used ? "2" : "1"}.drawio.png`;
}

export function lineImagePath() {
  return `/assets/Line.drawio.png`;
}

export function hangmanImagePath(wrongCount) {
  const idx = Math.min(6, Math.max(0, wrongCount)) + 1;
  return `/assets/hangman/Hangman_${idx}.jpg`;
}