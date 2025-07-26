import { Context, NarrowedContext } from 'telegraf';
import { message as messageFilter } from 'telegraf/filters';
import { Message, Update } from 'telegraf/types';

import { COMMANDS } from './commands';

import { loadChatData, saveChatData } from '../utils/fs';
import { getUsername } from '../utils/getUsername';
import { replyToMessage } from '../utils/replyToMessage';

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
    bot.on(messageFilter('text'), async (ctx) => {
        if (!('text' in ctx.message)) {
            return;
        }

        const text = ctx.message.text.toLocaleLowerCase();

        if (pidorAnswers.includes(text)) {
            return replyToMessage(ctx, 'Пидора ответ');
        }

        if (pizdaAnswers.includes(text)) {
            return replyToMessage(ctx, 'Пизда!');
        }

        const isCancell = cancelAnswers.some((answer) => text.includes(answer));
        const isWrongTime = wrongTimeAnswers.some((answer) => text.includes(answer));
        const reply = ctx.message.reply_to_message;

        if (
            !reply ||
            !('text' in reply) ||
            !reply.text.toLocaleLowerCase().includes(`/${COMMANDS.gym}`) ||
            (!isCancell && !isWrongTime)
        ) {
            return;
        }

        const chatId = ctx.chat.id;
        const userId = ctx.message.from.id;
        const replyUserId = reply.from?.id;
        const isAdmin = await checkAdminStatus(ctx, userId, chatId);

        if (!replyUserId || (userId !== replyUserId && !isAdmin)) {
            return replyToMessage(ctx, 'Ты по-моему перепутал');
        }

        const chatData = loadChatData(chatId);

        const timestampString = `${reply.date}000`;
        const date = new Date(Number(timestampString));
        const month = date.getMonth();
        const day = date.getDate();

        const data = chatData[month]?.[replyUserId]?.[day];

        if (!data) {
            return replyToMessage(ctx, 'Такой записи не существует, обморок');
        }

        const newData = { ...chatData };
        const user = chatData.participants?.find(({ id }) => id === replyUserId);
        const userName = user ? `${getUsername(user)}` : '';

        if (isCancell) {
            delete newData[month]![replyUserId][day];

            replyToMessage(ctx, `АХ ТЫ СУКА ${userName}! Отменяю запись сегодня.`);
        } else if (isWrongTime) {
            newData[month]![replyUserId][day] = {
                ...newData[month]![replyUserId][day],
                is_right_time: false,
            };
            replyToMessage(ctx, `Записано. ${userName} приходит не вовремя. Советую купить часы.`);
        }

        saveChatData(chatId, newData);
    });
};
