'use server';

import { loadMatches } from '@/app/server/utils/fs';
import { Match } from '@/app/utils/hockey/matches';
import { GetMatchesRequest, GetMatchesResponse } from '@/app/utils/requests/getMatches';

const LIMIT = 20;

export const getMatchesServer = async ({
    type,
    edgeMatchId = '-1',
    minLimit = LIMIT,
}: GetMatchesRequest): Promise<GetMatchesResponse> => {
    const prevMatches: Match[] = [];
    const matchesToReturn: Match[] = [];
    const date = new Date();

    const maxToday = new Date(date);
    maxToday.setHours(23, 59, 59, 99);

    const limitDate = new Date(2026, 2, 19);

    let isDone = false;
    let isEdgeMet = false;
    let hasMore = false;
    let hasPrev = undefined;
    let hasNext = undefined;

    const MATCHES = loadMatches();

    MATCHES.forEach((match) => {
        if (isDone) {
            return;
        }

        const matchDate = new Date(match.date);
        const prevDate = new Date(matchesToReturn.at(-1)?.date || 0).getDate();

        switch (type) {
            case 'now': {
                if (matchDate >= date || matchDate >= limitDate) {
                    matchesToReturn.push(match);
                }

                isDone = matchesToReturn.length >= minLimit && matchDate.getDate() !== prevDate;
                break;
            }
            case 'today': {
                if (
                    matchDate.getDate() === date.getDate() &&
                    matchDate.getMonth() === date.getMonth() &&
                    matchDate.getFullYear() === date.getFullYear()
                ) {
                    matchesToReturn.push(match);
                }

                isDone = matchDate > maxToday;
                break;
            }
            case 'next':
            case 'prev': {
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
                    isDone = matchesToReturn.length >= minLimit && prevDate !== matchDate.getDate();

                    if (!isDone) {
                        matchesToReturn.push(match);
                    }
                }

                if (!isEdgeMet) {
                    isEdgeMet = isEdge;
                }

                break;
            }
            default:
                break;
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
