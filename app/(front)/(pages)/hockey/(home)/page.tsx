import React from 'react';

import { TEAMS } from '@/app/utils/hockey/teams';
import { MATCHES } from '@/app/utils/hockey/matches';
import { MatchesList } from '@/app/(front)/components/MatchesList/MatchesList';

const east: typeof TEAMS = [];
const west: typeof TEAMS = [];

TEAMS.forEach((el) => {
    if (el.conference === 'east') {
        east.push(el);
    }

    if (el.conference === 'west') {
        west.push(el);
    }
});

const Home: React.FC = () => {
    return <MatchesList data={MATCHES.slice(0, 20)} />;
};

export default Home;
