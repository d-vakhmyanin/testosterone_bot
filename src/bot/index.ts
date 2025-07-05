import { start } from './start';
import { help } from './help';

// Запуск бота
export const launchBot = () => {
    const bot = start();
    help(bot);
    bot.launch();
};
