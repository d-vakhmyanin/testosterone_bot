import { Telegraf } from 'telegraf';

import { start } from './start';
import { help } from './help';
import { register } from './register';
import { unregister } from './unregister';
import { list } from './list';
import { gym } from './gym';
import { shame } from './shame';
import { stats } from './stats';
import { details } from './details';
import { message } from './message';

import { createCronJob } from '../cron/cron';

const init = () => {
    const token = process.env.TG_TOKEN;

    if (typeof token !== 'string') {
        throw new Error('No tg token');
    }

    const bot = new Telegraf(token);

    bot.use(async (ctx, next) => {
        createCronJob(bot, ctx.chat?.id);
        await next();
    });

    return bot;
}


// Запуск бота
export const launchBot = () => {
    const bot = init();

    start(bot);
    help(bot);
    register(bot);
    unregister(bot);
    list(bot);
    gym(bot);
    shame(bot);
    stats(bot);
    details(bot);

    message(bot);

    bot.launch();
};
