// https://core.telegram.org/bots/api#formatting-options
// Custom emoji entities can only be used by bots that purchased additional usernames on Fragment.

type Emoji = {
    type: 'custom_emoji';
    custom_emoji_id: string;
    offset: number;
    length: number;
};

type Team = {
    id: number;
    name: string;
    conference: 'west' | 'east';
    city: string;
    emoji?: Emoji;
};

export const TEAMS: Team[] = [
    {
        id: 1,
        name: 'Ак Барс',
        city: 'Казань',
        conference: 'east',
    },
    {
        id: 2,
        name: 'Автомобилист',
        city: 'Екатеринбург',
        conference: 'east',
    },
    {
        id: 3,
        name: 'Адмирал',
        city: 'Владивосток',
        conference: 'east',
    },
    {
        id: 4,
        name: 'Авангард',
        city: 'Омск',
        conference: 'east',
    },
    {
        id: 5,
        name: 'Амур',
        city: 'Хабаровск',
        conference: 'east',
    },
    {
        id: 6,
        name: 'Барыс',
        city: 'Астана',
        conference: 'east',
    },
    {
        id: 7,
        name: 'Салават Юлаев',
        city: 'Уфа',
        conference: 'east',
    },
    {
        id: 8,
        name: 'Сибирь',
        city: 'Новосибирск',
        conference: 'east',
    },
    {
        id: 9,
        name: 'Трактор',
        city: 'Челябинск',
        conference: 'east',
    },
    {
        id: 10,
        name: 'Локомотив',
        city: 'Ярославль',
        conference: 'west',
    },
    {
        id: 11,
        name: 'Нефтехимик',
        city: 'Нижнекамск',
        conference: 'east',
    },
    {
        id: 12,
        name: 'Металлург Мг',
        city: 'Магнитогорск',
        conference: 'east',
    },
    {
        id: 13,
        name: 'Торпедо',
        city: 'Нижний Новгород',
        conference: 'west',
    },
    {
        id: 14,
        name: 'Спартак',
        city: 'Москва',
        conference: 'west',
    },
    {
        id: 15,
        name: 'ХК Сочи',
        city: 'Сочи',
        conference: 'west',
    },
    {
        id: 16,
        name: 'Северсталь',
        city: 'Череповец',
        conference: 'west',
    },
    {
        id: 17,
        name: 'Динамо М',
        city: 'Москва',
        conference: 'west',
    },
    {
        id: 18,
        name: 'ЦСКА',
        city: 'Москва',
        conference: 'west',
    },
    {
        id: 19,
        name: 'СКА',
        city: 'Санкт-Петербург',
        conference: 'west',
    },
    {
        id: 21,
        name: 'Динамо Мн',
        city: 'Минск',
        conference: 'west',
    },
    {
        id: 22,
        name: 'Драконы',
        city: 'Шанхай',
        conference: 'west',
    },
    {
        id: 23,
        name: 'Лада',
        city: 'Тольятти',
        conference: 'west',
    },
];
