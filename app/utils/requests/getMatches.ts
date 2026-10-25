import { apiRoutes } from '@/app/(front)/utils/routes';
import { getMatchesServer } from '@/app/api/get-matches/getMatchesServer';

import { Match } from '../hockey/matches';

type Filters = {
    activeTeams: string | null;
    from: string | null;
    to: string | null;
};

export type GetMatchesRequest = {
    type: 'prev' | 'next' | 'now' | 'today';
    edgeMatchId?: string | null;
    minLimit?: number;
    filters?: Filters;
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
    let query = `type=${params.type || 'now'}&edgeMatchId=${params.edgeMatchId || ''}&minLimit=${
        params.minLimit || ''
    }`;

    if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (key && value) {
                query = `${query}&${key}=${value}`;
            }
        });
    }

    return fetch(`${host}/${apiRoutes.getMatches}?${query}`, { method: 'GET' }).then((res) => res.json());
};
