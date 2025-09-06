import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Match } from '@/app/utils/hockey/matches';

import { BetsData, ChatData } from '../types';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getPaths = (fileName: string) => {
    const dirPath = path.join(__dirname, '../', 'data');
    const filePath = path.join(dirPath, fileName);

    return { dirPath, filePath };
};

const loadData = (filePath: string): string => {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf-8');
        }
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
    }

    return '{}';
};

const saveData = (filePath: string, dirPath: string, data: string) => {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, data);
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
};

// Функция для загрузки данных чата
export const loadChatData = (chatId: number): ChatData => {
    const { filePath } = getPaths(`chat_${chatId}.json`);

    try {
        return JSON.parse(loadData(filePath));
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
    }

    return { participants: [] };
};

// Функция для сохранения данных чата
export const saveChatData = (chatId: number, data: ChatData) => {
    const { dirPath, filePath } = getPaths(`chat_${chatId}.json`);

    saveData(filePath, dirPath, JSON.stringify(data, null, 2));
};

export const loadBetsData = (userId: number): BetsData => {
    const { filePath } = getPaths(`bets_${userId}.json`);

    try {
        return JSON.parse(loadData(filePath));
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
    }

    return {};
};

export const saveBetsData = (userId: number, data: BetsData) => {
    const { dirPath, filePath } = getPaths(`bets_${userId}.json`);

    saveData(filePath, dirPath, JSON.stringify(data));
};

export const loadMatches = (): Match[] =>
    JSON.parse(fs.readFileSync('app/utils/hockey/matches.json', 'utf-8'));
