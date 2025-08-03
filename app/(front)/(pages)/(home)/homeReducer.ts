import { Exercise } from '../../context';

type State = {
    isModalOpen: boolean;
    isSaved: boolean;
    isLoading: boolean;
    exercise?: Exercise;
};

type Action =
    | { type: 'OPEN_MODAL'; exercise: Exercise }
    | { type: 'CLOSE_MODAL' }
    | { type: 'SAVE_START' }
    | { type: 'SAVE_FINISH' }
    | { type: 'SAVE_SUCCESS' };

export const homeInitialState: State = {
    isModalOpen: false,
    isSaved: false,
    isLoading: false,
    exercise: undefined,
};

export const homeReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'OPEN_MODAL':
            return {
                ...state,
                isModalOpen: true,
                exercise: action.exercise,
                isLoading: false,
                isSaved: false,
            };
        case 'CLOSE_MODAL':
            return {
                ...state,
                isModalOpen: false,
            };
        case 'SAVE_START':
            return {
                ...state,
                isLoading: true,
            };
        case 'SAVE_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isSaved: true,
            };
        case 'SAVE_FINISH':
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};
