import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import * as routes from '@/app/(front)/utils/routes';

const validRoutes: string[] = Object.values(routes)
    .map((el) => Object.values(el))
    .flat();

const isValidRoute = (pathname: string) => {
    // public
    if (pathname === '/robots.txt' || pathname.startsWith('/teams/image_team_')) {
        return true;
    }

    return validRoutes.includes(pathname);
};

export const middleware = (request: NextRequest) => {
    if (!isValidRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL(routes.hockeyRoutes.home, request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
