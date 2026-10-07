import { ArrowRight, Play, RotateCcw, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Clutch } from '../types';
import { Situation } from './Situation';

const TICKRATE = 64;
// ponytail: fixed burst layout around the frozen frame
const BURST = Array.from({ length: 12 }, (_, i) => ({
  x: `${(i * 53) % 100}%`,
  s: `${10 + ((i * 7) % 22)}px`,
  d: `${(i % 6) * 70}ms`,
  drift: `${((i % 5) - 2) * 14}px`,
}));

type Phase = 'loading' | 'watching' | 'deciding' | 'revealing' | 'revealed';

type StageProps = {
  clutch: Clutch;
  position?: string;
  nextLabel: string;
  onAnswered: (right: boolean) => void;
  onNext: () => void;
};

export const Stage = ({ clutch, position, nextLabel, onAnswered, onNext }: StageProps) => {
  const video = useRef<HTMLVideoElement>(null);
  const callRow = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [guess, setGuess] = useState<boolean | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const freezeAt = (clutch.freezeTick - clutch.startTick) / TICKRATE;

  // try with sound; browsers block that until the visitor has interacted, so fall back to muted
  const start = () => {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    v.play().then(
      () => {
        setMuted(false);
        setBlocked(false);
      },
      () => {
        v.muted = true;
        setMuted(true);
        v.play().then(
          () => setBlocked(false),
          () => setBlocked(true),
        );
      },
    );
  };

  const unmute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
  };

  useEffect(start, [clutch.id]);

  // the call is the product: keep the orbs on screen at the freeze
  useEffect(() => {
    if (phase === 'deciding') callRow.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [phase]);

  const onTime = () => {
    const v = video.current;
    if (!v || phase === 'deciding' || guess !== null) return;
    if (v.currentTime >= freezeAt) {
      v.pause();
      v.currentTime = freezeAt;
      setPhase('deciding');
    }
  };

  const call = (clutched: boolean) => {
    if (phase !== 'deciding') return;
    setGuess(clutched);
    setPhase('revealing');
    const v = video.current;
    if (v) {
      v.muted = false;
      setMuted(false);
      v.play();
    }
  };

  const onEnded = () => {
    if (guess === null || phase === 'revealed') return;
    setPhase('revealed');
    onAnswered(guess === clutch.won);
  };

  const replay = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = Math.max(0, freezeAt - 4);
    v.play();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'c' || e.key === 'C') call(true);
      if (e.key === 'x' || e.key === 'X') call(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const right = guess === clutch.won;

  return (
    <div className={`stage stage--${phase}`}>
      <div className="pane">
        <div className="pane__screen">
          <video
            ref={video}
            src={clutch.videoUrl ?? undefined}
            playsInline
            preload="auto"
            onPlaying={() => setPhase((p) => (p === 'loading' ? 'watching' : p))}
            onTimeUpdate={onTime}
            onEnded={onEnded}
          />
          <div className="pane__frost" aria-hidden />
          {phase === 'deciding' && (
            <div className="pane__burst" aria-hidden>
              {BURST.map((b, i) => (
                <span
                  key={i}
                  style={{ '--x': b.x, '--s': b.s, '--d': b.d, '--drift': b.drift } as CSSProperties}
                />
              ))}
            </div>
          )}
          {phase === 'deciding' && (
            <p className="numeral" data-text={`1v${clutch.vs}`} aria-label={`One versus ${clutch.vs}`}>
              1v{clutch.vs}
            </p>
          )}
          {muted && !blocked && (
            <button className="pane__sound" onClick={unmute}>
              <Volume2 size={18} aria-hidden /> Sound on
            </button>
          )}
          {blocked && (
            <button className="pane__play" onClick={start}>
              <Play size={28} aria-hidden /> Play clip
            </button>
          )}
        </div>
        <div className="pane__caption">
          <span>
            <strong>{clutch.player}</strong> in a 1v{clutch.vs}
          </span>
          {position && <span className="pane__position">{position}</span>}
        </div>
      </div>

      <aside className="stage__side">
        <Situation clutch={clutch} revealed={phase !== 'loading' && phase !== 'watching'} />
      </aside>

      {phase === 'deciding' && (
        <>
          <div className="call" ref={callRow}>
            <p className="call__prompt" id="call-prompt">
              Does {clutch.player} clutch this 1v{clutch.vs}, or choke?
            </p>
            <div className="call__orbs" role="group" aria-labelledby="call-prompt">
              <button className="orb orb--clutch" onClick={() => call(true)}>
                <span className="orb__label">Clutch</span>
                <kbd>C</kbd>
              </button>
              <button className="orb orb--choke" onClick={() => call(false)}>
                <span className="orb__label">Choke</span>
                <kbd>X</kbd>
              </button>
            </div>
          </div>
        </>
      )}

      {(phase === 'loading' || phase === 'watching') && (
        <p className="hint">
          Watch closely. It freezes right before the fight that decides it, and then it is your call.
        </p>
      )}

      {phase === 'revealing' && (
        <p className="verdict verdict--pending" aria-live="polite">
          You called {guess ? 'Clutch' : 'Choke'}. Watch it play out.
        </p>
      )}

      {phase === 'revealed' && (
        <div className={`verdict ${clutch.won ? 'verdict--clutched' : 'verdict--choked'}`} aria-live="polite">
          <p className="verdict__outcome">{clutch.won ? 'Clutched.' : 'Choked.'}</p>
          <p className="verdict__call">{right ? 'You called it.' : 'Wrong call.'}</p>
          <div className="verdict__actions">
            <button className="pill pill--ghost" onClick={replay}>
              <RotateCcw size={16} aria-hidden /> Watch again
            </button>
            <button className="pill" onClick={onNext}>
              {nextLabel} <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
