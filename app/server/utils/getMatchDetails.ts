import parse, { HTMLElement } from 'node-html-parser';
import { Match, MatchDetails } from '@/app/utils/hockey/matches';
import { loadMatchDetails, saveMatchDetails } from './fs';

const fetchMatchDetails = (path: string, signal: AbortSignal) => {
    const url = `https://www.championat.com/${path}?error=missing_code&utm_auth=false`;

    return fetch(url, {
        headers: {
            'sec-ch-ua': '"Chromium";v="152", "Not?A_Brand";v="24", "Google Chrome";v="152"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
        },
        referrer: 'https://www.championat.com/stat/hockey/',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        signal,
    }).then((res) => res.text());
};

const parseMatchDetails = (html: string): Partial<MatchDetails> | undefined => {
    const root = parse(html);

    const state = root.querySelector('.match-info__status')?.textContent.trim();

    const base = new Date();
    base.setHours(0, 0, 0, 0);

    const toDate = (row: HTMLElement): Date => {
        const text = row.querySelector('.match-stat__main-value')?.textContent ?? '';
        const full = /(\d{1,2}):(\d{2})/.exec(text);
        if (full) {
            return new Date(base.getTime() + (+full[1] * 60 + +full[2]) * 1000);
        }
        const mins = /(\d{1,2})'/.exec(text);
        if (mins) {
            return new Date(base.getTime() + +mins[1] * 60 * 1000);
        }
        return base;
    };

    const teamOf = (row: HTMLElement) =>
        row.querySelector('.match-stat__row-wrapper')?.classList.contains('_team1') ? 'home' : 'guest';

    const events: MatchDetails['events'] = [];
    const stats: MatchDetails['stats'] = [];
    const players: MatchDetails['players'] = {
        homeTeam: [],
        guestTeam: [],
    };

    const goalieTimes = new Map<string, string>();
    const goaliesH3 = [...root.querySelectorAll('h3.tournament-title')].find(
        (el) => el.textContent.trim().toLowerCase() === 'вратари'
    );

    for (const slide of goaliesH3?.parentNode?.querySelectorAll('.swiper-slide') ?? []) {
        for (const tr of slide.querySelectorAll('tbody tr')) {
            const name = tr.querySelector('.table-item__name')?.textContent.trim();
            const time = tr.querySelector('td._right._bold')?.textContent.trim();

            if (name && time) {
                const prev = goalieTimes.get(name);
                goalieTimes.set(name, prev ? `${prev}, ${time}` : time);
            }
        }
    }

    const statsTab = root.querySelector('div.match-tabs__content[data-type="stats"]');

    if (statsTab) {
        const titles = [
            ...statsTab.querySelectorAll('h2.tournament-title'),
            ...statsTab.querySelectorAll('h3.tournament-title'),
        ];

        for (const h of titles) {
            const title = h.textContent.trim().toLowerCase();
            const rows = h.parentNode?.querySelectorAll('.match-stat__row') ?? [];
            const graphRows = h.parentNode?.querySelectorAll('.stat-graph__row') ?? [];

            if (title.includes('удален')) {
                for (const row of rows) {
                    events.push({
                        type: 'penalty',
                        team: teamOf(row),
                        date: toDate(row),
                        player: row.querySelector('.match-stat__player')?.textContent.trim() ?? '',
                        reason: row.querySelector('.match-stat__player2')?.textContent.trim() ?? '',
                        time: row.querySelector('.match-stat__add-info')?.textContent.trim() ?? '',
                    });
                }
            } else if (title.includes('буллит')) {
                for (const row of rows) {
                    const mainValue = row.querySelector('.match-stat__main-value')?.textContent ?? '';
                    const hasTime = /\d{1,2}:\d{2}/.test(mainValue);
                    const add = row.querySelector('.match-stat__add-info');
                    const isGoal = !!add?.querySelector('.match-icon._shootout');

                    events.push({
                        type: 'penaltyShot',
                        team: teamOf(row),
                        date: hasTime ? toDate(row) : new Date(base.getTime() + 65 * 60 * 1000),
                        player:
                            row.querySelector('.match-stat__info a[href*="/players/"]')?.textContent.trim() ??
                            '',
                        result: isGoal ? 'Гол' : add?.textContent.trim() ?? 'Гола нет',
                    });
                }
            } else if (title.includes('статистик')) {
                for (const row of graphRows) {
                    const name = row.querySelector('.stat-graph__title')?.textContent.trim();

                    if (!name) {
                        continue;
                    }

                    const val = (sel: string): number => {
                        const el = row.querySelector(sel);

                        if (!el) {
                            return 0;
                        }

                        const strong = el.querySelector('strong')?.textContent.trim();

                        if (strong) {
                            return parseInt(strong, 10) || 0;
                        }

                        const m = /\d+/.exec(el.textContent);

                        return m ? parseInt(m[0], 10) : 0;
                    };

                    stats.push({
                        name,
                        homeTeam: val('.stat-graph__value._left'),
                        guestTeam: val('.stat-graph__value._right'),
                    });
                }
            } else if (title.includes('состав')) {
                const slides = [...(h.parentNode?.querySelectorAll('.swiper-slide') ?? [])].filter((s) =>
                    s.querySelector('table.match-lineup__players')
                );

                const playersOf = (slide: HTMLElement | undefined) =>
                    [...(slide?.querySelectorAll('tbody tr') ?? [])].flatMap((tr) => {
                        const name = tr.querySelector('.table-item__name')?.textContent.trim();

                        if (!name) {
                            return [];
                        }

                        const entry = {
                            number: tr.querySelector('td._num')?.textContent.trim() ?? '',
                            position: tr.querySelector('.table-item__amplua')?.textContent.trim() ?? '',
                            name,
                        };
                        const time = goalieTimes.get(name);

                        return [time ? { ...entry, time } : entry];
                    });

                players.homeTeam.push(...playersOf(slides[0]));
                players.guestTeam.push(...playersOf(slides[1]));
            } else if (title.includes('тайм')) {
                for (const row of rows) {
                    events.push({
                        type: 'timeout',
                        team: teamOf(row),
                        date: toDate(row),
                    });
                }
            } else if (title.includes('гол')) {
                for (const row of rows) {
                    events.push({
                        type: 'goal',
                        team: teamOf(row),
                        date: toDate(row),
                        author: row.querySelector('.match-stat__player')?.textContent.trim() ?? '',
                        assistants: row
                            .querySelectorAll('.match-stat__player2')
                            .map((a) => a.textContent.trim()),
                        players: row.querySelector('.match-stat__desc')?.textContent.trim() ?? '',
                    });
                }
            }
        }
    }

    const timeOf = (e: MatchDetails['events'][number]): number => ('date' in e ? e.date.getTime() : 0);
    const priority = (e: MatchDetails['events'][number]): number => {
        if (e.type === 'goal') return 3;
        if (e.type === 'penaltyShot') return 2;
        if (e.type === 'penalty') return 1;

        return 0;
    };

    events.sort((a, b) => {
        const d = timeOf(a) - timeOf(b);
        if (d !== 0) return d;
        return priority(a) - priority(b);
    });

    const withPeriods: typeof events = [];
    let lastPeriod = 0;
    for (const ev of events) {
        const minute = 'date' in ev ? (ev.date.getTime() - base.getTime()) / 60000 : 0;
        const isSeriesShot = ev.type === 'penaltyShot' && minute >= 60;
        const period = isSeriesShot ? 5 : Math.min(4, Math.floor(minute / 20) + 1);
        while (lastPeriod < period) {
            lastPeriod++;
            withPeriods.push({ type: 'period', number: lastPeriod });
        }
        withPeriods.push(ev);
    }

    const scoreMatch = root.querySelector('.match-info__score-total')?.textContent.match(/(\d+)\s*:\s*(\d+)/);
    const score = scoreMatch ? { homeScore: +scoreMatch[1], guestScore: +scoreMatch[2] } : undefined;

    return { state, events: withPeriods, stats, players, score };
};

const ONE_DAY = 24 * 1000 * 60 * 60;

export const getMatchDetails = async (match?: Match): Promise<MatchDetails | undefined> => {
    if (!match) {
        return;
    }

    const savedDetails = loadMatchDetails(match.id);

    if (savedDetails && savedDetails.state === 'Окончен' && Math.abs(Date.now() - match.date) > ONE_DAY) {
        return savedDetails;
    }

    if (match.externalLink) {
        try {
            const signal = AbortSignal.timeout(3000);
            const detailsHtml = await fetchMatchDetails(match.externalLink, signal);
            const parsedDetails = parseMatchDetails(detailsHtml);

            if (parsedDetails) {
                const details = {
                    ...parsedDetails,
                    id: match.id,
                    events: [...(parsedDetails.events || [])],
                    stats: [...(parsedDetails.stats || [])],
                };

                saveMatchDetails(match.id, details);

                return details;
            }
        } catch {
            return;
        }
    }
};
