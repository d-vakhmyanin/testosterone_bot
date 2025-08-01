import { CronJob } from 'cron';

import { ChatIdsMap, CronJobParameters } from './common';

import { calculateAllStats } from '../bot/stats';
import { saveChatData } from '../utils/fs';

const mapNames = (arr: { name: unknown }[]) => arr.map(({ name }) => name).join(', ');

// 1. Функция для ежемесячного расчёта статистики
const calculateMonthlyStats = (...[bot, chatId]: CronJobParameters) => {
    const now = new Date();
    const month = now.getMonth();

    const { allStats, message, chatData, idealDays } = calculateAllStats(chatId, now);
    const bestStat = allStats[0];
    const worstStat = allStats[allStats.length - 1];

    const worstStats = allStats.filter((el) => el.totalScore <= worstStat.totalScore);
    const bestStats = allStats.filter((el) => el.totalScore >= bestStat.totalScore);

    const isWorstUserFound =
        bestStat.totalScore > worstStat.totalScore && worstStat.perfectCount < idealDays.length;

    const bestUserNames = mapNames(bestStats);
    const worstUserNames = mapNames(worstStats);

    let fullMessage = `
<b> ❗ВСЕМ ВНИМАНИЕ❗ </b>
<b> ❗ЭТОТ ДЕНЬ НАСТАЛ❗ </b>
    ${message}

${bestUserNames}! ТАК ДЕРЖАТЬ!
    `;

    if (isWorstUserFound) {
        fullMessage = `${fullMessage}
${worstUserNames}! БЛИЖАЙШИЙ МЕСЯЦ НАДОЛГО ЗАПОМНИТСЯ НАМ ВСЕМ. /shame
    `;
    }

    if (isWorstUserFound) {
        const worstUserIds = worstStats.map(({ userId }) => userId);
        const worstUsers = chatData.participants?.filter(({ id }) => worstUserIds.includes(id));

        // 5. Сохраняем статистику
        saveChatData(chatId, { ...chatData, [month]: { ...chatData[month], shame: worstUsers } });
    }

    // 6. Отправляем в чат
    bot.telegram.sendMessage(chatId, fullMessage, { parse_mode: 'HTML' });
};

const handleTick = async (...params: CronJobParameters) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Проверяем, что завтра действительно новый месяц
    if (today.getMonth() !== tomorrow.getMonth()) {
        calculateMonthlyStats(...params);
    }
};

const chatIdsMap: ChatIdsMap = {};

export const createMonthlyCronJob = (...[bot, chatId]: Partial<CronJobParameters>) => {
    if (!chatId || !bot || chatId in chatIdsMap) {
        return;
    }

    // 7. Настраиваем cron-задачу на последний день месяца в 23:59
    const job = new CronJob(
        '59 23 28-31 * *', // Запуск в 23:59 в последний день месяца
        () => handleTick(bot, chatId),
        null,
        true,
        'Europe/Moscow'
    );

    chatIdsMap[chatId] = true;

    return job;
};
