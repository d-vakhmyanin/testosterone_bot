import { start } from './start';
import { help } from './help';
import { register } from './register';
import { unregister } from './unregister';
import { list } from './list';

// Запуск бота
export const launchBot = () => {
    const bot = start();

    help(bot);
    register(bot);
    unregister(bot);
    list(bot);

    bot.launch();
};
