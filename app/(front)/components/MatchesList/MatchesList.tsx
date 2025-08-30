'use client';
import React from 'react';

import { Match as MatchT } from '@/app/utils/hockey/matches';

import { useScrollRestorationRef } from '../../hooks/useScrollRestorationRef';

import styles from './MatchesList.module.css';
import { renderData } from './renderData';
import { Sentinel } from './Sentinel';

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

    React.useLayoutEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    if (entry.target === topSentinelRef.current && hasMoreTop) {
                        if (prevScroll.current !== null) {
                            loadMoreTop();
                        }

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
            {
                rootMargin: '200px',
                threshold: 0.1,
            }
        );

        if (topSentinelRef.current) {
            observer.observe(topSentinelRef.current);
        }

        if (bottomSentinelRef.current) {
            observer.observe(bottomSentinelRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [containerRef, hasMoreTop, hasMoreBottom, loadMoreTop, loadMoreBottom]);

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
            {hasMoreTop && <Sentinel isHidden={!isLoading} ref={topSentinelRef} />}
            {renderData(data)}
            {hasMoreBottom && <Sentinel isHidden={!isLoading} ref={bottomSentinelRef} />}
        </div>
    );
};
