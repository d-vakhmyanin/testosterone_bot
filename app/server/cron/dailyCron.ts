import { CronJob } from 'cron';
import path from 'path';
import { getMatchesServer } from '@/app/api/get-matches/getMatchesServer';
import { updateMatches } from '@/app/api/get-matches/updateMatches';

import { ChatIdsMap, CronJobParameters } from './common';
import { allMarkedMessages, slackersMessages } from './constants';

import { TRAINING_CONFIG } from './../config';
import { loadChatData } from '../utils/fs';
import { getUsernameTag } from '../utils/getUsername';
import { getRandom } from './../utils/getRandom';
import { getWebLinkMarkup } from './../bot/web';
import { getAllBets } from '../utils/getAllBets';
import { getBetsMessage } from '../utils/getBetsMessage';

const getMediaFilePath = (fileName: string) => path.join(process.cwd(), 'app', 'server', 'assets', fileName);

const sendDailyMessage = async (...[bot, chatId]: CronJobParameters) => {
    const chatData = loadChatData(chatId);
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();

    const participants = chatData.participants || [];

    if (!participants.length) {
        return;
    }

    const slackers = participants.filter(({ id }) => !chatData[month]?.[id]?.[date]);

    const isMolodchikiParni = slackers.length === 0;
    const videoFileName = isMolodchikiParni
        ? 'success.mp4'
        : getRandom(['angry_cat.mp4', 'angry_cat_2.mp4', 'angry_cat_2.mp4']);
    const audioFileName = isMolodchikiParni ? 'davai.ogg' : 'wake_up.ogg';

    await bot.telegram.sendVideo(chatId, { source: getMediaFilePath(videoFileName) });
    await bot.telegram.sendAudio(
        chatId,
        { source: getMediaFilePath(audioFileName) },
        {
            caption: isMolodchikiParni
                ? getRandom(allMarkedMessages)
                : getRandom(slackersMessages).replace('users', slackers.map(getUsernameTag).join(', ')),
        }
    );
};

const sendDailyMorningHockeyMessage = async (...[bot, chatId]: CronJobParameters) => {
    const { matches } = await getMatchesServer({ type: 'today' });

    if (!bot.botInfo || !matches.length) {
        return;
    }

    const message =
        `<b>Сегодняшние матчи:</b>\n\n` +
        matches
            .map((match) => {
                const matchDate = new Date(match.date);

                return (
                    `🏒 <b>${match.homeTeam.name}</b> vs <b>${match.guestTeam.name}</b>\n` +
                    `🕐 ${matchDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}\n` +
                    `📍 ${match.homeTeam.city}\n`
                );
            })
            .join('\n');

    bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        ...getWebLinkMarkup(bot.botInfo.username, chatId, 'Голосуй или проиграешь 🗳️'),
    });
};

type EveningSentMap = {
    [chatId: number]: {
        [date: number]: {
            isEveningSent: boolean;
            isLokoSent?: boolean;
        };
    };
};

const isEveningSentMap: EveningSentMap = {};

const sendDailyEveningHockeyMessage = async (...[bot, chatId]: CronJobParameters) => {
    const today = new Date();
    const todayDate = today.getDate();

    if (!(chatId in isEveningSentMap)) {
        isEveningSentMap[chatId] = {};
    }

    const prevEveningMap = isEveningSentMap[chatId][todayDate] || {};

    if (prevEveningMap.isEveningSent || !bot.botInfo) {
        return;
    }

    await updateMatches();

    const { matches } = await getMatchesServer({ type: 'today' });

    const lokoMatch = matches.find((match) => match.homeTeam.id === 10 || match.guestTeam.id === 10);

    if (lokoMatch && Math.abs(lokoMatch.date - today.getTime()) < 1000 * 60 * 5) {
        bot.telegram.sendMessage(chatId, 'ВЕРИМ В КОМАНДУ');
    }

    if (lokoMatch && lokoMatch.isFinished && !prevEveningMap.isLokoSent) {
        const gameWinner =
            (lokoMatch.result?.homeScore || 0) > (lokoMatch.result?.guestScore || 0)
                ? lokoMatch.homeTeam
                : lokoMatch.guestTeam;
        const isLokoWon = gameWinner.id === 10;

        bot.telegram.sendMessage(chatId, isLokoWon ? 'СПАСИБО ПАРНИ' : 'ВСЕХ В МОЛОТ');

        isEveningSentMap[chatId][todayDate] = {
            ...prevEveningMap,
            isLokoSent: true,
        };
    }

    const finishedMatches = matches.filter(
        ({ isFinished, result }) => isFinished && Boolean(result)
    ) as Required<(typeof matches)[number]>[];

    if (!matches.length || finishedMatches.length !== matches.length) {
        return;
    }

    const matchesResultmessage =
        `<b>Результаты сегодняшних матчей:</b>\n\n` +
        finishedMatches
            .map((match) => {
                const { homeTeam, guestTeam, result } = match;

                let winTypeSuffix = '';
                if (result.winType === 'overtime') {
                    winTypeSuffix = ' (OT)';
                } else if (result.winType === 'shootout') {
                    winTypeSuffix = ' (Б)';
                }

                return `${homeTeam.name} ${result.homeScore} - ${result?.guestScore} ${guestTeam.name}${winTypeSuffix}`;
            })
            .join('\n');

    await bot.telegram.sendMessage(chatId, matchesResultmessage, { parse_mode: 'HTML' });

    const userBets = await getAllBets(bot, chatId);
    const message = getBetsMessage(userBets, finishedMatches);

    bot.telegram.sendMessage(chatId, message, { parse_mode: 'HTML' });

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.getDate();

    delete isEveningSentMap[chatId][yesterdayDate];

    isEveningSentMap[chatId][todayDate] = {
        ...prevEveningMap,
        isEveningSent: true,
    };
};

const handleTick = (type: 'gym' | 'hockeyMorning' | 'hockeyEvening', ...params: CronJobParameters) => {
    if (type === 'gym' && TRAINING_CONFIG.idealDaysOfWeek.includes(new Date().getDay())) {
        sendDailyMessage(...params);
    }

    if (type === 'hockeyMorning') {
        sendDailyMorningHockeyMessage(...params);
    }

    if (type === 'hockeyEvening') {
        sendDailyEveningHockeyMessage(...params);
    }
};

const chatIdsMap: ChatIdsMap = {};

export const createDailyCronJob = (...[bot, chatId]: Partial<CronJobParameters>) => {
    if (!chatId || !bot || chatId in chatIdsMap) {
        return;
    }

    const { dailyCronConfig } = TRAINING_CONFIG;
    // Единый CronJob, который срабатывает каждый день в указанное время
    const cronTime = `${dailyCronConfig.minute} ${dailyCronConfig.hour} * * *`; // Каждый день в hour:minute
    const gymJob = new CronJob(
        cronTime,
        () => handleTick('gym', bot, chatId),
        null, // onComplete
        true, // start
        'Europe/Moscow'
    );

    const hockeyMorningJob = new CronJob(
        '0 9 * * *', // в 9 часов 0 минут
        () => handleTick('hockeyMorning', bot, chatId),
        null,
        true,
        'Europe/Moscow'
    );

    const hockeyEveningJob = new CronJob(
        '*/10 * * * *', // каждые 10 минут
        () => handleTick('hockeyEvening', bot, chatId),
        null,
        true,
        'Europe/Moscow'
    );

    chatIdsMap[chatId] = true;

    return [gymJob, hockeyMorningJob, hockeyEveningJob];
};
