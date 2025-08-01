import { replyToMessage } from '../utils/replyToMessage';

import { COMMANDS } from './commands';

const message = `
🏋️‍♂️ <b>СЛУШАЙ СЮДА, МЕШОК С КОСТЯМИ!</b> 🏋️‍♂️

Вот как мы вычисляем самого <b>НЕДОКАЧКА</b> месяца:

1️⃣ <b>КТО В ЗОНЕ РИСКА:</b>
- Только люди из списка (/list)
- Обязательно должен быть <b>ХОТЯ БЫ ОДИН ПРОПУСК ХОРОШЕГО ДНЯ</b>

2️⃣ <b>КТО ПОПАДАЕТ НА МОЙ РАДАР:</b>
- <b>САМЫЙ НИЗКИЙ РЕЙТИНГ</b> (да-да, это про тебя)
- Есть кочки, у которых балл выше (все вместе не могут быть маслятами)
- Если таких <b>ПЕДИКОВ</b> несколько - <b>ВСЕ ПОЛУЧАЮТ ПО ПОЛНОЙ</b>

3️⃣ <b>ЧТО ЖДЁТ ЛОШАРУ:</b>
- <b>ТРОЛЛИНГ НА МЕСЯЦ ВПЕРЁД</b> по команде /shame (готовься, слабак)

4️⃣ <b>КОГДА ЭТО ПРОИСХОДИТ:</b>
- <b>АВТОМАТОМ</b> в последний день месяца, в 23:59
- <b>ВСЕ УВИДЯТ</b> кто тут <s>тухлый</s> античемпион
- <b>ДАННЫЕ НЕЛЬЗЯ УДАЛИТЬ</b> (чтобы помнил свой позор)

<b>СИНОНИМЫ ДЛЯ НАШЕГО ГЕРОЯ:</b>
"Мешок с костями", "Диванный воин", "Качок-призрак", "Гантель-лифтер", "Протеиновый пустышка", "Тренажёр для пыли"

<b>ЧТОБЫ УЗНАТЬ СВОЙ СТАТУС:</b>
👉 /shame - увидишь кто тут король диванов
👉 /stats - если осмелишься посмотреть
`;

export const shame_details = (bot: Bot) => {
    bot.command(COMMANDS.shame_details, (ctx) => {
        return replyToMessage(ctx, message);
    });
};
