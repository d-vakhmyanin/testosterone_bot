import { Markup } from 'telegraf';
import { QUERY_SEPARATOR } from '@/app/utils/query';

import { COMMANDS } from './commands';

export const web = (bot: Bot) => {
    bot.command(COMMANDS.web, async (ctx) => {
        const botName = ctx.botInfo.username;
        const webAppName = process.env.TG_WEB_APP_NAME;
        const query = `${QUERY_SEPARATOR}chatId=${ctx.chat.id}${QUERY_SEPARATOR}foo=bar`;

        const deepLink = `https://t.me/${botName}?startapp=${webAppName}${query}`;

        ctx.reply(
            '99% гарантии, что тебе это не понравится',
            Markup.inlineKeyboard([Markup.button.url('Что там внутри? 👀', deepLink)])
        );
    });
};
