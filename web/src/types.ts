export type PlayerState = {
  name: string;
  steamId: string;
  team: string | null;
  avatar: string | null;
  hp: number;
  armor: number;
  helmet: boolean;
  kit: boolean;
  weapon: string | null;
  ammo: number | null;
  utility: string[];
  place: string;
};

export type Clutch = {
  id: string;
  demo: string;
  map: string;
  round: number;
  player: string;
  side: 'T' | 'CT';
  vs: number;
  won: boolean;
  startTick: number;
  stopTick: number;
  freezeTick: number;
  outcomeTick: number;
  timeLeft: number;
  bombPlanted: boolean;
  clutcher: PlayerState;
  opponents: PlayerState[];
  clipId: string | null;
  videoUrl: string | null;
};

export type JobStep =
  | 'queued'
  | 'parsing'
  | 'compressing'
  | 'uploading'
  | 'clipping'
  | 'rendering'
  | 'done'
  | 'error';

export type Job = {
  id: string;
  demo: string;
  step: JobStep;
  error: string | null;
  clutches: Clutch[];
};
