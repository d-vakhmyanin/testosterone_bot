'use client';

import React from 'react';

import styles from './Modal.module.css';
import { useModal } from './useModal';

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    showCloseButton?: boolean;
    overlayClassName?: string;
    modalClassName?: string;
    withConfetti?: boolean;
};

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = (props) => {
    const {
        title,
        isOpen,
        onClose,
        children,
        overlayClassName = '',
        modalClassName = '',
        showCloseButton = true,
        withConfetti = true,
    } = props;

    const { modalRef, confettiParticles, handleOverlayClick } = useModal(props);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={`${styles.overlay} ${overlayClassName}`} onClick={handleOverlayClick}>
            {withConfetti && (
                <div className={styles.confettiContainer}>
                    {confettiParticles.map((particle) => (
                        <div
                            key={particle.id}
                            className={styles.confetti}
                            data-shape={particle.shape}
                            style={{
                                left: `${particle.x * 100}%`,
                                top: `${particle.y * 100}%`,
                                backgroundColor: particle.color,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                opacity: particle.life / 100,
                                transform: `rotate(${particle.angle * 2}rad)`,
                            }}
                        />
                    ))}
                </div>
            )}
            <div ref={modalRef} className={`${styles.modal} ${modalClassName}`}>
                {(title || showCloseButton) && (
                    <div className={styles.header}>
                        {title && <h3 className={styles.title}>{title}</h3>}
                        {showCloseButton && (
                            <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M18 6L6 18M6 6L18 18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};
