import React from 'react';

import { WheelProps } from './Wheel';

const COLORS = [
    '#FF5F5D',
    '#00B4D8',
    '#A0E7E5',
    '#5F4B8B',
    '#FFBD00',
    '#FF5400',
    '#00C16E',
    '#785EF0',
    '#FF3366',
    '#20C0E0',
    '#7ED957',
    '#A45DE2',
    '#FF9E00',
    '#FF2E63',
    '#00D1A0',
    '#C86FC9',
    '#FF6B6B',
    '#48CAE4',
    '#52B788',
    '#6A4C93',
    '#FFD166',
    '#FF7B54',
    '#06D6A0',
    '#9D4EDD',
    '#FF8A5B',
    '#2EC4B6',
    '#E71D36',
    '#5F0F40',
    '#FFBC42',
    '#D81159',
    '#218380',
    '#9B5DE5',
    '#FF6D6A',
    '#00BBF9',
    '#84DCC6',
    '#7209B7',
    '#FF9F1C',
    '#FF4D6D',
    '#00A896',
    '#B5179E',
];

const WHITE = '#ffffff';
const BLACK = '#000000';
const LINE_WIDTH = 1;
const TOTAL_SPINS = 10;

export const useWheel = ({ segments = 50, duration = 10000 }: WheelProps) => {
    const [rotation, setRotation] = React.useState(0);
    const [isSpinning, setIsSpinning] = React.useState(false);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const animationRef = React.useRef<number>(-1);

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
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);

        const segmentAngle = (2 * Math.PI) / segments;
        for (let i = 0; i < segments; i++) {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = COLORS[i % COLORS.length];
            ctx.fill();

            ctx.strokeStyle = WHITE;
            ctx.lineWidth = LINE_WIDTH;
            ctx.stroke();
        }

        // центральный кружок
        ctx.beginPath();
        // 5% от радиуса колеса
        ctx.arc(centerX, centerY, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = WHITE;
        ctx.fill();
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = LINE_WIDTH;
        ctx.stroke();

        ctx.restore();
    }, [rotation, segments]);

    React.useEffect(() => {
        drawWheel();
    }, [drawWheel]);

    React.useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const handleSpinClick = React.useCallback(() => {
        setIsSpinning((prev) => {
            if (prev) {
                return prev;
            }

            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // EaseInOut - плавное ускорение и замедление
                const easeInOut =
                    progress < 0.5
                        ? 2 * Math.pow(progress, 2) // Ускорение (первая половина)
                        : 1 - Math.pow(-2 * progress + 2, 2) / 2; // Замедление (вторая половина)

                const totalRotation = TOTAL_SPINS * 2 * Math.PI * easeInOut;

                setRotation(totalRotation);

                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    setIsSpinning(false);
                }
            };

            animationRef.current = requestAnimationFrame(animate);

            return !prev;
        });
    }, [duration]);

    return {
        isSpinning,
        canvasRef,
        handleSpinClick,
    };
};
