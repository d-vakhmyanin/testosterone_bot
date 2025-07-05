const commandList = ['start', 'gym', 'stats', 'shame'] as const;

type Command = (typeof commandList)[number];

export const COMMANDS = commandList.reduce<{
    [K in Command]: K;
}>((acc, cur) => ({ ...acc, [cur]: cur }), {} as any);
