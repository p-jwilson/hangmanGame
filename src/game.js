export function pickRandomWord(words) {
  const pool = Array.isArray(words) ? words : [];
  if (pool.length === 0) return "REACT";
  const i = Math.floor(Math.random() * pool.length);
  return String(pool[i]).toUpperCase();
}

export function isAlphaLetter(ch) {
  return /^[a-zA-Z]$/.test(String(ch));
}