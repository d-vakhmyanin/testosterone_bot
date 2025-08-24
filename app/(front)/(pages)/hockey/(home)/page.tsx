import React from 'react';
import Image from 'next/image';

import { TEAMS } from '@/app/utils/hockey/teams';

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

const List = ({ data }: { data: typeof TEAMS }) => {
    return (
        <>
            {data.map((el) => (
                <div
                    key={el.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}
                >
                    <Image
                        width={48}
                        height={48}
                        alt={el.name}
                        src={`/teams/image_team_${el.id}.png`}
                        loading="eager"
                    />
                    <p>{el.name}</p>
                    <p>{el.city}</p>
                </div>
            ))}
        </>
    );
};

const Home: React.FC = () => {
    return (
        <div>
            <h1>hockey</h1>
            <div style={{ height: '80vh', overflowY: 'auto' }}>
                <div style={{ columns: 2 }}>
                    <div style={{ marginRight: '32px' }}>
                        <h2>east</h2>
                        <List data={east} />
                    </div>
                    <div>
                        <h2>west</h2>
                        <List data={west} />
                    </div>
                </div>
                <div style={{ height: '64px' }} />
            </div>
        </div>
    );
};

export default Home;
