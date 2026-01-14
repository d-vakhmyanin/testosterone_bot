import { COMMANDS } from './commands';

import { getRandom } from '../utils/getRandom';
import { replyToMessage } from '../utils/replyToMessage';
import { createTagCronJob, deleteTagCronJob } from '../cron/tagCron';

const enablePhrases = [
    '🎯 Готово! username, теперь за тобой наблюдает высшая сила 👁️',
    '✅ Принято. username, твои сообщения теперь с комментариями эксперта 💫',
    '👀 Включено отслеживание! username, надеюсь, ты готов к славе 🌟',
    '📝 Добавил в список особого внимания! username 😏',
    '🎪 Добро пожаловать в шоу! username, ты в центре внимания 🎭',
    '🔔 Уведомления активированы! username, теперь все твои слова важны 📢',
    '✨ Магия включена! username, твои сообщения теперь с бонус-контентом 🧙♂️',
];

const disablePhrases = [
    '✅ Снято наблюдение. username, можешь выдохнуть 🌬️',
    '🎉 Свобода! username, ты снова обычный пользователь 🕊️',
    '👋 Отпускаю тебя! username, наслаждайся 😌',
    '🌤️ Тучи развеялись! username, можешь расслабиться 🌈',
    '🎈 Шарик лопнул! username, ты снова просто ты 🎉',
    '😴 Режим наблюдения выключен. username, спи спокойно 💤',
];

type BotState = {
    targetUsers: Set<string>;
};

export const botState: Map<number, BotState> = new Map();

export const potegai = (bot: Bot) => {
    bot.command(COMMANDS.potegai, (ctx) => {
        const username = ctx.message.text.split(' ')[1];
        const chatId = ctx.chat.id;

        if (ctx.message.from.username !== 'vakhmian') {
            return replyToMessage(ctx, 'Тебя в этом вопросе не слушаю', false);
        }

        if (!username || !chatId) {
            return replyToMessage(ctx, 'Не понел. Каво тегать?', false);
        }

        if (!botState.has(chatId)) {
            botState.set(chatId, { targetUsers: new Set() });
        }

        const state = botState.get(chatId)!;

        if (state.targetUsers.has(username)) {
            return replyToMessage(ctx, 'Его уже тегаю', false);
        }

        state.targetUsers.add(username);

        createTagCronJob(bot, chatId, username);

        return replyToMessage(ctx, getRandom(enablePhrases).replace('username', username), false);
    });
};

export const netegai = (bot: Bot) => {
    bot.command(COMMANDS.netegai, (ctx) => {
        const username = ctx.message.text.split(' ')[1];
        const chatId = ctx.chat.id;

        if (ctx.message.from.username !== 'vakhmian') {
            return replyToMessage(ctx, 'Тебя в этом вопросе не слушаю', false);
        }

        if (!username || !chatId) {
            return replyToMessage(ctx, 'Не понел. Каво не тегать?', false);
        }

        const state = botState.get(chatId);

        if (!state || !state.targetUsers.has(username)) {
            return replyToMessage(ctx, 'А я его и не тегаю', false);
        }

        state.targetUsers.delete(username);
        deleteTagCronJob(username);

        return replyToMessage(ctx, getRandom(disablePhrases).replace('username', username), false);
    });
};
