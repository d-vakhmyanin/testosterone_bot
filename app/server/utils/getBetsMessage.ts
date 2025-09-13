import { Match } from '@/app/utils/hockey/matches';
import { UserBets } from './getAllBets';
import { getUsername } from './getUsername';

type UserScores = {
    [userId: string]: {
        username: string;
        totalScore: number;
        winnerCount: number;
        exactScoreCount: number;
        timeCount: number;
        totalCount: number;
    };
};

export const getBetsMessage = (userBets: UserBets, matches: Match[]) => {
    const userScores: UserScores = {};

    for (const [userId, { user, bets }] of Object.entries(userBets)) {
        const userScore: UserScores[string] = {
            username: getUsername(user),
            totalScore: 0,
            winnerCount: 0,
            exactScoreCount: 0,
            timeCount: 0,
            totalCount: 0,
        };

        for (const match of matches) {
            const userBet = bets[match.id];

            if (!userBet || !match.result) {
                continue;
            }

            let score = 0;
            const actualWinner =
                match.result.homeScore > match.result.guestScore ? match.homeTeam : match.guestTeam;

            const betWinner = userBet.homeScore > userBet.guestScore ? match.homeTeam : match.guestTeam;

            if (actualWinner.id === betWinner.id) {
                score += 1;
                userScore.winnerCount++;
            }

            if (
                userBet.homeScore === match.result.homeScore &&
                userBet.guestScore === match.result.guestScore
            ) {
                score += 3;
                userScore.exactScoreCount++;
            }

            if (match.result.winType && match.result.winType === userBet.winType) {
                score += match.result.winType === 'regulation' ? 0.2 : 0.5;
                userScore.timeCount++;
            }

            if (match.result.homeScore + match.result.guestScore >= userBet.total) {
                score += 0.1 * userBet.total;
                userScore.totalCount++;
            }

            userScore.totalScore += score;
        }

        userScores[userId] = userScore;
    }

    const sortedUsers = Object.values(userScores).sort((a, b) => b.totalScore - a.totalScore);

    const header = `
<code>┌────────────┬────┬────┬────┬────┬───────┐
│ Участник   │ 🏆 │ 🎯 │ ⏱ │ Σ │ Балл  │
├────────────┼────┼────┼────┼────┼───────┤</code>`;

    const rows = sortedUsers.map((user) => {
        const name = (user.username || 'Unknown').padEnd(10).slice(0, 10);
        return `<code>│ ${name} │ ${user.winnerCount.toString().padStart(2)} │ ${user.exactScoreCount
            .toString()
            .padStart(2)} │ ${user.timeCount.toString().padStart(2)} │ ${user.totalCount
            .toString()
            .padStart(2)} │ ${user.totalScore.toFixed(1).padStart(5)} │</code>`;
    });

    const footer = `<code>└────────────┴────┴────┴────┴────┴───────┘</code>`;

    const message = `
<b>ПОВЕРНИ МОБИЛУ ГОРИЗОНТАЛЬНО</b>

<b>📊 РЕЗУЛЬТАТЫ СТАВОК</b>
${header}
${rows.join('\n')}
${footer}

<b>📌 Легенда:</b>

🏆 Угадан победитель
🎯 Угадан точный счет  
⏱ Угадано время окончания матча
 Σ   Угадан тотал голов
`;

    return message;
};
