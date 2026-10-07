import { Check, Copy, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { DailyState } from './daily';

export const Results = ({ daily, onPlayAgain }: { daily: DailyState; onPlayAgain: () => void }) => {
  const [copied, setCopied] = useState(false);
  const score = daily.answers.filter(Boolean).length;
  const share = `Clutch or Choke ${daily.day}: ${score}/${daily.answers.length}\n${daily.answers
    .map((r) => (r ? '🟢' : '🟠'))
    .join('')}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(share);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="results pane" aria-label="Today's results">
      <h2 className="results__title">
        You called {score} of {daily.answers.length}
      </h2>
      <ol className="beads" aria-label="Your calls">
        {daily.answers.map((right, i) => (
          <li key={i} className={`bead ${right ? 'bead--right' : 'bead--wrong'}`}>
            <span className="visually-hidden">
              Clutch {i + 1}: {right ? 'right' : 'wrong'}
            </span>
          </li>
        ))}
      </ol>
      <p className="results__streak">
        {daily.streak} day{daily.streak === 1 ? '' : 's'} in a row. New clutches tomorrow.
      </p>
      <div className="results__actions">
        <button className="pill" onClick={copy}>
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {copied ? 'Copied' : 'Copy result'}
        </button>
        <button className="pill pill--ghost" onClick={onPlayAgain}>
          <RotateCcw size={16} aria-hidden /> Play again
        </button>
      </div>
    </section>
  );
};
