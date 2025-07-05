export const getRandom = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];
