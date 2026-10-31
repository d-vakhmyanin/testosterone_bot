import { Team } from './teams';
import json from './matches.json';

type Result = {
    homeScore: number;
    guestScore: number;
    winType?: 'regulation' | 'overtime' | 'shootout';
};

export type Match = {
    id: string;
    homeTeam: Team;
    guestTeam: Team;
    date: number;
    isFinished: boolean;
    result?: Result;
    externalLink?: string;
};

type Stat = { name: string; homeTeam: number; guestTeam: number };

type Event =
    | { type: 'period'; number: number }
    | { type: 'penalty'; team: 'home' | 'guest'; date: Date; player: string; reason: string; time: string }
    | { type: 'penaltyShot'; team: 'home' | 'guest'; date: Date; result: string }
    | { type: 'timeout'; team: 'home' | 'guest'; date: Date }
    | {
          type: 'goal';
          team: 'home' | 'guest';
          date: Date;
          author: string;
          assistants: string[];
          players: string;
      };

type PLayer = {
    name: string;
    position: string;
    number: string;
};

export type MatchDetails = {
    id: string;
    events: Event[];
    stats: Stat[];
    state?: string;
    score?: Match['result'];
    players?: {
        homeTeam: PLayer[];
        guestTeam: PLayer[];
    };
};

export type Bet = Match['result'] & { total: number };

export const MATCHES = json as Match[];
