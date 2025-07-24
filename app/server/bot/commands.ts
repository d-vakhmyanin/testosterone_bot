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
type Commands = {
    [K in Command]: K;
};

export const COMMANDS = COMMAND_LIST.reduce<Commands>((acc, cur) => ({ ...acc, [cur]: cur }), {} as Commands);
