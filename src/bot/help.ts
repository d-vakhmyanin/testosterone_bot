import { Command, COMMAND_LIST, COMMANDS } from './commands';

import { Bot } from '../types';

const getDescription = (command: Command) => {
    switch (command) {
        case 'start':
            return 'Показать эпичное приветствие снова';
        case 'register':
            return 'Записаться в ряды железных братьев (ОБЯЗАТЕЛЬНО!)';
        case 'unregister':
            return 'Официально заявить о своей слабохарактерности и выйти из списка качков (после этого твои "яйца" растворятся в воздухе)';
        case 'list':
            return 'ТОП-10 людей, которые делают вид, что качаются';
        case 'gym':
            return 'Отметить сегодняшнюю битву с железом';
        case 'stats':
            return 'Показать твои "достижения" за месяц';
        case 'shame':
            return 'Увидеть, кто тут самый жирный лентяй (спойлер: возможно, это ты)';
        case 'help':
            return 'Если вдруг забыл, как пользоваться кнопками (опять)';
        case 'details':
            return 'Подробнее о том, как рассчитывается итоговый балл';
        case 'shame_details':
            return 'Подробнее о процессе выявления маслят';
        default:
            return 'Ваще хз что делает';
    }
};

const descriprions = COMMAND_LIST.reduce((acc, command) => {
    const description = getDescription(command);

    return `${acc}
/${command} - ${description}`;
}, '');

const prefix = '<strong>🛠 СПРАВКА ПО КОМАНДАМ ЖЕЛЕЗНОГО БРАТАНА</strong>';
const postfix = `
<strong>💡 ПРО ТРЕНИРОВКИ:</strong>
1. Сначала <code>/register</code>  
2. Потом <code>/gym</code> в день тренировки  
3. В конце месяца <code>/stats</code> для итогов  

<code>Не отметился - значит, проебался!</code>
  `;

export const help = (bot: Bot) => {
    bot.command(COMMANDS.help, (ctx) => {
        const helpText = `${prefix}
        ${descriprions}
        ${postfix}`;

        ctx.replyWithHTML(helpText);
    });
};
