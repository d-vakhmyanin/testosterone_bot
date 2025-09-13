import fs from 'fs';
import { User } from 'telegraf/types';
import { Bet } from '@/app/utils/hockey/matches';

export type UserBets = {
    [userId: number]: {
        user: User;
        bets: {
            [matchId: string]: Bet;
        };
    };
};

const pathToData = 'app/server/data';

export const getAllBets = async (bot: Bot, chatId: number) => {
    const files = fs.readdirSync(pathToData);
    const betFiles = files.filter((file) => file.startsWith('bets_') && file.endsWith('.json'));

    const userBets: UserBets = {};

    for (const file of betFiles) {
        const userId = parseInt(file.replace('bets_', '').replace('.json', ''));

        try {
            const user = await bot.telegram
                .getChatMember(chatId, userId)
                .then((member) => member.user)
                .catch(() => null);

            if (!user || user.is_bot) {
                continue;
            }

            const bets = JSON.parse(fs.readFileSync(`${pathToData}/${file}`, 'utf8'));

            userBets[user.id] = { user, bets };
        } catch (error) {
            console.error(`Error processing bets for user ${userId}:`, error);
        }
    }

    return userBets;
};
