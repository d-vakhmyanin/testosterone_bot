import { apiRoutes } from '@/app/(front)/utils/routes';
import { getMatchesServer } from '@/app/api/get-matches/getMatchesServer';

import { Match } from '../hockey/matches';

export type GetMatchesRequest = {
    type: 'prev' | 'next' | 'now' | 'today';
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
        return getMatchesServer(params).then((res) => res);
    }

    const host = window.location.origin;
    const query = `type=${params.type || 'now'}&edgeMatchId=${params.edgeMatchId || ''}&minLimit=${
        params.minLimit || ''
    }`;

    return fetch(`${host}/${apiRoutes.getMatches}?${query}`, { method: 'GET' }).then((res) => res.json());
};
