import { COMMANDS } from './commands';

import { Bot } from '../types';
import { loadChatData } from '../utils/fs';
import { getRandom } from '../utils/getRandom';
import { getUsername } from '../utils/getUsername';

const noUserResponses = [
    'Система не видит явного лоха. Но это ненадолго!',
    'Месяц только начался — позор ещё проявится!',
    'Пока петушиный угол пуст. Но расслабляться рано. Я слежу за вами 👁',
    'Лохи существуют, но их скрывает (((мировая закулиса)))!',
];

const singleShameResponses = [
    (userName: string) =>
        `🤢 <b>${userName}</b> вызывает рвотный рефлекс у спортивного сообщества.`,
    (userName: string) => `☠️ <b>${userName}</b> - позор в чистом виде.`,
    (userName: string) =>
        `🧻 <b>${userName}</b> - туалетная бумага в мире железного спорта.`,
    (userName: string) =>
        `🪵 Дерево за окном показало лучшие результаты, чем <b>${userName}</b>`,
    (userName: string) =>
        `💩 <b>${userName}</b> - доказательство теории деградации видов.`,
    (userName: string) =>
        `🫁 Легкие <b>${userName}</b> знают только один газ - пердёж матёрых зеков.`,
    (userName: string) =>
        `🪙 Премия Дарвина для <b>${userName}</b> - за выживание без мышц.`,
    (userName: string) =>
        `🍞 <b>${userName}</b> - заплесневелый сухарь в компании протеиновых батончиков.`,
    (userName: string) =>
        `🦴 Мышечная масса <b>${userName}</b> сравнима с медузой в спирте.`,
    (userName: string) =>
        `🪦 Надгробная плита <b>${userName}</b> будет гласить: "Здесь лежит человек, который мог, но не стал".`,
];

const getGroupShameMessage = (losers: string[], count: number): string => {
    const emojiMap: Record<number, string> = {
        2: '👯♂️👯♀️',
        3: '👨👩👦',
        4: '👨👩👧👦',
        5: '🧑🤝🧑🧑',
        6: '👨👩👦👨👩👦',
    };

    const groupEmoji = emojiMap[count] || '👥';

    const phrases = [
        `${groupEmoji} <b>Групповой позор!</b> ${losers.join(
            ', '
        )} - вы как стадо слонов в посудной лавке, только менее грациозные`,
        `🏆 <b>Командный зачет по лени</b>! ${count} человек доказали, что бездарность любит компанию: ${losers
            .slice(0, 3)
            .join(', ')}${
            count > 3 ? ' и еще ' + (count - 3) + ' лузера' : ''
        }`,
        `${groupEmoji} Когда ${losers[0]} чихнул бездельем, ${
            count - 1
        } подхватили! Вот она - сила коллектива!`,
        `💩 <b>Гора мусора выросла до ${count} единиц</b>: ${
            losers.length > 3
                ? losers[0] + ', ' + losers[1] + ' и ко.'
                : losers.join(', ')
        }`,
        `🪓 <b>Лесоруб бы заплакал</b> от такой группы сухих пней: ${losers
            .slice(0, 2)
            .join(', ')}${count > 2 ? ` и ${count - 2} других пеньков` : ''}`,
        `🧟 <b>Зомби-апокалипсис!</b> ${count} особей (${losers[0]}, ${
            losers[1]
        }${count > 2 ? ` и др.` : ``}) не могут оторвать жопы от дивана`,
    ];

    return `${getRandom(
        phrases
    )}\n\n<code>"Когда все плохи - это уже система!"</code>`;
};

export const shame = (bot: Bot) => {
    bot.command(COMMANDS.shame, (ctx) => {
        const chatData = loadChatData(ctx.chat.id);

        const currentDate = new Date();
        const month = currentDate.getMonth();
        const prevMonth = month === 11 ? 0 : month - 1;

        const shameUsers = chatData[month]?.shame || chatData[prevMonth]?.shame;

        if (!shameUsers?.length) {
            return ctx.replyWithHTML(getRandom(noUserResponses));
        } else if (shameUsers.length === 1) {
            return ctx.replyWithHTML(
                getRandom(singleShameResponses)(getUsername(shameUsers[0]))
            );
        } else {
            return ctx.replyWithHTML(
                getGroupShameMessage(
                    shameUsers.map(getUsername),
                    shameUsers.length
                )
            );
        }
    });
};
