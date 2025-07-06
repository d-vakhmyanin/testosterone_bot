import { start } from './start';
import { help } from './help';
import { register } from './register';
import { unregister } from './unregister';
import { list } from './list';
import { gym } from './gym';
import { shame } from './shame';
import { stats } from './stats';
import { details } from './details';
import { message } from './message';

// Запуск бота
export const launchBot = () => {
    const bot = start();

    help(bot);
    register(bot);
    unregister(bot);
    list(bot);
    gym(bot);
    shame(bot);
    stats(bot);
    details(bot);

    message(bot);

    bot.launch();
};
