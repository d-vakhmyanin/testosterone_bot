import { Segment } from './Wheel';

type WheelState = {
    isMounted: boolean;
    rotation: number;
    isSpinning: boolean;
    curentSegment?: Segment;
};

type WheelAction =
    | { type: 'SET_MOUNTED'; payload: boolean }
    | { type: 'SET_ROTATION'; payload: number }
    | { type: 'START_SPINNING' }
    | { type: 'SET_SEGMENT'; payload: Segment }
    | { type: 'FINISH_SPINNING'; payload: { cb: (result: Segment) => void } };

export const wheelInitialState: WheelState = {
    rotation: 0,
    isMounted: false,
    isSpinning: false,
};

export const wheelReducer = (state: WheelState, action: WheelAction): WheelState => {
    switch (action.type) {
        case 'SET_MOUNTED':
            return { ...state, isMounted: action.payload };
        case 'SET_ROTATION':
            return { ...state, rotation: action.payload };
        case 'START_SPINNING':
            return { ...state, isSpinning: true };
        case 'SET_SEGMENT':
            return { ...state, curentSegment: action.payload };
        case 'FINISH_SPINNING': {
            if (state.curentSegment) {
                action.payload.cb(state.curentSegment);
            }

            return { ...state, isSpinning: false };
        }
        default:
            return state;
    }
};
