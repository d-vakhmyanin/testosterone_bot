import { Exercise } from './types';

const BACK = [
    { id: '1', name: 'Становая тяга', group: 'back', isHidden: false, isProtected: true },
    { id: '2', name: 'Подтягивания', group: 'back', isHidden: false, isProtected: false },
    { id: '3', name: 'Тяга штанги в наклоне', group: 'back', isHidden: false, isProtected: false },
    { id: '4', name: 'Тяга Т-грифа', group: 'back', isHidden: false, isProtected: false },
    { id: '5', name: 'Тяга гантели одной рукой', group: 'back', isHidden: false, isProtected: false },
    {
        id: '6',
        name: 'Тяга горизонтального блока',
        group: 'back',
        isHidden: false,
        isProtected: false,
    },
    { id: '7', name: 'Тяга вертикального блока', group: 'back', isHidden: false, isProtected: false },
    { id: '9', name: 'Гиперэкстензия', group: 'back', isHidden: false, isProtected: false },
    { id: '10', name: 'Шраги со штангой', group: 'back', isHidden: false, isProtected: false },
    { id: '12', name: 'Пуловер с гантелью', group: 'back', isHidden: false, isProtected: false },
    { id: '13', name: 'Рычажная тяга', group: 'back', isHidden: false, isProtected: false },
    { id: '14', name: 'Тяга Смита в наклоне', group: 'back', isHidden: false, isProtected: false },
    { id: '17', name: 'Тяга блока к лицу (Фейс-пул)', group: 'back', isHidden: false, isProtected: false },
    { id: '18', name: 'Румынская тяга', group: 'back', isHidden: false, isProtected: false },
] as const;

const LEGS = [
    { id: '22', name: 'Приседания со штангой', group: 'legs', isHidden: false, isProtected: true },
    { id: '23', name: 'Жим ногами в тренажере', group: 'legs', isHidden: false, isProtected: false },
    { id: '24', name: 'Выпады со штангой', group: 'legs', isHidden: false, isProtected: false },
    { id: '25', name: 'Болгарские сплит-приседания', group: 'legs', isHidden: false, isProtected: false },
    { id: '27', name: 'Сгибания ног в тренажере', group: 'legs', isHidden: false, isProtected: false },
    { id: '28', name: 'Разгибания ног в тренажере', group: 'legs', isHidden: false, isProtected: false },
    { id: '30', name: 'Подъем на носки', group: 'legs', isHidden: false, isProtected: false },
    { id: '31', name: 'Гакк-приседания', group: 'legs', isHidden: false, isProtected: false },
    { id: '32', name: 'Приседания в Смите', group: 'legs', isHidden: false, isProtected: false },
    { id: '33', name: 'Зашагивания на платформу', group: 'legs', isHidden: false, isProtected: false },
    { id: '44', name: 'Приседания пистолетиком', group: 'legs', isHidden: false, isProtected: false },
    { id: '45', name: 'Жим платформы одной ногой', group: 'legs', isHidden: false },
] as const;

const CHEST = [
    { id: '47', name: 'Жим штанги лежа', group: 'chest', isHidden: false, isProtected: true },
    { id: '48', name: 'Жим гантелей лежа', group: 'chest', isHidden: false, isProtected: false },
    { id: '49', name: 'Жим штанги на наклонной скамье', group: 'chest', isHidden: false, isProtected: false },
    {
        id: '50',
        name: 'Жим гантелей на наклонной скамье',
        group: 'chest',
        isHidden: false,
        isProtected: false,
    },
    { id: '51', name: 'Отжимания от брусьев', group: 'chest', isHidden: false, isProtected: false },
    { id: '52', name: 'Сведения рук', group: 'chest', isHidden: false, isProtected: false },
    { id: '54', name: 'Жим в хаммере', group: 'chest', isHidden: false, isProtected: false },
    { id: '55', name: 'Разводка гантелей лежа', group: 'chest', isHidden: false, isProtected: false },
    { id: '56', name: 'Жим штанги вниз головой', group: 'chest', isHidden: false, isProtected: false },
    {
        id: '57',
        name: 'Отжимания от пола с отягощением',
        group: 'chest',
        isHidden: false,
        isProtected: false,
    },
    { id: '59', name: 'Жим в тренажере Смита', group: 'chest', isHidden: false, isProtected: false },
    {
        id: '61',
        name: 'Жим гантелей на скамье с обратным наклоном',
        group: 'chest',
        isHidden: false,
        isProtected: false,
    },
    { id: '64', name: 'Жим Арнольда', group: 'chest', isHidden: false, isProtected: false },
] as const;

