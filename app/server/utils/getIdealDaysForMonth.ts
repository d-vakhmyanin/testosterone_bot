import { TRAINING_CONFIG } from '../config';

/**
 * Возвращает все "правильные" дни для тренировок в указанном месяце
 * @param {number} month - Месяц (0-11, где 0 - январь)
 * @param {number} [year] - Год (текущий по умолчанию)
 * @returns {number[]} Массив дней (дней-месяца) с "правильными" днями недели
 */
export const getIdealDaysForMonth = (month: number, year?: number): number[] => {
    const currentYear = year || new Date().getFullYear();
    const result: number[] = [];

    if (currentYear < 0 || month < 0 || month > 11) {
        return result;
    }

    // Создаем дату 1 числа указанного месяца
    const date = new Date(currentYear, month, 1);

    // Перебираем все дни месяца
    while (date.getMonth() === month) {
        const dayOfWeek = date.getDay(); // 0-6

        // Проверяем, является ли день "правильным"
        if (TRAINING_CONFIG.idealDaysOfWeek.includes(dayOfWeek)) {
            result.push(date.getDate()); // Добавляем копию даты
        }

        // Переходим к следующему дню
        date.setDate(date.getDate() + 1);
    }

    return result;
};
