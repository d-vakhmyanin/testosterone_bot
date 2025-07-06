import { Telegraf } from 'telegraf';

import { COMMANDS } from './commands';
import { addUserToList } from './register';

import { getRandom } from '../utils/getRandom';
import { createCronJob } from '../cron/cron';

const welcomeText = `
🔥 <b>TESTOSTERONE BOT</b> 🔥

Ну чё, слабак, решил потренироваться? Ща я тебе помогу не просрать мотивацию как в прошлый раз!

<b>Чё умею:</b>
📝 <code>/register</code> - записаться в ряды железных братьев (обязательно!)
💪 <code>/gym</code> - отметиться что сегодня не проебался и пришёл в качалку
📊 <code>/stats</code> - посмотреть сколько раз ты не был лохом в этом месяце
🤡 <code>/shame</code> - вычислить главного дрища в чате (возможно, это ты)

<code>Если не отметился в боте - считай, не тренировался!</code>

Давай, жми /register, потом уже геройствуй. И да, без регистрации тебя даже в позорный список не возьмут - вот такой позор! Потом жми /gym, мешок с костями. И не вздумай мне тут хуйню писать про "травму колена"!

❓ /help если тебе нужна помощь (она тебе действительно нужна, но я помочь не смогу)
  `;

const roastMessages = [
    'Ну и вали тогда, мешок с костями! Тебе всё равно не поднять даже мои ожидания',
    "Записал тебя в раздел 'потомки диванов'. Гордись!",
    'Ладно, иди лежи. Мы пока понарошку потренируемся',
    'Ты только что проиграл качалку. Поздравляю! 🎉',
    'Ну ок, потом не ной что статистика не ведётся',
    'Слабак detected! Может ты добьёшься успехов на соревнованиях по поеданию булок с маслом?',
    'Твоим предкам должно быть стыдно за тебя',
    'Ни дна тебе, ни покрышки',
    'Ты пидор',
];

const motivators = [
    'Ну да, ну да... А теперь иди и докажи!',
    'Так-так, кто у нас тут решил стать человеком? 💪 Добро пожаловать в клуб, приятель!',
    'О, новый рекрут! Теперь твои ленивые отмазки будут учтены в статистике 😈',
    'Записал тебя в ряды железных братьев. Теперь позорно будет слиться!',
    'Готовься к трансформации: из мешка с костями → в греческую статую!',
    'Принято! Теперь каждый пропуск тренировки будет больно бить по самолюбию',
    'Занес тебя в священные скрижали. Да начнется жесть!',
    'Отлично! Теперь ты официально не имеешь права быть слабаком',
    "Добро пожаловать в мир, где 'устал' — не оправдание! 🚀",
];

// создание и обработка команды /start
export const start = () => {
    const token = process.env.TG_TOKEN;

    if (typeof token !== 'string') {
        throw new Error('No tg token');
    }

    const bot = new Telegraf(token);

    bot.command(COMMANDS.start, (ctx) => {
        ctx.replyWithHTML(welcomeText, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Я НЕ ЛОХ!', callback_data: 'not_lox' }],
                    [{ text: 'Признаю, я дрищ', callback_data: 'im_weak' }],
                ],
            },
        });

        createCronJob(bot, ctx.chat.id);
    });

    bot.action('not_lox', async (ctx) => {
        await ctx.answerCbQuery();

        const chatId = ctx.chat?.id;
        const userTag = ctx.from.username ? `@${ctx.from.username} ` : '';

        if (chatId) {
            if (addUserToList(chatId, ctx.from)) {
                const reply = getRandom(motivators);

                return ctx.replyWithHTML(`${userTag}${reply}`);
            } else {
                ctx.reply(`${userTag}Ты долбоёб? Ты и так зареган`);
            }
        } else {
            ctx.reply(`${userTag}Ты долбоёб? Что-то пошло не так. Скорее всего в этом виноват ты`);
        }
    });

    bot.action('im_weak', async (ctx) => {
        const userTag = ctx.from.username ? `@${ctx.from.username} ` : '';

        await ctx.answerCbQuery();
        const reply = getRandom(roastMessages);

        ctx.replyWithHTML(`${userTag}${reply}`);
    });

    return bot;
};
