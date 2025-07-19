import { COMMANDS } from './commands';

import { Bot } from '../types';
import { TRAINING_CONFIG } from '../config';
import { replyToMessage } from '../utils/replyToMessage';

const getWeekDayNames = (weekdays: number[]) =>
    weekdays
        .map((dayNumber) => {
            if (
                typeof dayNumber !== 'number' ||
                dayNumber < 0 ||
                dayNumber > 6 ||
                !Number.isInteger(dayNumber)
            ) {
                throw new Error(
                    `Некорректный номер дня: ${dayNumber}. Допустимые значения: 0 (воскресенье) - 6 (суббота).`
                );
            }

            const date = new Date(2023, 0, 1 + dayNumber); // 1 января 2023 = воскресенье (0)
            return date.toLocaleDateString('ru-RU', { weekday: 'short' });
        })
        .join('/');

export const details = (bot: Bot) => {
    bot.command(COMMANDS.details, (ctx) => {
        const weekdayNames = getWeekDayNames(TRAINING_CONFIG.idealDaysOfWeek);

        replyToMessage(
            ctx,
            `
<b>📊 Система начисления баллов:</b>

✔ <u>Идеальная тренировка</u> (${weekdayNames}):
<b>${TRAINING_CONFIG.rules.PERFECT.score} балл</b> (и всеобщее УВОЖЕНИЕ)

⏱ <u>Правильный день, но не время</u>:
<b>${TRAINING_CONFIG.rules.GOOD_DAY_BAD_TIME.score} балла</b> (не штраф!)  

📅 <u>Другие дни</u>: 
<b>${TRAINING_CONFIG.rules.BAD_DAY.score} балла</b> (просто для галочки)  

💀 <u>Пропуск ${weekdayNames}</u>: 
<b>${TRAINING_CONFIG.rules.SKIP.score} балла</b> (ЭТО ЗАЛЁТ, ВОИН)  

<code>Ходи в нужные дни — и не станешь лохом!</code>
`
        );
    });
};
