import { config as dotenv } from 'dotenv';

import { initBot } from './bot';

dotenv();

let bot: Bot;

export const getBotInstance = () => {
    if (!bot) {
        bot = initBot();
    }

    return bot;
};
