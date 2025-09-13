import { getAllBets } from '../utils/getAllBets';
import { getBetsMessage } from '../utils/getBetsMessage';
import { replyToMessage } from '../utils/replyToMessage';
import { loadMatches } from '../utils/fs';

import { COMMANDS } from './commands';

export const bet_stats = (bot: Bot) => {
    bot.command(COMMANDS.bet_stats, async (ctx) => {
        const userBets = await getAllBets(bot, ctx.chat.id);
        const matches = loadMatches().filter(({ isFinished }) => isFinished);

        return replyToMessage(ctx, getBetsMessage(userBets, matches));
    });
};
