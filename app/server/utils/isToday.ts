export const isToday = (d: Date | number) => {
    const date = new Date(d);
    const today = new Date();

    return (
        today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
    );
};
