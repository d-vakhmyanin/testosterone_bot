import { useState } from 'react';
import { MatchDetails } from '@/app/utils/hockey/matches';
import { Team } from '@/app/utils/hockey/teams';

import styles from './DetailsTabs.module.css';

import { Bet as BetFC } from '../Bet/Bet';
import { Events } from './TabsContent/Events/Events';
import { Stats } from './TabsContent/Stats/Stats';
import { Players } from './TabsContent/Players/Players';

type Tab = {
    type: string;
    label: (props: DetailsTabsProps) => string;
    condition: (props: DetailsTabsProps) => boolean;
    renderContent: (props: DetailsTabsProps) => React.ReactNode;
};

const TABS: Tab[] = [
    {
        type: 'events',
        label: () => 'Ход матча',
        condition: ({ details }) => !!details?.events.length,
        renderContent: ({ details }) => <Events data={details?.events || []} />,
    },
    {
        type: 'stats',
        label: () => 'Статистика',
        condition: ({ details }) => !!details?.stats.length,
        renderContent: ({ details }) => <Stats data={details!.stats} />,
    },
    {
        type: 'home_team',
        label: ({ homeTeam }) => homeTeam.name,
        condition: ({ details }) => !!details?.players?.homeTeam.length,
        renderContent: ({ details }) => <Players data={details!.players!.homeTeam} />,
    },
    {
        type: 'guest_team',
        label: ({ guestTeam }) => guestTeam.name,
        condition: ({ details }) => !!details?.players?.guestTeam.length,
        renderContent: ({ details }) => <Players data={details!.players!.guestTeam} />,
    },
    {
        type: 'bet',
        label: () => 'Ставка',
        condition: ({ bet }) => !!bet,
        renderContent: ({ bet }) => <BetFC {...bet!} />,
    },
];

type DetailsTabsProps = {
    homeTeam: Team;
    guestTeam: Team;
    details?: MatchDetails;
    bet?: React.ComponentProps<typeof BetFC>;
};

export const DetailsTabs: React.FC<DetailsTabsProps> = (props) => {
    const [activeTab, setActiveTab] = useState('events');

    return (
        <div className={styles.container}>
            <div className={styles.tabs_container}>
                {TABS.map(({ type, label, condition }) => {
                    if (!condition(props)) {
                        return null;
                    }

                    return (
                        <button
                            key={type}
                            className={`${styles.tab} ${type === activeTab ? styles.active : ''}`}
                            onClick={(ev) => {
                                const container = ev.currentTarget.parentElement;
                                const tab = ev.currentTarget;

                                if (container) {
                                    container.scrollTo({
                                        left: tab.offsetLeft - (container.clientWidth - tab.clientWidth) / 2,
                                        behavior: 'smooth',
                                    });
                                }

                                setActiveTab(type);
                            }}
                        >
                            {label(props)}
                        </button>
                    );
                })}
            </div>
            <div>{TABS.find((t) => t.type === activeTab)?.renderContent(props)}</div>
        </div>
    );
};
