import { apiRoutes } from '@/app/(front)/utils/routes';

import { Match } from '../hockey/matches';
import { getMatchesServer } from '@/app/api/get-matches/getMatchesSever';

export type GetMatchesRequest = {
    type: 'prev' | 'next' | 'now';
    edgeMatchId?: string | null;
    minLimit?: number;
};

export type GetMatchesResponse = {
    matches: Match[];
    hasMore: boolean;
    hasPrev?: boolean;
    hasNext?: boolean;
};

export const getMatches = (params: GetMatchesRequest): Promise<GetMatchesResponse> => {
    if (typeof window === 'undefined') {
        return new Promise((res) => res(getMatchesServer(params)));
    }

    const host = window.location.origin;
    const query = `type=${params.type || 'now'}&edgeMatchId=${params.edgeMatchId || ''}&minLimit=${
        params.minLimit || ''
    }`;

    return fetch(`${host}/${apiRoutes.getMatches}?${query}`, { method: 'GET' }).then((res) => res.json());
};
