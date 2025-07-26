import { COMMANDS } from './commands';

import { loadChatData } from '../utils/fs';
import { getRandom } from '../utils/getRandom';
import { getUsername } from '../utils/getUsername';
import { replyToMessage } from '../utils/replyToMessage';

const emptyListresponses = [
    'Ноль. Столько же раз ты вспоминал о приседе.',
    'Список участников: █████████ (данные удалены)',
    'Пусто! Но ты же можешь это исправить... или нет?',
    '0 качков. 0 достижений. Всё честно.',
    'Вакуум. Полный. Как твоя программа тренировок.',
    '404 - Качки не найдены',
];

const responses = [
    'Вот эти храбрецы:',
    'Список тех, кто хотя бы попытался:',
    'Гордость отцов:',
    'Те, кто не испугался:',
    'Герои нашего времени:',
];

export const list = (bot: Bot) => {
    bot.command(COMMANDS.list, (ctx) => {
        const chatData = loadChatData(ctx.chat.id);
        const { participants = [] } = chatData;

        if (participants.length === 0) {
            return replyToMessage(ctx, getRandom(emptyListresponses));
        }

        replyToMessage(
            ctx,
            `📋 <b>${getRandom(responses)}</b>\n\n` +
                participants.map(getUsername).join('\n') +
                `\n\nВсего: <b>${participants.length}</b> человек\n` +
                '<code>Не числом, а упорством!</code>'
        );
    });
};
