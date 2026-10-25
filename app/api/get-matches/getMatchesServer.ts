'use server';

import { loadMatches } from '@/app/server/utils/fs';
import { isToday } from '@/app/server/utils/isToday';
import { Match } from '@/app/utils/hockey/matches';
import { GetMatchesRequest, GetMatchesResponse } from '@/app/utils/requests/getMatches';

const LIMIT = 20;

export const getMatchesServer = async ({
    type,
    edgeMatchId = '-1',
    minLimit = LIMIT,
    filters,
}: GetMatchesRequest): Promise<GetMatchesResponse> => {
    const prevMatches: Match[] = [];
    const matchesToReturn: Match[] = [];
    const date = new Date();

    const maxToday = new Date(date);
    maxToday.setHours(23, 59, 59, 99);

    const limitDate = new Date(2027, 2, 20);

    let isDone = false;
    let isEdgeMet = false;
    let hasMore = false;
    let hasPrev = undefined;
    let hasNext = undefined;

    let MATCHES: ReturnType<typeof loadMatches> = [];

    if (filters) {
        const { activeTeams, from, to } = filters;
        const teamIds = activeTeams?.split(',');
        const fromDate = from ? new Date(from) : null;

        const endFrom = fromDate ? new Date(fromDate) : null;
        endFrom?.setHours(23, 59, 59, 999);
        const toDate = to ? new Date(to) : endFrom;

        MATCHES = loadMatches().filter((match) => {
            const matchDate = new Date(match.date);

            const teamSatisfies = (() => {
                if (!teamIds?.length) {
                    return true;
                }

                const hasHomeTeam = teamIds.includes(match.homeTeam.id.toString());
                const hasGuestTeam = teamIds.includes(match.guestTeam.id.toString());

                if (teamIds.length === 2) {
                    return hasHomeTeam && hasGuestTeam;
                }

                return hasHomeTeam || hasGuestTeam;
            })();
            const fromSatisfies = fromDate ? matchDate >= fromDate : true;
            const toSatisfies = toDate ? matchDate <= toDate : true;

            return teamSatisfies && fromSatisfies && toSatisfies;
        });
    } else {
        MATCHES = loadMatches();
    }

    MATCHES.forEach((match) => {
        if (isDone) {
            return;
        }

        const matchDate = new Date(match.date);
        const prevDate = new Date(matchesToReturn.at(-1)?.date || 0).getDate();

        switch (type) {
            case 'now': {
                if (filters?.from) {
                    matchesToReturn.push(match);
                } else if (matchDate >= date || matchDate >= limitDate) {
                    matchesToReturn.push(match);
                }

                isDone = filters?.from
                    ? matchesToReturn.length >= minLimit
                    : matchesToReturn.length >= minLimit && matchDate.getDate() !== prevDate;
                break;
            }
            case 'today': {
                if (isToday(matchDate)) {
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
