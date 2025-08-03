import { BASE_EXERCISES, DEFAULT_WHEEL_SETTINGS } from './contants';
import { Exercise, MuscleGroup, WheelSettings } from './types';

export type SettingsState = {
    exercises: Exercise[];
    activeTab: MuscleGroup;
    wheelSettings: WheelSettings;
};

type SettingsAction =
    | { type: 'SET_EXERCISES'; payload: Exercise[] }
    | { type: 'SET_ACTIVE_TAB'; payload: MuscleGroup }
    | { type: 'ADD_EXERCISE'; payload: Exercise }
    | { type: 'REMOVE_EXERCISE'; payload: string }
    | { type: 'TOGGLE_EXERCISE_VISIBILITY'; payload: string }
    | { type: 'SET_WHEEL_DURATION'; payload: number }
    | { type: 'SET_WHEEL_RANGE'; payload: SettingsState['wheelSettings']['turnoverRange'] }
    | { type: 'RESTORE_DEFAULTS' }
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
        case 'SET_WHEEL_DURATION':
            return {
                ...state,
                wheelSettings: {
                    ...state.wheelSettings,
                    duration: action.payload,
                },
            };
        case 'SET_WHEEL_RANGE':
            return {
                ...state,
                wheelSettings: {
                    ...state.wheelSettings,
                    turnoverRange: action.payload,
                },
            };
        case 'RESTORE_DEFAULTS':
            return {
                exercises: BASE_EXERCISES,
                activeTab: 'all',
                wheelSettings: DEFAULT_WHEEL_SETTINGS,
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
