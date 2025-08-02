export type MuscleGroup = 'all' | 'chest' | 'back' | 'legs' | 'biceps' | 'triceps' | 'shoulders';

export type Exercise = {
    id: string;
    name: string;
    group: MuscleGroup;
    isHidden: boolean;
    isProtected?: boolean;
};
