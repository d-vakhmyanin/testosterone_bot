import React from 'react';

import { MatchesProvider } from '../../context';
import { getMatches } from '@/app/utils/requests/getMatches';

const HockeyLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
    const data = await getMatches({ type: 'now' });

    return <MatchesProvider initialData={data}>{children}</MatchesProvider>;
};

export default HockeyLayout;
