const commandList = ['start', 'gym', 'stats', 'shame'];
export const COMMANDS = commandList.reduce((acc, cur) => ({ ...acc, [cur]: cur }), {});
