import { replyToMessage } from '../utils/replyToMessage';

import { COMMANDS } from './commands';

const message = `🏒 <b>Правила начисления баллов за ставки:</b>

✅ <b>Угадан победитель:</b> +1 балл
🎯 <b>Точный счет:</b> +3 балла
⏰ <b>Время окончания:</b>
   • Основное время: +0.2 балла
   • Овертайм/буллиты: +0.5 балла
📈 <b>Тотал голов:</b> +0.1 балла за каждый гол (например, тотал 6.5 = +0.65)

Самое время сделать ДЕП!`;

export const bet_rules = (bot: Bot) => {
    bot.command(COMMANDS.bet_rules, (ctx) => {
        return replyToMessage(ctx, message);
    });
};
