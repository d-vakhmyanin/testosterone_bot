import { Markup } from 'telegraf';
import { QUERY_SEPARATOR } from '@/app/utils/query';

import { COMMANDS } from './commands';

export const getWebLinkMarkup = (botName: string, chatId: number, text: string) => {
    const webAppName = process.env.TG_WEB_APP_NAME;
    const query = `startapp=${webAppName}${QUERY_SEPARATOR}chatId=${chatId}`;

    const deepLink = `https://t.me/${botName}?${query}`;

    return Markup.inlineKeyboard([Markup.button.url(text, deepLink)]);
};

export const web = (bot: Bot) => {
    bot.command(COMMANDS.web, async (ctx) => {
        const markup = getWebLinkMarkup(ctx.botInfo.username, ctx.chat.id, 'Что там внутри? 👀');

        ctx.reply('Жми', markup);
    });
};
