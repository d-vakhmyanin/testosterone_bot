import { Match, MATCHES } from '@/app/utils/hockey/matches';
import { GetMatchesRequest, GetMatchesResponse } from '@/app/utils/requests/getMatches';

const LIMIT = 20;

export const getMatchesServer = ({
    type,
    edgeMatchId = '-1',
    minLimit = LIMIT,
}: GetMatchesRequest): GetMatchesResponse => {
    const prevMatches: Match[] = [];
    const matchesToReturn: Match[] = [];
    const date = new Date();

    const limitDate = new Date(2026, 2, 19);

    let isDone = false;
    let isEdgeMet = false;
    let hasMore = false;
    let hasPrev = undefined;
    let hasNext = undefined;

    MATCHES.forEach((match) => {
        if (isDone) {
            return;
        }

        if (type === 'now') {
            const matchDate = new Date(match.date);
            const prevDate = new Date(matchesToReturn.at(-1)?.date || 0).getDate();

            if (matchDate >= date || matchDate >= limitDate) {
                matchesToReturn.push(match);
            }

            isDone = matchesToReturn.length >= minLimit && matchDate.getDate() !== prevDate;
        } else {
            const matchDate = new Date(match.date);
            const isEdge = edgeMatchId === match.id;

            if (type === 'prev') {
                if (isEdge) {
                    isDone = true;

                    for (let index = prevMatches.length - 1; index >= 0; index--) {
                        const element = prevMatches[index];

                        if (matchesToReturn.length < minLimit) {
                            matchesToReturn.push(element);
                        } else {
                            const lastSavedDate = new Date(matchesToReturn.at(-1)?.date || 0);
                            const curDate = new Date(element.date);

                            if (lastSavedDate.getDate() === curDate.getDate()) {
                                matchesToReturn.push(element);
                            } else {
                                break;
                            }
                        }
                    }

                    matchesToReturn.reverse();
                } else {
                    prevMatches.push(match);
                }
            }

            if (type === 'next' && isEdgeMet) {
                const prevDate = new Date(matchesToReturn.at(-1)?.date || 0);
                isDone = matchesToReturn.length >= minLimit && prevDate.getDate() !== matchDate.getDate();

                if (!isDone) {
                    matchesToReturn.push(match);
                }
            }

            if (!isEdgeMet) {
                isEdgeMet = isEdge;
            }
        }
    });

    const index = type === 'prev' ? 0 : -1;
    hasMore = Boolean(matchesToReturn.length) && matchesToReturn.at(index)?.id !== MATCHES.at(index)?.id;

    if (type === 'now') {
        hasPrev = matchesToReturn.at(0)?.id !== MATCHES.at(0)?.id;
        hasNext = matchesToReturn.at(-1)?.id !== MATCHES.at(-1)?.id;
    }

    return {
        matches: matchesToReturn,
        hasMore,
        hasNext,
        hasPrev,
    };
};
