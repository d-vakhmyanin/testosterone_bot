import { apiRoutes } from '@/app/(front)/utils/routes';

import { Match } from '../hockey/matches';
import { getMatchesServer } from '@/app/api/get-matches/getMatchesServer';
import { updateMatches } from '@/app/api/get-matches/updateMatches';

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
        const callGetMatchesServer = () => getMatchesServer(params).then((res) => res);

        return updateMatches()
            .then(callGetMatchesServer)
            .catch((e) => {
                console.log('Unable to update matches', e);

                return callGetMatchesServer();
            });
    }

    const host = window.location.origin;
    const query = `type=${params.type || 'now'}&edgeMatchId=${params.edgeMatchId || ''}&minLimit=${
        params.minLimit || ''
    }`;

    return fetch(`${host}/${apiRoutes.getMatches}?${query}`, { method: 'GET' }).then((res) => res.json());
};
