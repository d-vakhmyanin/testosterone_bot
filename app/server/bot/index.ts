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
import { shame_details } from './shame_details';
import { web } from './web';

import { createMonthlyCronJob } from '../cron/monthlyCron';
import { replyToMessage } from '../utils/replyToMessage';
import { createDailyCronJob } from '../cron/dailyCron';

const init = () => {
    const token = process.env.TG_TOKEN;

    if (typeof token !== 'string') {
        throw new Error('No tg token');
    }

    const bot = new Telegraf(token);

    bot.use(async (ctx, next) => {
        createMonthlyCronJob(bot, ctx.chat?.id);
        createDailyCronJob(bot, ctx.chat?.id);
        await next();
    });

    bot.catch((err, ctx) => {
        replyToMessage(ctx, `Ошибка: ${err}`);
    });

    return bot;
};

// Запуск бота
export const initBot = () => {
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
    shame_details(bot);
    web(bot);

    message(bot);

    return bot;
};
