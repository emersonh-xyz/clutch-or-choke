import { Bomb, Shield, ShieldHalf, Timer, User, Wrench } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import type { Clutch, PlayerState } from '../types';

const UTILITY: Record<string, string> = {
  'Smoke Grenade': 'Smoke',
  Flashbang: 'Flash',
  'High Explosive Grenade': 'HE',
  Molotov: 'Molly',
  'Incendiary Grenade': 'Incendiary',
  'Decoy Grenade': 'Decoy',
  'C4 Explosive': 'Bomb',
  'Zeus x27': 'Zeus',
};

// demo place names come as "TopofMid" or "ARamp"
const placeName = (p: string) =>
  p
    .replace(/of(?=[A-Z])/g, ' of ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

const clock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const Avatar = ({ player }: { player: PlayerState }) => {
  const [failed, setFailed] = useState(false);
  return (
    <span className="avatar">
      {player.avatar && !failed ? (
        <img src={player.avatar} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <User size={20} aria-hidden />
      )}
    </span>
  );
};

type CardProps = { player: PlayerState; revealed: boolean; order: number };

const PlayerCard = ({ player, revealed, order }: CardProps) => (
  <li className="player" style={{ '--order': order } as CSSProperties}>
    <div className="player__id">
      <Avatar player={player} />
      <span className="player__name">{player.name}</span>
      {revealed && <span className="player__place">{placeName(player.place)}</span>}
    </div>
    {revealed && (
      <div className="player__state">
        <div
          className={`hp-orb${player.hp <= 30 ? ' hp-orb--low' : ''}`}
          style={{ '--hp': player.hp } as CSSProperties}
          role="img"
          aria-label={`${player.hp} health`}
        >
          <span className="hp-orb__water" />
          <span className="hp-orb__value">{player.hp}</span>
          <span className="hp-orb__label" aria-hidden>
            HP
          </span>
        </div>
        <div className="player__gear">
          <span className="player__weapon">
            {player.weapon ?? 'No gun'}
            {player.ammo != null && <span className="player__ammo"> {player.ammo} rds</span>}
          </span>
          <span className="player__armor">
            {player.armor > 0 ? (
              <>
                {player.helmet ? <Shield size={14} aria-hidden /> : <ShieldHalf size={14} aria-hidden />}
                {player.helmet ? 'Helmet' : 'Kevlar'}
              </>
            ) : (
              'No armor'
            )}
            {player.kit && (
              <>
                <Wrench size={14} aria-hidden /> Kit
              </>
            )}
          </span>
          {player.utility.length > 0 && (
            <ul className="player__utility" aria-label="Utility">
              {[...new Set(player.utility)].map((u) => {
                const count = player.utility.filter((x) => x === u).length;
                return (
                  <li key={u}>
                    {UTILITY[u] ?? u}
                    {count > 1 && ` ×${count}`}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    )}
  </li>
);

type TrayProps = {
  side: 'T' | 'CT';
  team: string | null;
  role: string;
  players: PlayerState[];
  revealed: boolean;
  firstOrder: number;
};

const Tray = ({ side, team, role, players, revealed, firstOrder }: TrayProps) => (
  <section className={`tray tray--${side.toLowerCase()}`} aria-label={`${team ?? side}, ${role}`}>
    <header className="tray__head">
      <span className="tray__side">{side}</span>
      <span className="tray__team">{team ?? (side === 'CT' ? 'Counter-Terrorists' : 'Terrorists')}</span>
      <span className="tray__role">{role}</span>
    </header>
    <ol className="tray__players">
      {players.map((p, i) => (
        <PlayerCard key={p.steamId ?? p.name} player={p} revealed={revealed} order={firstOrder + i} />
      ))}
    </ol>
  </section>
);

export const Situation = ({ clutch, revealed }: { clutch: Clutch; revealed: boolean }) => {
  const otherSide = clutch.side === 'CT' ? 'T' : 'CT';
  return (
    <div className={`situation${revealed ? ' situation--revealed' : ''}`}>
      {revealed && (
        <div className="situation__clock">
          {clutch.bombPlanted ? <Bomb size={18} aria-hidden /> : <Timer size={18} aria-hidden />}
          <span>{clutch.bombPlanted ? 'Bomb planted' : 'Round clock'}</span>
          <strong>{clock(clutch.timeLeft)}</strong>
        </div>
      )}
      <Tray
        side={clutch.side}
        team={clutch.clutcher.team}
        role="Clutching, 1 left"
        players={[clutch.clutcher]}
        revealed={revealed}
        firstOrder={0}
      />
      <Tray
        side={otherSide}
        team={clutch.opponents[0]?.team ?? null}
        role={`${clutch.vs} left`}
        players={clutch.opponents}
        revealed={revealed}
        firstOrder={1}
      />
    </div>
  );
};
