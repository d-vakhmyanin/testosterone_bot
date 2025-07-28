import { CronJob } from 'cron';
import path from 'path';

import { ChatIdsMap, CronJobParameters } from './common';

import { TRAINING_CONFIG } from './../config';
import { loadChatData } from '../utils/fs';
import { getUsernameTag } from '../utils/getUsername';
import { getRandom } from './../utils/getRandom';

const getMediaFilePath = (fileName: string) => path.join(process.cwd(), 'app', 'server', 'assets', fileName)

const allMarkedMessages = [
    "Все отметились? Серьёзно? 😏 Роман Борисыч пока не верит. Он уже готовит 'сюрприз' для тех, кто не явится. ⏰",
    'О, все в списке? Йозе Марино хмыкает: «Ну посмотрим...» Если кто-то слиняет — он станет мемом российской качалки. 🏋️‍♂️💀',
    'РоРо доволен? Нет. Он ждет. Если кто-то не придет — его имя выгравируют на Доске Позора Российской Качалки. ⏰',
    'Все записались? Хм... Роман Борисыч подозрительно молчит. Лучше не проверять, что у него на уме. 🚪💥',
    'Йозе Марино сказал: «Если хоть один не придет — я его найду.» Вы уверены, что хотите рискнуть? ⏰',
    'РоРо кивнул, но его глаза говорят: «Я вас проверю.» Не подведите, или станете легендой слабости. 💪🔥',
    "Все отметились? Хорошо. Но Роман Борисыч уже готовит 'особый' комплекс для прогульщиков. 🏋️‍♂️😈",
    'Йозе Марино ухмыляется: «Интересно, сколько из вас реально придет?» Не дайте ему повода разочароваться. ⏰',
    'РоРо записал всех в блокнот. Если кто-то не явится — его фото повесят в раздевалке с подписью «Этот человек боится железа». 📸😱',
    'Роман Борисыч одобрил список, но добавил: «Посмотрим, кто выживет.» Не будьте слабаком — приходите. 💀🔥',
    'Йозе Марино звонит в колокол тревоги. Все отметились, но он не верит. Докажите, что вы не мусор. ⏰',
    'РоРо скрестил руки: «Ну что, герои?» Если кто-то не придет — он лично придет за объяснениями. 🚔💢',
    "Все в списке? Отлично. Роман Борисыч уже придумал 'награду' для первого, кто не явится. 🏆💀",
    'Йозе Марино сказал: «Если вы все прийдете — я удивлюсь.» Не дайте ему усомниться в вас. ⏰',
    'РоРо кивает: «Хороший список. Жаль, если он окажется фейком.» Не подведите — или станете посмешищем. 😤',
    'Роман Борисыч смотрит на список и шепчет: «Интересно, сколько трупов будет завтра?» Не будьте одним из них. ⚰️💪',
    'Йозе Марино улыбается: «Вы все такие храбрые на бумаге...» Докажите, что вы не просто строчки в списке. ⏰',
    'РоРо сказал: «Если все придут — я куплю пиццу. Но я не верю в это.» Не дайте ему скупить всю пиццу в городе. 🍕😏',
    'Роман Борисыч ведет учет. Если кто-то не придет — его имя занесут в «Книгу слабаков». 📖💀',
    'Йозе Марино звонит в колокол: «Последний звонок для тех, кто еще не отметился.» ⏰',
];

const slackersMessages = [
    'users, серьезно? РоРо уже точит гантели. Отмечайтесь: ⏰ /gym — или станете позором российской качалки. 💀',
    'Йозе Марино в ярости. users, еще можно спастись: ⏰ /gym. Или вас выставят на «Слабо?». 😤',
    'Роман Борисыч смотрит на вас с презрением. users, последний шанс: ⏰ /gym — или ваше имя будет выкрикивать в зале как пример слабости. 🔥',
    'users, РоРо уже готовит для вас «особый» комплекс. Хотите избежать? ⏰ /gym — или станете мемом. 😱',
    'Йозе Марино сказал: «Эти users — позор российской качалки.» Исправьтесь: ⏰ /gym. 🏋️‍♂️💢',
    'Роман Борисыч записывает users в «Книгу слабаков». Хотите вычеркнуться? ⏰ /gym — или вас будут вспоминать как пример того, как НЕ надо. 📖',
    'РоРо звонит в колокол тревоги. users, вы последние, кто еще не отметился. ⏰ /gym — или станете легендой лени. 💀',
    'Йозе Марино смеется: «users боится железа.» Докажите обратное: ⏰ /gym. 🐔➡️🦍',
    'Роман Борисыч сказал: «Если users не придут — я лично приду за ними.» Шутки кончились. ⏰ /gym. 🚔',
    'РоРо смотрит на users и качает головой. «Позор. Российской. Качалки.» Исправьте это: ⏰ /gym. 😤',
    'Йозе Марино сказал: «users, вы уже проиграли.» Но вы можете передумать: ⏰ /gym. ⏳',
    'Роман Борисыч ведет черный список. users, хотите в него попасть? Нет? Тогда ⏰ /gym. 📜',
    'РоРо готовит «сюрприз» для users. Хотите его избежать? ⏰ /gym. 🎁💀',
    'Йозе Марино сказал: «users, вы — слабое звено. Прощайте.» Или нет? ⏰ /gym. ⛓️',
    'Роман Борисыч записал users в список «Люди, которые боятся пота». Хотите исправиться? ⏰ /gym. 💦',
    'РоРо зовет users: «Последний шанс.» ⏰ /gym — или вас выставят на всеобщее осмеяние. 🎤',
    'Йозе Марино сказал: «users, вы уже почти в мусорке истории.» Вытащите себя: ⏰ /gym. 🗑️',
    'Роман Борисыч добавил users в «Список на растерзание». Хотите вычеркнуться? ⏰ /gym. 🦁',
    'РоРо смотрит на users и вздыхает: «Жаль.» Но еще не поздно: ⏰ /gym. ⏳',
    'Йозе Марино сказал: «users, вас уже нет.» Докажите, что это не так: ⏰ /gym. 💀🔥',
];

const sendDailyMessage = async (...[bot, chatId]: CronJobParameters) => {
    const chatData = loadChatData(chatId);
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();

    const participants = chatData.participants || [];
    const slackers = participants.filter(({ id }) => !chatData[month]?.[id]?.[date]);

    const isMolodchikiParni = slackers.length === 0;
    const videoFileName = isMolodchikiParni ? 'success.mp4' : 'angry_cat.mp4';
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

const handleTick = (...params: CronJobParameters) => {
    if (TRAINING_CONFIG.idealDaysOfWeek.includes(new Date().getDay())) {
        sendDailyMessage(...params);
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
    const job = new CronJob(
        cronTime,
        () => handleTick(bot, chatId),
        null, // onComplete
        true, // start
        'Europe/Moscow'
    );

    chatIdsMap[chatId] = true;

    return job;
};
