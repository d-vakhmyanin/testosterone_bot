import { Telegraf } from 'telegraf';

let bot;

const createBot = () => {
    bot = new Telegraf(process.env.TG_TOKEN);

    // Обработчик команды /start (работает и в группе, и в лс)
    bot.command('start', (ctx) => {
        // Проверяем, откуда пришла команда (группа или личка)
        if (ctx.chat.type === 'private') {
            ctx.reply('Привет! Добавь меня в группу, чтобы я работал!');
        } else {
            ctx.reply(`Привет, я бот для этой группы! Мои команды: /help`);
        }
    });
};

const addCommands = () => {
    // Команда /help (только для групп)
    bot.command('help', (ctx) => {
        if (ctx.chat.type === 'supergroup' || ctx.chat.type === 'group') {
            ctx.reply(
                'Доступные команды:\n/start - приветствие\n/help - помощь\n/mute - замутить пользователя'
            );
        } else {
            ctx.reply('Эта команда работает только в группах!');
        }
    });

    // Команда /mute (мутит пользователя, требует права админа)
    bot.command('mute', async (ctx) => {
        // Проверяем, что команда вызвана в группе
        if (ctx.chat.type !== 'supergroup' && ctx.chat.type !== 'group') {
            return ctx.reply('Эта команда только для групп!');
        }

        // Проверяем, есть ли у бота права админа
        const botInfo = await ctx.getChatMember(bot.botInfo.id);
        if (!botInfo.can_restrict_members) {
            return ctx.reply('Мне нужны права админа для этой команды!');
        }

        // Мьют (если это ответ на сообщение)
        if (ctx.message.reply_to_message) {
            const userId = ctx.message.reply_to_message.from.id;
            await ctx.restrictChatMember(userId, {
                permissions: { can_send_messages: false },
            });
            ctx.reply(
                `Пользователь @${ctx.message.reply_to_message.from.username} замьючен!`
            );
        } else {
            ctx.reply(
                'Ответьте на сообщение пользователя, чтобы замутить его!'
            );
        }
    });
};

// Запуск бота
export const launchBot = () => {
    createBot();
    addCommands();
    bot.launch();
};
