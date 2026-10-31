import { Match, MatchDetails } from '@/app/utils/hockey/matches';
import { loadMatches } from '@/app/server/utils/fs';
import { getMatchDetails } from './getMatchDetails';

export const getMatchById = async (
    matchId: string
): Promise<{ match?: Match; details?: MatchDetails; nextMatchId?: Match['id'] }> => {
    const matches = loadMatches();

    let match: (typeof matches)[number] | undefined;
    let nextMatchId: (typeof matches)[number]['id'] | undefined;

    for (let index = 0; index < matches.length; index++) {
        const curMatch = matches[index];
        const nextMatch = matches[index + 1];

        if (curMatch.id === matchId) {
            match = curMatch;
            nextMatchId = nextMatch?.id;
        }
    }

    const details = await getMatchDetails(match);

    return { match, details, nextMatchId };
};
