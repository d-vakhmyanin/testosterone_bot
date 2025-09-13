import React from 'react';
import { updateMatches } from '@/app/api/get-matches/updateMatches';

import { Home } from './home';

const Page: React.FC = async () => {
    await updateMatches();

    return <Home />;
};

export default Page;
