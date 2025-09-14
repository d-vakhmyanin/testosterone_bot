import React from 'react';
import { getMatches } from '@/app/utils/requests/getMatches';

import { MatchesProvider } from '../../context';

export const dynamic = 'force-dynamic';

const HockeyLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
    const data = await getMatches({ type: 'now' });

    return <MatchesProvider initialData={data}>{children}</MatchesProvider>;
};

export default HockeyLayout;
