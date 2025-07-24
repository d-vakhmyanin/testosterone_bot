import { User } from 'telegraf/types';

import { getUsername } from './getUsername';

import { TRAINING_CONFIG } from '../config';
import { UserTrainsData } from '../types';

type UserDataStat = {
    name: string;
    userId: number;
    perfectCount: number;
    goodCount: number;
    extraCount: number;
    missedCount: number;
    totalScore: number;
};

export const getUserDataStat = (
    idealDays: number[],
    user: User,
    userTrainsData: UserTrainsData = {}
): UserDataStat => {
    let perfectCount = 0;
    let goodCount = 0;
    let extraCount = 0;
    let missedCount = 0;

    Object.keys(userTrainsData).forEach((day) => {
        if (!idealDays.includes(Number(day))) {
            extraCount++;
        }
    });

    idealDays.forEach((day) => {
        const idealDayTrainingData = userTrainsData[day];

        if (!idealDayTrainingData) {
            missedCount++;
        } else if (idealDayTrainingData.is_right_time) {
            perfectCount++;
        } else {
            goodCount++;
        }
    });

    return {
        name: getUsername(user),
        userId: user.id,
        perfectCount,
        goodCount,
        extraCount,
        missedCount,
        totalScore:
            perfectCount * TRAINING_CONFIG.rules.PERFECT.score +
            goodCount * TRAINING_CONFIG.rules.GOOD_DAY_BAD_TIME.score +
            extraCount * TRAINING_CONFIG.rules.BAD_DAY.score +
            missedCount * TRAINING_CONFIG.rules.SKIP.score,
    };
};
