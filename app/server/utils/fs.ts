import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { ChatData } from '../types';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getPaths = (chatId: number) => {
    const fileName = `chat_${chatId}.json`;
    const dirPath = path.join(__dirname, '../', 'data');
    const filePath = path.join(dirPath, fileName);

    return { dirPath, filePath };
};

// Функция для загрузки данных чата
export const loadChatData = (chatId: number): ChatData => {
    const { filePath } = getPaths(chatId);

    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
    }

    return { participants: [] };
};

// Функция для сохранения данных чата
export const saveChatData = (chatId: number, data: ChatData) => {
    const { dirPath, filePath } = getPaths(chatId);

    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
};
