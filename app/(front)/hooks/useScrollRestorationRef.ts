'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export const useScrollRestorationRef = <T extends HTMLElement>() => {
    const ref = React.useRef<T>(null);
    const pathname = usePathname();

    React.useLayoutEffect(() => {
        const container = ref.current;
        if (!container || typeof window === 'undefined') {
            return;
        }

        const searchParams = new URLSearchParams(window.location.search);

        const key = `${pathname}?${searchParams.toString()}`;
        const savedScrollTop = sessionStorage.getItem(`scroll-${key}`);

        if (savedScrollTop) {
            container.scrollTop = parseInt(savedScrollTop);
        }

        let timeoutId: ReturnType<typeof setTimeout>;

        const saveScrollPosition = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                sessionStorage.setItem(`scroll-${key}`, container.scrollTop.toString());
            }, 0);
        };

        container.addEventListener('scroll', saveScrollPosition);

        return () => {
            clearTimeout(timeoutId);
            container.removeEventListener('scroll', saveScrollPosition);
        };
    }, [pathname]);

    return {
        ref,
    };
};
