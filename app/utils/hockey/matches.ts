import { Team } from './teams';
import json from './matches.json';

type Result = {
    homeScore: number;
    guestScore: number;
    winType: 'regulation' | 'overtime' | 'shootout';
};

export type Match = {
    id: string;
    homeTeam: Team;
    guestTeam: Team;
    date: number;
    result?: Result;
    isFinished: boolean;
};

export const MATCHES = json as Match[];
