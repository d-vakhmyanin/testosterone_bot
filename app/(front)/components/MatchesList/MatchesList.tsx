'use client';
import React from 'react';

import { Match as MatchT } from '@/app/utils/hockey/matches';

import { useScrollRestorationRef } from '../../hooks/useScrollRestorationRef';

import styles from './MatchesList.module.css';
import { renderData } from './renderData';
import { Sentinel } from './Sentinel';
import { FiltersModal } from './FiltersModal/FiltersModal';

export type MatchesListProps = {
    data: MatchT[];
    hasMoreTop: boolean;
    hasMoreBottom: boolean;
    isLoading: boolean;
    loadMoreTop(): void;
    loadMoreBottom(): void;
};

export const MatchesList: React.FC<MatchesListProps> = ({
    data,
    hasMoreTop,
    hasMoreBottom,
    isLoading,
    loadMoreTop,
    loadMoreBottom,
}) => {
    const { ref: containerRef } = useScrollRestorationRef<HTMLDivElement>();
    const prevScroll = React.useRef<number>(null);
    const topSentinelRef = React.useRef(null);
    const bottomSentinelRef = React.useRef(null);

    const stateRef = React.useRef({ hasMoreTop, hasMoreBottom, loadMoreTop, loadMoreBottom });
    stateRef.current = { hasMoreTop, hasMoreBottom, loadMoreTop, loadMoreBottom };

    const observerRef = React.useRef<IntersectionObserver | null>(null);

    React.useLayoutEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const { hasMoreTop, hasMoreBottom, loadMoreTop, loadMoreBottom } = stateRef.current;

                    if (entry.target === topSentinelRef.current && hasMoreTop) {
                        loadMoreTop();

                        if (containerRef.current) {
                            prevScroll.current =
                                containerRef.current.scrollHeight - containerRef.current.scrollTop;
                        }
                    } else if (entry.target === bottomSentinelRef.current && hasMoreBottom) {
                        loadMoreBottom();
                        prevScroll.current = 0;
                    }
                });
            },
            { rootMargin: '200px', threshold: 0.1 }
        );

        observerRef.current = observer;

        return () => {
            observer.disconnect();
            observerRef.current = null;
        };
    }, [containerRef]);

    React.useLayoutEffect(() => {
        const observer = observerRef.current;

        if (!observer) {
            return;
        }

        const top = topSentinelRef.current;
        const bottom = bottomSentinelRef.current;

        if (top && hasMoreTop) {
            observer.observe(top);
        }

        if (bottom && hasMoreBottom) {
            observer.observe(bottom);
        }

        return () => {
            if (top) {
                observer.unobserve(top);
            }

            if (bottom) {
                observer.unobserve(bottom);
            }
        };
    }, [hasMoreTop, hasMoreBottom]);

    // сохранение скролла при подгрузке сверху
    React.useLayoutEffect(() => {
        requestAnimationFrame(() => {
            if (!prevScroll.current || !containerRef.current) {
                return;
            }
            containerRef.current.scrollTop = containerRef.current.scrollHeight - prevScroll.current;
        });
    }, [data, containerRef]);

    return (
        <div className={styles.listContainer} ref={containerRef}>
            <FiltersModal />
            {hasMoreTop && <Sentinel isHidden={!isLoading} ref={topSentinelRef} />}
            {renderData(data)}
            {hasMoreBottom && <Sentinel isHidden={!isLoading} ref={bottomSentinelRef} />}
        </div>
    );
};
