import { config as dotenv } from 'dotenv';
import { launchBot } from './bot/index';
const main = () => {
    dotenv();
    launchBot();
};
main();
