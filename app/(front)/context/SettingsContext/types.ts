export type MuscleGroup = 'all' | 'chest' | 'back' | 'legs' | 'biceps' | 'triceps' | 'shoulders';

export type Exercise = {
    id: string;
    name: string;
    group: MuscleGroup;
    isHidden: boolean;
    isProtected?: boolean;
};

export type WheelSettings = {
    duration: number;
    turnoverRange: [number, number];
};
