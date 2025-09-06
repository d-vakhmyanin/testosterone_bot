import { apiRoutes } from '@/app/(front)/utils/routes';

import { ShortUser } from './sendWheelMessage';

import { Bet, Match } from '../hockey/matches';

export type SaveBetRequest = {
    user: ShortUser;
    bet: Bet;
    matchId: Match['id'];
};

type SaveBetResponse = {
    bet: SaveBetRequest['bet'];
};

export const saveBet = (body: SaveBetRequest): Promise<SaveBetResponse> =>
    fetch(apiRoutes.saveBet, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then((res) => res.json());
