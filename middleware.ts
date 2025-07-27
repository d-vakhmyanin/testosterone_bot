import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const validRoutes = ['/', '/api', '/api/web-app-data'];

const isValidRoute = (pathname: string) => {
    return validRoutes.includes(pathname);
};

export const middleware = (request: NextRequest) => {
    if (!isValidRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
