import { Context, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';

import { Bot } from '../types';
import { loadChatData, saveChatData } from '../utils/fs';
import { getUsername } from '../utils/getUsername';

const endings = ['', '.', '!', '...'];

const getAnswers = (answers: string[]) =>
    answers.map((answer) => endings.map((el) => `${answer}${el}`)).flat();

const pidorAnswers = getAnswers(['нет', 'net']);
const pizdaAnswers = getAnswers(['да', 'da']);

const cancelAnswers = getAnswers(['отмен', 'пиздобол', 'пиздеж', 'врун', 'враньё', 'не приш', 'не прид']);
const wrongTimeAnswers = getAnswers(['врем', 'опозд']);

const checkAdminStatus = async (
    ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
    userId: number,
    chatId: number
): Promise<boolean> => {
    try {
        const admins = await ctx.telegram.getChatAdministrators(chatId);
        return admins.some((admin) => admin.user.id === userId);
    } catch (error) {
        console.error('Admin check error:', error);
        return false;
    }
};

export const message = (bot: Bot) => {
    // Обработчик ответов на сообщения бота
    bot.on('message', async (ctx) => {
        if (!('text' in ctx.message)) {
            return;
        }

        const text = ctx.message.text.toLocaleLowerCase();

        if (pidorAnswers.includes(text)) {
            return ctx.reply('Пидора ответ');
        }

        if (pizdaAnswers.includes(text)) {
            return ctx.reply('Пизда!');
        }

        const isCancell = cancelAnswers.some((answer) => text.includes(answer));
        const isWrongTime = wrongTimeAnswers.some((answer) => text.includes(answer));

        if (
            ctx.message.reply_to_message &&
            ctx.message.reply_to_message.from?.username === 'testosterone_super_bot' &&
            (isCancell || isWrongTime)
        ) {
            const chatId = ctx.chat.id;
            const chatData = loadChatData(chatId);

            const today = new Date();
            const month = today.getMonth();
            const day = today.getDate();

            if (!chatData[month]) {
                return;
            }

            const messageId = ctx.message.reply_to_message.message_id;
            const userId = ctx.message.from.id;
            const isAdmin = await checkAdminStatus(ctx, userId, chatId);

            const usersToCheck = isAdmin ? chatData.participants?.map(({ id }) => id) || [userId] : [userId];

            usersToCheck.forEach((uId) => {
                const data = chatData[month]?.[uId]?.[day];

                if (data && data.message_id === messageId) {
                    const newData = { ...chatData };
                    const user = chatData.participants?.find(({ id }) => id === uId);
                    const userName = user ? ` ${getUsername(user)}` : '';

                    if (isCancell) {
                        delete newData[month]![uId][day];

                        ctx.reply(`АХ ТЫ СУКА ${userName}! Отменяю запись сегодня.`);
                    } else if (isWrongTime) {
                        newData[month]![uId][day] = { ...newData[month]![uId][day], is_right_time: false };
                        ctx.reply(`Записано. ${userName} приходит не вовремя. Советую купить часы.`);
                    }

                    saveChatData(chatId, newData);
                    return;
                }
            });
        }
    });
};
