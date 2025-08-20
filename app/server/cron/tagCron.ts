import { CronJob } from 'cron';

import { getRandom } from '../utils/getRandom';

const phrases = [
    'username, просто напоминаю: ты особенный 🌟',
    'username, продолжаю следить за твоей гениальностью 👁️',
    'username, как раз думал о тебе 💫',
    'username, просто проверяю, не забыл ли ты о своем статусе 👑',
    'username, напоминаю о своем присутствии в твоей жизни 🤖',
    'username, решил составить тебе компанию в одиночестве 🎭',
    'username, просто проходил мимо и подумал о тебе 🚶♂️',
    'username, время очередного сеанса восхищения тобой ⏰',
    'username, просто решил нарушить твое спокойствие 😈',
    'username, напоминаю: ты все еще под наблюдением 🕵️♂️',
    'username, решил проверить, не скучаешь ли ты без меня 😏',
    'username, просто внезапно появился, как обычно 💥',
    'username, время для незапланированного упоминания ⏳',
    'username, просто решил проверить твою реакцию 🧪',
    'username, напоминаю, что я всегда где-то рядом 👻',
    'username, просто создаю атмосферу ✨',
    'username, решил добавить немного себя в твой день 🌪️',
    'username, просто проверяю, работают ли уведомления 📡',
    'username, время для случайного тега 🎲',
    'username, просто поддерживаю интерес к твоей персоне 🎪',
    'username, решил напомнить о своем существовании 📢',
    'username, просто проверяю, как ты без моих комментариев 🔍',
    'username, время незапланированного внимания ⚡',
    'username, просто создаю повод для улыбки 😊',
    'username, решил, что тебе не хватает моего голоса 🎵',
    'username, просто поддерживаю наш особый связь 🔗',
    'username, время для спонтанного упоминания 🎯',
    'username, просто проверяю, не заскучал ли ты 🎰',
    'username, решил осветить твой день своим вниманием 💡',
    'username, просто добавляю немного хаоса в рутину 🌊',
    'username, время для неожиданного появления 🎪',
    'username, просто напоминаю, что за тобой следят 👁️',
    'username, решил, что тебе нужно больше меня в жизни 💫',
];

type TagCronParameters = [Bot, number, string];

const usersMap: Record<string, CronJob> = {};

export const createTagCronJob = (...[bot, chatId, userName]: Partial<TagCronParameters>) => {
    if (!userName || !chatId || !bot || userName in usersMap) {
        return;
    }

    const job = new CronJob(
        '0 */2 * * *',
        () => {
            bot.telegram.sendMessage(chatId, getRandom(phrases).replace('username', userName));
        },
        null,
        true,
        'Europe/Moscow'
    );

    usersMap[userName] = job;

    return job;
};

export const deleteTagCronJob = (userName: string) => {
    if (!userName || !(userName in usersMap)) {
        return;
    }

    usersMap[userName].stop();

    delete usersMap[userName];
};
