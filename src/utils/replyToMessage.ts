import { Context } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

// Отвечаем реплаем, если есть сообщение
export const replyToMessage = (
    ctx: Context,
    message: string,
    withHTML = true,
    extra: ExtraReplyMessage = {}
) => {
    const method = withHTML ? 'replyWithHTML' : 'reply';
    const options = ctx.message
        ? {
              ...extra,
              reply_parameters: { ...(extra.reply_parameters || {}), message_id: ctx.message.message_id },
          }
        : extra;

    return ctx[method](message, options);
};
