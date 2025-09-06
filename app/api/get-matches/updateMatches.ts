'use server';

import { parse } from 'node-html-parser';
import { Match } from '@/app/utils/hockey/matches';
import { loadMatches } from '@/app/server/utils/fs';

const getHtml = () =>
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

type ParsedMatch = Pick<Match, 'date' | 'isFinished' | 'result'> & {
    homeTeam: { name: string };
    guestTeam: { name: string };
};

const parseAllMatches = (html: string): ParsedMatch[] => {
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

const matchesPath = 'app/utils/hockey/matches.json';

export const updateMatches = async () => {
    if (typeof window !== 'undefined') {
        return;
    }

    const fs = await import('fs');
    const html = await getHtml();
    const parsedMatches = parseAllMatches(html);

    const oldMatches = loadMatches();

    const newMatches = oldMatches.map((match) => {
        if (match.isFinished) {
            return match;
        }

        const parsedMatch = parsedMatches.find(
            (el) =>
                el.date === match.date &&
                (match.homeTeam.name.includes(el.homeTeam.name) ||
                    match.guestTeam.name.includes(el.guestTeam.name) ||
                    el.homeTeam.name.includes(match.homeTeam.name) ||
                    el.guestTeam.name.includes(match.guestTeam.name))
        );

        if (!parsedMatch || !parsedMatch.result) {
            return match;
        }

        return {
            ...match,
            isFinished: parsedMatch.isFinished,
            result: parsedMatch.result,
        };
    });

    fs.writeFileSync(matchesPath, JSON.stringify(newMatches));
};
