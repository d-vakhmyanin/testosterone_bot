export const COMMAND_LIST = [
    'start',
    'register',
    'unregister',
    'list',
    'gym',
    'stats',
    'shame',
    'details',
    'help',
    'shame_details',
] as const;

export type Command = (typeof COMMAND_LIST)[number];

export const COMMANDS = COMMAND_LIST.reduce<{
    [K in Command]: K;
}>((acc, cur) => ({ ...acc, [cur]: cur }), {} as any);
