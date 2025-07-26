import { User } from 'telegraf/types';

import { COMMANDS } from './commands';

import { loadChatData, saveChatData } from '../utils/fs';
import { getRandom } from '../utils/getRandom';
import { replyToMessage } from '../utils/replyToMessage';

const insults = [
    'Ого, повторная регистрация! Может, сначала хоть раз на тренировку сходишь?',
    'У тебя совсем вся кровь от головы отлила? Ты уже зарегистрирован',
    'Нет-нет, второй раз мы тебя не кормим. Уже зарегистрирован!',
    'Ты и так уже в списке. Но это не значит, что ты качаешься...',
];

const responses = [
    'Записал. Теперь отмазки "я забыл" не катят!',
    'Очередной смельчак! Скоро узнаешь, что такое настоящая тренировка',
    'Добавил. Но ты же всё равно не будешь ходить, да?',
];

export const addUserToList = (chatId: number, user: User) => {
    // Загружаем данные чата
    const chatData = loadChatData(chatId);
    const { participants = [] } = chatData;

    // Проверяем, есть ли уже пользователь в списке
    if (participants.map(({ id }) => id).includes(user.id)) {
        return false;
    }

    // Добавляем пользователя
    participants.push(user);
    saveChatData(chatId, { ...chatData, participants });
    return true;
};

export const register = (bot: Bot) => {
    bot.command(COMMANDS.register, (ctx) => {
        if (addUserToList(ctx.chat.id, ctx.from)) {
            return replyToMessage(ctx, getRandom(responses));
        }

        return replyToMessage(ctx, getRandom(insults));
    });
};
