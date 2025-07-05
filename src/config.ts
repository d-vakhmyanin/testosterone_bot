const TRAINING_TIER = [
    'PERFECT',
    'GOOD_DAY_BAD_TIME',
    'BAD_DAY',
    'SKIP',
] as const;

type TrainingTierType = (typeof TRAINING_TIER)[number];

type Rule = Record<TrainingTierType, { score: number; desc: string }>;

type TrainingConfig = {
    idealDaysOfWeek: number[]; // 0-воскресенье, 1-понедельник и т.д.
    rules: Rule;
};

export const TRAINING_CONFIG: TrainingConfig = {
    // Идеальные дни недели, тренировки в эти дни в нужное время оцениваются максимально
    idealDaysOfWeek: [1, 3, 5], // Пн, Ср, Пт
    // Конфиг начисления баллов
    rules: {
        PERFECT: {
            score: +1.0,
            desc: 'Дни недели из idealDaysOfWeek',
        },
        GOOD_DAY_BAD_TIME: {
            score: +0.6, // Не штраф, но и не полный балл
            desc: 'День из idealDaysOfWeek, но время неправильное',
        },
        BAD_DAY: {
            score: +0.2, // Чисто символически
            desc: 'Любой другой день, не из idealDaysOfWeek',
        },
        SKIP: {
            score: -0.5, // Штраф ТОЛЬКО за пропуск
            desc: 'Пропуск дня из idealDaysOfWeek',
        },
    },
};
