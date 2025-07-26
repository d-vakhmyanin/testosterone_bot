import React from 'react';

import { ModalProps } from './Modal';
import { CONFETTI_COLORS } from './constants';

type ConfettiParticle = {
    id: number;
    x: number;
    y: number;
    angle: number;
    velocity: number;
    color: string;
    size: number;
    life: number;
    shape: string;
};

export const useModal = ({ isOpen, onClose, withConfetti = true }: ModalProps) => {
    const [confettiParticles, setConfettiParticles] = React.useState<ConfettiParticle[]>([]);
    const modalRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!isOpen || !withConfetti) {
            return;
        }

        const particles = Array.from({ length: 150 }, (_, i) => ({
            id: i,
            x: 0.4 + Math.random() * 0.2, // случайная позиция по X в центре
            y: 0.4 + Math.random() * 0.2, // случайная позиция по Y в центре
            angle: Math.random() * Math.PI * 2, // случайный угол
            velocity: 1 + Math.random() * 4, // разная скорость
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            size: 3 + Math.random() * 7, // разный размер
            life: 80 + Math.random() * 70, // разное время жизни
            shape: Math.random() > 0.5 ? 'rect' : 'circle', // разные формы
            rotationSpeed: (Math.random() - 0.5) * 0.2, // скорость вращения
        }));

        setConfettiParticles(particles);

        const interval = setInterval(() => {
            setConfettiParticles((prev) =>
                prev
                    .map((p) => ({
                        ...p,
                        x: p.x + Math.cos(p.angle) * (0.01 + Math.random() * 0.03),
                        y: p.y + Math.sin(p.angle) * (0.01 + Math.random() * 0.03) + 0.02,
                        life: p.life - 1,
                        size: p.size * 0.98,
                        angle: p.angle + (Math.random() - 0.5) * 0.1, // меняем угол для хаотичности
                    }))
                    .filter((p) => p.life > 0)
            );
        }, 30);

        return () => {
            clearInterval(interval);
        };
    }, [isOpen, withConfetti]);

    // Обработка нажатия ESC
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Блокируем скролл фона при открытии модалки
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Закрытие по клику вне модалки
    const handleOverlayClick = React.useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        },
        [onClose]
    );

    return {
        modalRef,
        confettiParticles,
        handleOverlayClick,
    };
};
