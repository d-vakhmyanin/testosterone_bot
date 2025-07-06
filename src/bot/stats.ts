import { COMMANDS } from './commands';

import { Bot } from '../types';
import { loadChatData } from '../utils/fs';
import { getRandom } from '../utils/getRandom';
import { getIdealDaysForMonth } from '../utils/getIdealDaysForMonth';
import { getUserDataStat } from '../utils/getUserDataStat';

const notRegisteredResponses = ['Петух раскомандовался. /register, для начала!', 'Нет. Иди нахуй /register'];

const trainingQuotes = [
    'Статистика - зеркало вашей лени!',
    'Цифры не врут - врут ваши отмазки!',
    'Чем ближе конец месяца - тем ближе к позору!',
    'Здесь каждый найдет свой уровень слабости',
];

export const calculateAllStats = (chatId: number, currentDate: Date) => {
    // Загружаем данные чата
    const chatData = loadChatData(chatId);

    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    const monthData = chatData[month];

    // 2. Собираем статистику по каждому
    const allStats: ReturnType<typeof getUserDataStat>[] = [];

    const idealDays = getIdealDaysForMonth(month);
    const passedIdealDays = idealDays.filter((day) => day <= date);

    chatData.participants?.forEach((user) => {
        const userTrainsData = monthData?.[user.id];
        allStats.push(getUserDataStat(passedIdealDays, user, userTrainsData));
    });

    // 3. Сортируем по убыванию баллов
    allStats.sort((a, b) => b.totalScore - a.totalScore);

    // 4. Формируем строки таблицы
    const header = `
<code>┌────────────┬────┬────┬────┬────┬───────┐
│ Участник   │ ✅ │ ⏱ │ 📅 │ 💀│ Балл  │
├────────────┼────┼────┼────┼────┼───────┤</code>`;

    const rows = allStats.map((user) => {
        const name = user.name.padEnd(10).slice(0, 10);
        return `<code>│ ${name} │ ${user.perfectCount.toString().padStart(2)} │ ${user.goodCount
            .toString()
            .padStart(2)} │ ${user.extraCount.toString().padStart(2)} │ ${user.missedCount
            .toString()
            .padStart(2)} │ ${user.totalScore.toFixed(1).padStart(5)} │</code>`;
    });

    const footer = `<code>└────────────┴────┴────┴────┴────┴───────┘</code>`;

    // 5. Формируем сообщение
    const monthName =  new Date(2023, month, 1).toLocaleString('ru-RU', { month: 'long' }).toUpperCase();
    let message = `
<b> ПОВЕРНИ МОБИЛУ ГОРИЗОНТАЛЬНО</b>

<b>📊 СТАТИСТИКА | ${monthName}</b>

${header}
${rows.join('\n')}
${footer}

<b>📌 Легенда:</b>
✅ Правильные день и время
⏱ Правильный день, но не время
📅 Тренировки в другие дни
💀 Пропущенные нужные дни

📊 Всего тренировок в месяце: ${idealDays.length}
`;

    message += `\n<code>${getRandom(trainingQuotes)}</code>`;
    message += `\n\nКак рассчитывается конечный бал - /details`;

    return {
        chatData,
        allStats,
        message,
        idealDays,
    };
};

export const stats = (bot: Bot) => {
    bot.command(COMMANDS.stats, (ctx) => {
        const userId = ctx.from.id;
        const chatId = ctx.chat.id;
        const currentDate = new Date();

        const { chatData, message } = calculateAllStats(chatId, currentDate);
        const { participants = [] } = chatData;

        // Проверяем регистрацию
        if (!participants.map(({ id }) => id).includes(userId)) {
            return ctx.reply(getRandom(notRegisteredResponses));
        }

        const monthData = chatData[currentDate.getMonth()];

        if (!monthData || !chatData.participants) {
            return ctx.replyWithHTML(
                '🔧<b>Ошибка:</b> Не удалось загрузить статистику\n<code>Скорее всего, вы, маслята, слишком мало ходите в качалку</code>'
            );
        }

        // 6. Отправляем сообщение
        ctx.replyWithHTML(message);
    });
};
