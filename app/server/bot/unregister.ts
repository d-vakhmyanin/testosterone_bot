import { COMMANDS } from './commands';

import { loadChatData, saveChatData } from '../utils/fs';
import { getRandom } from '../utils/getRandom';
import { replyToMessage } from '../utils/replyToMessage';

const notFoundResponses = [
    'Тебя нет в списках. Как и в списках тех, кто реально качается.',
    'Не могу удалить то, чего нет. Как и твои мышцы.',
    'О чём ты? У тебя же не было яиц даже записаться',
];

const successResponses = [
    `Ну всё, ты теперь официально лох. Не стыдно?`,
    'Удалил. Теперь можешь спокойно разлагаться дальше!',
    'Очередной слился... Ну и ладно, слабаков не надо.',
    'Записал твою капитуляцию. Жаль, но не удивлён.',
    'Готово. Твои яички уменьшены до размеров атома, проверяй',
    'Всё прошло успешно! Живи теперь в проклятом мире, который сам и создал',
];

export const unregister = (bot: Bot) => {
    bot.command(COMMANDS.unregister, (ctx) => {
        const userId = ctx.from.id;
        const chatId = ctx.chat.id;

        // Загружаем данные чата
        const chatData = loadChatData(chatId);
        const { participants = [] } = chatData;

        // Проверяем, есть ли пользователь в списке
        const userIndex = participants.map(({ id }) => id).indexOf(userId);

        if (userIndex === -1) {
            return replyToMessage(ctx, getRandom(notFoundResponses));
        }

        // Удаляем пользователя
        participants.splice(userIndex, 1);
        saveChatData(chatId, { ...chatData, participants });

        replyToMessage(ctx, getRandom(successResponses));
    });
};
