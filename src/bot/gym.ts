import { COMMANDS } from './commands';

import { Bot } from '../types';
import { loadChatData, saveChatData } from '../utils/fs';
import { getRandom } from '../utils/getRandom';

const notRegisteredResponses = [
    'Ты даже не зарегистрирован! Сначала /register, дебик!',
    'Тебя нет в списках. Как и твоих достижений. /register',
    'Сначала регистрация, потом ге(й)ройство. /register',
    'Не вижу тебя в списке. Может, ты долбоеб? /register',
];

const successResponses = [
    (count: number) => `Записал! Тренировок: ${count}. Так держать, крепыш!`,
    (count: number) => `Засчитано! (${count} раз уже) Не расслабляйся!`,
    (count: number) => `Ого, реально? Записал (раз №${count})`,
    (count: number) => `+1 в твою копилку. Всего: ${count}. Не останавливайся!`,
];

const alreadyTrainedResponses = [
    'Сегодня ты уже отмечался. Не гони, читер!',
    'Два раза в день? Да ты чемпион... по вранью!',
    'Один раз в день - как в аптеке. Жди завтра.',
    'Ха! Пойман на повторной отметке. За руку как дешёвка. Не позорься.',
    'Я тебя запомнил. Сегодня - уже был.',
];

export const gym = (bot: Bot) => {
    bot.command(COMMANDS.gym, (ctx) => {
        const userId = ctx.from.id;
        const chatId = ctx.chat.id;

        // Загружаем данные чата
        const chatData = loadChatData(chatId);
        const { participants = [] } = chatData;

        // Проверяем регистрацию
        if (!participants.map(({ id }) => id).includes(userId)) {
            return ctx.reply(getRandom(notRegisteredResponses));
        }

        const currentDate = new Date();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        const userData = chatData[month]?.[userId];

        // Проверяем, тренировался ли сегодня
        if (userData?.[date]) {
            return ctx.reply(getRandom(alreadyTrainedResponses));
        }

        // Обновляем данные
        const newData = {
            ...chatData,
            [month]: {
                ...(chatData[month] || {}),
                [userId]: {
                    ...(userData || {}),
                    // по дефолту считаем, что участник пришел в правильное время
                    // админ может (и должен) проконтроллировать и,
                    // если участник пришел в неправильное время - изменить этот параметр
                    [date]: { is_right_time: true },
                },
            },
        };

        // Сохраняем
        saveChatData(chatId, newData);

        const count = Object.keys(newData[month]![userId]).length;

        ctx.reply(getRandom(successResponses)(count)).then((data) => {
            const dataWithMessageId = {
                ...newData,
                [month]: {
                    ...newData[month],
                    [userId]: {
                        ...newData[month]![userId],
                        [date]: { ...newData[month]![userId][date], message_id: data.message_id },
                    },
                },
            };

            saveChatData(chatId, dataWithMessageId);
        });
    });
};
