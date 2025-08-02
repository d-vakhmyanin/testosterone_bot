import { Exercise, MuscleGroup } from './types';

export type SettingsState = {
    exercises: Exercise[];
    activeTab: MuscleGroup;
};

type SettingsAction =
    | { type: 'SET_EXERCISES'; payload: Exercise[] }
    | { type: 'SET_ACTIVE_TAB'; payload: MuscleGroup }
    | { type: 'ADD_EXERCISE'; payload: Exercise }
    | { type: 'REMOVE_EXERCISE'; payload: string }
    | { type: 'TOGGLE_EXERCISE_VISIBILITY'; payload: string }
    | { type: 'SET_FULL_STATE'; payload: SettingsState };

export const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
    switch (action.type) {
        case 'SET_EXERCISES':
            return { ...state, exercises: action.payload };
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };
        case 'ADD_EXERCISE':
            return { ...state, exercises: [action.payload, ...state.exercises] };
        case 'REMOVE_EXERCISE':
            return { ...state, exercises: state.exercises.filter((ex) => ex.id !== action.payload) };
        case 'TOGGLE_EXERCISE_VISIBILITY':
            return {
                ...state,
                exercises: state.exercises.map((ex) =>
                    ex.id === action.payload ? { ...ex, isHidden: !ex.isHidden } : ex
                ),
            };
        case 'SET_FULL_STATE':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};
