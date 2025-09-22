'use server';

import { parse } from 'node-html-parser';
import { Match } from '@/app/utils/hockey/matches';
import { loadMatches } from '@/app/server/utils/fs';
import { isToday } from '@/app/server/utils/isToday';

const getHtmlCalendar = () =>
    fetch('https://www.championat.com/hockey/_superleague/tournament/6608/calendar/', {
        headers: {
            'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'upgrade-insecure-requests': '1',
        },
        referrer: 'https://www.championat.com/hockey/_superleague/tournament/6608/',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
    }).then((res) => res.text());

type ShortTeam = { name: string };

type CurrentMatchesResponse = {
    matches: {
        hockey: {
            tournaments: {
                [tournament: string]: {
                    matches: {
                        teams: ShortTeam[];
                        pub_date: number;
                        status: { label: string; name: string };
                        result?: { detailed: { goal1: number; goal2: number; extra?: string } };
                        score?: { totalHome: number; totalAway: number; suffix?: string };
                    }[];
                };
            };
        };
    };
};

const getCurrentMatches = (): Promise<CurrentMatchesResponse> =>
    fetch(`https://www.championat.com/stat/data/${new Date().toISOString().split('T')[0]}/hockey`, {
        headers: {
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
        },
        referrer: 'https://www.championat.com/stat/hockey/',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
    }).then((res) => res.json());

type ParsedMatch = Pick<Match, 'date' | 'isFinished' | 'result'> & {
    homeTeam: ShortTeam;
    guestTeam: ShortTeam;
};

const parseCalendarMatches = (html: string): ParsedMatch[] => {
    const root = parse(html);
    const matches: ParsedMatch[] = [];

    const rows = root.querySelectorAll('.stat-results__row');
    for (const row of rows) {
        const dateElement = row.querySelector('.stat-results__date-time');
        const teamElements = row.querySelectorAll('.table-item__name');
        const scoreElement = row.querySelector('.stat-results__count-main');
        const winTypeElement = row.querySelector('.stat-results__count-ext');

        const dateText = dateElement?.textContent.trim();
        const homeTeam = teamElements[0]?.textContent.trim();
        const awayTeam = teamElements[1]?.textContent.trim();
        const scoreText = scoreElement?.textContent.trim();
        const winTypeChar = winTypeElement?.textContent.trim();

        // Проверяем, завершен ли матч
        const isFinished = scoreText !== '– : –' && scoreText !== undefined;
        // Добавляем результат если матч завершен
        const scoreMatch = scoreText?.match(/(\d+)\s*:\s*(\d+)/);

        if (!homeTeam || !awayTeam || !dateText || !isFinished || !scoreMatch) {
            continue;
        }

        // Парсим дату
        const dateMatch = dateText.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
        let timestamp = 0;

        if (dateMatch) {
            const [, day, month, year, hours, minutes] = dateMatch;
            const date = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes)
            );
            timestamp = date.getTime();
        }

        let winType: Required<Match>['result']['winType'] = 'regulation';

        if (winTypeChar === 'Б') {
            winType = 'shootout';
        } else if (winTypeChar === 'ОТ') {
            winType = 'overtime';
        }

        const homeScore = parseInt(scoreMatch[1]);
        const guestScore = parseInt(scoreMatch[2]);

        matches.push({
            homeTeam: { name: homeTeam },
            guestTeam: { name: awayTeam },
            date: timestamp,
            isFinished,
            result: { homeScore, guestScore, winType },
        });
    }

    return matches;
};

export const updateMatches = async () => {
    if (typeof window !== 'undefined') {
        return;
    }

    const fs = await import('fs');
    // здесь только результаты завершённых матчей
    const html = await getHtmlCalendar();
    const championatMatches = parseCalendarMatches(html);
    const currentMatches: typeof championatMatches = [];

    try {
        // здесь актуальные счета в том числе по идущим матчам
        const res = await getCurrentMatches();
        Object.values(res.matches.hockey.tournaments).forEach((tournament) => {
            tournament.matches.forEach((match) => {
                const winType = (() => {
                    const label = match.score?.suffix || match.result?.detailed?.extra;

                    if (label === 'ОТ') {
                        return 'overtime';
                    }

                    if (label === 'Б') {
                        return 'shootout';
                    }

                    return 'regulation';
                })();

                currentMatches.push({
                    date: Number(`${match.pub_date}000`),
                    homeTeam: { name: match.teams[0]?.name },
                    guestTeam: { name: match.teams[1]?.name },
                    isFinished: match.status?.name === 'Окончен' || match.status?.label === 'fin',
                    result: {
                        homeScore: match.score?.totalHome || match.result?.detailed?.goal1 || 0,
                        guestScore: match.score?.totalAway || match.result?.detailed?.goal2 || 0,
                        winType,
                    },
                });
            });
        });
    } catch (e) {
        console.log('Cannot get current matches data', e);
    }

    const parsedMatches = [...championatMatches, ...currentMatches];
    const oldMatches = loadMatches();

    const newMatches = oldMatches.map((match) => {
        if (match.isFinished && !isToday(match.date)) {
            return match;
        }

        const parsedMatch = parsedMatches.find(
            (el) =>
                !!el.result &&
                el.date === match.date &&
                (match.homeTeam.name.includes(el.homeTeam.name) ||
                    match.guestTeam.name.includes(el.guestTeam.name) ||
                    el.homeTeam.name.includes(match.homeTeam.name) ||
                    el.guestTeam.name.includes(match.guestTeam.name))
        );

        if (!parsedMatch) {
            return match;
        }

        return {
            ...match,
            isFinished: parsedMatch.isFinished,
            result: parsedMatch.result,
        };
    });

    fs.writeFileSync('app/utils/hockey/matches.json', JSON.stringify(newMatches));
};
