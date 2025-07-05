import { start } from './start';

// Запуск бота
export const launchBot = () => {
    const bot = start();
    bot.launch();
};
