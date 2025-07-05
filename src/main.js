import { config as dotenv } from 'dotenv';

import { launchBot } from './bot.js';

const main = () => {
    dotenv();
    launchBot();
};

main();
