import { COMMANDS } from './commands';

export const web = (bot: Bot) => {
    bot.command(COMMANDS.web, async (ctx) => {
        const url = process.env.TUNNEL_URL;

        if (url) {
            ctx.reply('99% гарантии, что тебе это не понравится', {
                reply_markup: {
                    inline_keyboard: [[{ text: 'Что там внутри? 👀', web_app: { url } }]],
                },
            });
        }
    });
};
