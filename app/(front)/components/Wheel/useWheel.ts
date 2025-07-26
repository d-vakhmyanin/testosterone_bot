import React from 'react';

import { WheelProps } from './Wheel';
import { BLACK, COLORS, DEFAULT_SEGMENTS, LINE_WIDTH, WHITE } from './constants';
import { wheelInitialState, wheelReducer } from './wheelReducer';

const getCurrentSegment = (
    rotation: number,
    segmentAngle: number,
    segments: Required<WheelProps>['segments']
) => {
    const normalizedRotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const markerAngle = ((3 * Math.PI) / 2 - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);
    const segmentIndex = Math.floor(markerAngle / segmentAngle) % segments.length;

    return segments[segmentIndex];
};

export const useWheel = ({ segments = DEFAULT_SEGMENTS, duration = 10000, onSpinFinish }: WheelProps) => {
    const segmentAngle = React.useMemo(() => (2 * Math.PI) / segments.length, [segments.length]);

    const [state, dispatch] = React.useReducer(wheelReducer, {
        ...wheelInitialState,
        curentSegment: getCurrentSegment(0, segmentAngle, segments),
    });

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const animationRef = React.useRef<number>(-1);
    const rotationRef = React.useRef<number>(0);

    const drawWheel = React.useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            return;
        }

        const style = window.getComputedStyle(canvas);
        const width = parseInt(style.width);
        const height = parseInt(style.height);

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 10;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(state.rotation);
        ctx.translate(-centerX, -centerY);

        segments.forEach((segment, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            const middleAngle = (startAngle + endAngle) / 2;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = COLORS[i % COLORS.length];
            ctx.fill();

            ctx.strokeStyle = WHITE;
            ctx.lineWidth = LINE_WIDTH;
            ctx.stroke();

            const textPadding = 10;
            const maxTextWidth = 2 * Math.sin(segmentAngle / 2) * (radius - textPadding);
            const textRadius = radius * 0.5;

            let fontSize = 14;
            let textFits = false;
            let textMetrics;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';

            do {
                ctx.font = `${fontSize}px Arial`;
                textMetrics = ctx.measureText(segment.name);

                if (textMetrics.width <= maxTextWidth || fontSize <= 8) {
                    textFits = true;
                } else {
                    fontSize -= 1;
                }
            } while (!textFits && fontSize > 8);

            const textX = centerX + Math.cos(middleAngle) * textRadius;
            const textY = centerY + Math.sin(middleAngle) * textRadius;

            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(middleAngle);

            if (!textFits || segment.name.length > 12) {
                const words = segment.name.split(' ');
                let line1 = '',
                    line2 = '';

                for (const word of words) {
                    if (ctx.measureText(line1 + word).width <= maxTextWidth) {
                        line1 += (line1 ? ' ' : '') + word;
                    } else {
                        line2 += (line2 ? ' ' : '') + word;
                    }
                }

                if (!line2 && textMetrics.width > maxTextWidth) {
                    fontSize = Math.max(8, fontSize - 2);
                    ctx.font = `${fontSize}px Arial`;
                }

                if (line2) {
                    ctx.fillText(line1, 0, -fontSize / 2);
                    ctx.fillText(line2, 0, fontSize / 2);
                } else {
                    ctx.fillText(line1, 0, 0);
                }
            } else {
                ctx.fillText(segment.name, 0, 0);
            }
            ctx.restore();
        });

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.01, 0, 2 * Math.PI);
        ctx.fillStyle = WHITE;
        ctx.fill();
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = LINE_WIDTH;
        ctx.stroke();

        ctx.restore();

        const markerSize = 15;
        const markerTop = centerY - radius - 5;

        ctx.fillStyle = WHITE;
        ctx.beginPath();
        ctx.moveTo(centerX - markerSize / 2, markerTop);
        ctx.lineTo(centerX + markerSize / 2, markerTop);
        ctx.lineTo(centerX, markerTop + markerSize);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = BLACK;
        ctx.lineWidth = LINE_WIDTH;
        ctx.stroke();

        rotationRef.current = state.rotation;

        dispatch({
            type: 'SET_SEGMENT',
            payload: getCurrentSegment(state.rotation, segmentAngle, segments),
        });
    }, [state.rotation, segments, segmentAngle]);

    React.useEffect(() => {
        dispatch({ type: 'SET_MOUNTED', payload: true });
        animationRef.current = requestAnimationFrame(drawWheel);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (state.rotation !== rotationRef.current) {
        drawWheel();
    }

    const handleSpinClick = React.useCallback(() => {
        if (state.isSpinning) {
            return;
        }

        dispatch({ type: 'START_SPINNING' });

        const startTime = Date.now();
        const spins = 10 + Math.random() * 10;
        const startRotation = rotationRef.current;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeInOut =
                progress < 0.5 ? 2 * Math.pow(progress, 2) : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            const totalRotation = startRotation + spins * 2 * Math.PI * easeInOut;
            dispatch({ type: 'SET_ROTATION', payload: totalRotation });

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                dispatch({
                    type: 'FINISH_SPINNING',
                    payload: {
                        cb: onSpinFinish,
                    },
                });
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [duration, onSpinFinish, state.isSpinning]);

    return {
        ...state,
        canvasRef,
        handleSpinClick,
    };
};
