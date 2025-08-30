export const wheelRoutes = {
    home: '/wheel',
    exercises: '/wheel/exercises',
    settings: '/wheel/settings',
} as const;

export const hockeyRoutes = {
    home: '/hockey',
    match: (id: string) => `/hockey/match/${id}`,
} as const;

export const apiRoutes = {
    webhook: '/api',
    sendWheelMessage: '/api/send-wheel-message',
    getMatches: '/api/get-matches',
} as const;
