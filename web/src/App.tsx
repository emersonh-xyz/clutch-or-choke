import { Flame, RotateCcw } from 'lucide-react';
import { useMemo, useState, type CSSProperties } from 'react';
import clutches from './data/clutches.json';
import { dayKey, loadDaily, pickDailySet, recordAnswer, saveDaily, type DailyState } from './game/daily';
import { Results } from './game/Results';
import { Stage } from './game/Stage';
import type { Clutch } from './types';
import { HowItWorks } from './HowItWorks';
import { ThePrompt } from './ThePrompt';
import { Water } from './Water';

// each letter slumps a little more, as if the word is choking
const CHOKE: [string, number, number][] = [
  ['C', -6, -2],
  ['H', 5, 1],
  ['O', -4, 3],
  ['k', 10, 6],
  ['e', 22, 12],
];

export const App = () => {
  const day = useMemo(() => dayKey(), []);
  const [daily, setDaily] = useState<DailyState>(() => loadDaily(day));
  const [index, setIndex] = useState(daily.answers.length);
  const [run, setRun] = useState(0);

  const set = useMemo(() => pickDailySet(clutches as Clutch[], day), [day]);
  const finished = set.length > 0 && daily.answers.length >= set.length;
  const current = finished ? null : set[index];

  const answered = (right: boolean) => {
    const next = recordAnswer(daily, right, set.length);
    setDaily(next);
    saveDaily(next);
  };

  const startOver = () => {
    const next = { ...daily, answers: [] };
    setDaily(next);
    saveDaily(next);
    setIndex(0);
    setRun((r) => r + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Water />
      <div className="page">
        <header className="masthead">
          <div className="masthead__title">
            <h1 className="wordmark" aria-label="Clutch or Choke">
              <span aria-hidden>Clutch</span> <span className="wordmark__or" aria-hidden>or</span>{' '}
              <span className="wordmark__choke" aria-hidden>
                {CHOKE.map(([letter, r, y], i) => (
                  <span key={i} style={{ '--r': `${r}deg`, '--y': `${y}px`, '--i': i } as CSSProperties}>
                    {letter}
                  </span>
                ))}
              </span>
            </h1>
            <p className="powered">
              Powered by <strong>Allstar</strong>
            </p>
          </div>
          <div className="masthead__meta">
            <a className="masthead__how" href="#how-it-works">
              How it works
            </a>
            <span className="masthead__day">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
            {set.length > 0 && (
              <ol className="beads beads--small" aria-label="Today's progress">
                {set.map((c, i) => (
                  <li
                    key={c.id}
                    className={`bead${i < daily.answers.length ? (daily.answers[i] ? ' bead--right' : ' bead--wrong') : ''}${
                      i === index && !finished ? ' bead--current' : ''
                    }`}
                  />
                ))}
              </ol>
            )}
            {(daily.answers.length > 0 || index > 0) && (
              <button className="reset" onClick={startOver}>
                <RotateCcw size={14} aria-hidden /> Start over
              </button>
            )}
            {daily.streak > 0 && (
              <span className="masthead__streak">
                <Flame size={16} aria-hidden /> {daily.streak}
              </span>
            )}
          </div>
        </header>

        <main>
          {current && (
            <Stage
              key={`${current.id}-${run}`}
              clutch={current}
              position={`${index + 1} of ${set.length}`}
              nextLabel={index + 1 < set.length ? 'Next clutch' : 'See results'}
              onAnswered={answered}
              onNext={() => setIndex((i) => i + 1)}
            />
          )}

          {!current && finished && <Results daily={daily} onPlayAgain={startOver} />}

          <HowItWorks />
          <ThePrompt />
        </main>
      </div>
    </>
  );
};