const BICEPS = [
    { id: '67', name: 'Подъем штанги на бицепс', group: 'biceps', isHidden: false, isProtected: false },
    { id: '68', name: 'Подъем гантелей на бицепс', group: 'biceps', isHidden: false, isProtected: false },
    {
        id: '69',
        name: 'Подъем гантелей на бицепс «Молот»',
        group: 'biceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '70',
        name: 'Подъем штанги на бицепс обратным хватом (брахицефал)',
        group: 'biceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '71',
        name: 'Концентрированный подъем на бицепс',
        group: 'biceps',
        isHidden: false,
        isProtected: false,
    },
    { id: '72', name: 'Подъем на бицепс в кроссовере', group: 'biceps', isHidden: false, isProtected: false },
    {
        id: '74',
        name: 'Подъем на бицепс на скамье Скотта',
        group: 'biceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '75',
        name: 'Подъем на бицепс с канатной рукоятью',
        group: 'biceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '76',
        name: 'Подъем гантелей на бицепс сидя',
        group: 'biceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '79',
        name: 'Подъем гантелей на бицепс с супинацией',
        group: 'biceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '84',
        name: 'Подъем гантелей на бицепс лежа на наклонной скамье',
        group: 'biceps',
        isHidden: false,
        isProtected: false,
    },
] as const;

const TRICEPS = [
    { id: '87', name: 'Французский жим штанги лежа', group: 'triceps', isHidden: false, isProtected: false },
    {
        id: '89',
        name: 'Разгибание рук с гантелью из-за головы',
        group: 'triceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '90',
        name: 'Разгибание рук в кроссовере с канатной рукоятью',
        group: 'triceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '91',
        name: 'Разгибание рук с верхнего блока',
        group: 'triceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '92',
        name: 'Отжимания на трицепс от скамьи',
        group: 'triceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '93',
        name: 'Разгибание рук с гантелями в наклоне',
        group: 'triceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '94',
        name: 'Жим узким хватом в тренажере Смита',
        group: 'triceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '98',
        name: 'Отжимания от пола с узкой постановкой рук',
        group: 'triceps',
        isHidden: false,
        isProtected: false,
    },
    { id: '100', name: 'Разгибание рук в тренажере', group: 'triceps', isHidden: false, isProtected: false },
    {
        id: '105',
        name: 'Отжимания на брусьях с акцентом на трицепс',
        group: 'triceps',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '106',
        name: 'Разгибание одной руки с верхнего блока',
        group: 'triceps',
        isHidden: false,
        isProtected: false,
    },
] as const;

const SHOULDERS = [
    {
        id: '108',
        name: 'Подъем гантелей через стороны',
        group: 'shoulders',
        isHidden: false,
        isProtected: false,
    },
    {
        id: '109',
        name: 'Подъем гантелей перед собой',
        group: 'shoulders',
        isHidden: false,
        isProtected: false,
    },
    { id: '111', name: 'Жим гантелей сидя', group: 'shoulders', isHidden: false, isProtected: false },
    { id: '113', name: 'Подъем штанги перед собой', group: 'shoulders', isHidden: false, isProtected: false },
    { id: '114', name: 'Тяга штанги к подбородку', group: 'shoulders', isHidden: false, isProtected: false },
    { id: '115', name: 'Махи гантелями в наклоне', group: 'shoulders', isHidden: false, isProtected: false },
    { id: '116', name: 'Жим в тренажере сидя', group: 'shoulders', isHidden: false, isProtected: false },
    { id: '118', name: 'Подъем блока перед собой', group: 'shoulders', isHidden: false, isProtected: false },
    { id: '119', name: 'Жим штанги из-за головы', group: 'shoulders', isHidden: false, isProtected: false },
    { id: '121', name: 'Жим гантелей стоя', group: 'shoulders', isHidden: false, isProtected: false },
    { id: '122', name: 'Армейский жим', group: 'shoulders', isHidden: false, isProtected: false },
] as const;

export const BASE_EXERCISES: Exercise[] = [...BACK, ...LEGS, ...CHEST, ...BICEPS, ...TRICEPS, ...SHOULDERS];

export const MUSCLE_GROUP_TABS = [
    { value: 'all', label: 'Все' },
    { value: 'chest', label: 'Грудь' },
    { value: 'back', label: 'Спина' },
    { value: 'legs', label: 'Ноги' },
    { value: 'biceps', label: 'Бицепс' },
    { value: 'triceps', label: 'Трицепс' },
    { value: 'shoulders', label: 'Плечи' },
] as const;

export const DEFAULT_WHEEL_SETTINGS = {
    duration: 10,
    turnoverRange: [10, 20] as [number, number],
};
