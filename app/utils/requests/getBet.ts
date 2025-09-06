import { apiRoutes } from '@/app/(front)/utils/routes';

import { ShortUser } from './sendWheelMessage';

import { Bet, Match } from '../hockey/matches';

export type GetBetRequest = {
    userId: ShortUser['id'];
    matchId: Match['id'];
};

type GetBetResponse = {
    bet: Bet;
};

export const getBet = ({ matchId, userId }: GetBetRequest): Promise<GetBetResponse> => {
    if (typeof window === 'undefined') {
        throw new Error('Function getBet must be called on client only (no userId on server)');
    }

    const host = window.location.origin;
    const query = `matchId=${matchId}&userId=${userId}`;

    return fetch(`${host}/${apiRoutes.getBet}?${query}`, { method: 'GET' }).then((res) => res.json());
};
