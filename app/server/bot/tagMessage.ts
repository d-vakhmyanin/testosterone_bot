import { Context } from 'telegraf';

import { botState } from './tag';

import { getRandom } from '../utils/getRandom';
import { replyToMessage } from '../utils/replyToMessage';

const phrases = [
    'username, всегда рад твоим сообщениям! 😊',
    'username, дядь, скажи который час, а?',
    'username, как же без твоего мнения? 🎯',
    'username, очередная жемчужина мудрости! 💎',
    'username, сохраняю в коллекцию цитат 📖',
    'username, это войдёт в историю чата 📜',
    'username, такое мог сказать только ты! 👑',
    'username, моментально добавляю в избранное ⭐',
    'username, все ждали именно твоего комментария ⏳',
    'username, это достойно оваций 👏',
    'username, просто фиксирую факт присутствия 📍',
    'username, твоя очередь сиять! ✨',
    'username, как всегда, в нужное время 🕰️',
    'username, это сообщение изменило мой день 🌈',
    'username, ставлю лайк в уме 👍',
    'username, такой комментарий ожидаем от тебя 🎭',
    'username, добавляю в копилку мудрости 🐖',
    'username, все замерли в ожидании твоих слов 🤫',
    'username, это войдёт в учебники 📚',
    'username, просто отмечаю твою активность 📊',
    'username, как без твоего ценного вклада? 💼',
    'username, такое можно услышать только от тебя 🎙️',
    'username, сохраняю для потомков 🏛️',
    'username, это сообщение стоило等待ить ⏰',
    'username, все аплодируют стоя 👏👏👏',
    'username, моментально становлюсь внимательнее 👀',
    'username, это изменило правила игры 🎮',
    'username, просто напоминаю: ты звезда 🌟',
    'username, такое заявление требует внимания 🚨',
    'username, добавляю в список гениальных мыслей 🧠',
    'username, все ждали именно этого комментария 🎉',
    'username, это достойно рамки и места на стене 🖼️',
    'username, просто фиксирую момент исторической важности 📸',
    'username, твои слова как всегда вовремя ⚡',
    'username, это сообщение сделало мой день ☀️',
    'username, ставлю метку "обязательно к прочтению" 🏷️',
    'username, такой комментарий предсказуем от тебя 🔮',
    'username, добавляю в золотой фонд чата 🏆',
    'username, все затаили дыхание 🫁',
    'username, это войдёт в анналы истории 📜',
    'username, просто отмечаю твой уникальный стиль 🎨',
    'username, как без твоего проницательного замечания? 🔍',
    'username, такое можно услышать раз в жизни 🍀',
    'username, сохраняю как эталон качества 🥇',
    'username, это сообщение перезагрузило матрицу 💻',
    'username, все ждали твоего вердикта ⚖️',
    'username, моментально улучшило настроение 😄',
    'username, это изменило ход мыслей 🧭',
    'username, просто напоминаю: твои слова имеют вес ⚖️',
    'username, такое заявление войдёт в легенды 🏛️',
    'username, добавляю в список моментов для потомков 👶',
    'username, все ждали твоего экспертного мнения 🎓',
    'username, это достойно номинации на премию 🏆',
    'username, просто фиксирую момент гениальности 💫',
];

export const handleTagMessage = (ctx: Context) => {
    const username = ctx.message?.from?.username;
    const tag = `@${username}`;
    const chatId = ctx.chat?.id || 0;

    const state = botState.get(chatId)!;

    if (!username || !chatId || !state?.targetUsers?.has(tag)) {
        return;
    }

    return replyToMessage(ctx, getRandom(phrases).replace('username', tag), false);
};
