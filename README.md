# 💪 Telegram Testosterone Bot

Бот для настоящих мужиков, которые не филонит на тренировках. Фиксирует каждый твой подход к железу и в конце месяца показывает, кто тут качок, а кто - маслёнок.

[![Telegram Bot API](https://img.shields.io/badge/Telegram_Bot_API-2.0-blue.svg)](https://core.telegram.org/bots/api)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Telegraf](https://img.shields.io/badge/Telegraf-4.x-blueviolet.svg)](https://telegraf.js.org/)

## ✨ Возможности

-   **Отмечаешь тренировку** - один хук команды и день засчитан
-   **Месячная статистика** - кто качался, а кто сосал лапу
-   **Позорная доска** - автоматическое вычисление главного лентяя чата
-   **Железная мотивация** - бот не даст тебе расслабиться
-   **Гибкая настройка** через конфигурационный файл

## 🏋️‍♂️ Быстрый старт

### Предварительные требования

-   Node.js
-   Аккаунт Telegram (если ты ещё в 21 веке)
-   Токен бота от [@BotFather](https://t.me/BotFather)

### Установка

```bash
git clone https://github.com/d-vakhmyanin/testosterone_bot.git
cd testosterone_bot
npm install
```

### Настройка

Создайте файл `.env` в корне проекта:

```ini
TG_TOKEN=ваш_токен_бота
```

### Запуск

```bash
npm start
```

## 💢 КОМАНДЫ

| Команда  | Что делает                      | Где работает     |
| -------- | ------------------------------- | ---------------- |
| `/help`  | Список доступных команд         | Только в группах |
| `/gym`   | Отметить сегодняшнюю тренировку | Только в чате    |
| `/stats` | Показать текущую статистику     | Везде            |
| `/shame` | Показать главного лентяя        | Везде            |

## 🛠 Технологии

-   [Telegraf.js](https://telegraf.js.org/) - Фреймворк для Telegram ботов
-   [Node.js](https://nodejs.org/) - Серверная платформа
-   [Dotenv](https://github.com/motdotla/dotenv) - Управление переменными окружения

## 🏆 ПРИМЕР РАБОТЫ

```
Ты: /gym
Бот: @username засчитал сегодняшнюю тренировку. Не расслабляйся, слабак!

Ты: /stats
Бот: Статистика за месяц:
- @ironman: 22 тренировки
- @username: 18 тренировок
- @weakling: 3 тренировки (позор!)

Ты: /shame
Бот: 🏆 Анти-чемпион этого месяца - @weakling с жалкими 3 тренировками!
```

## 🤜🤛 КАК ПОМОЧЬ ПРОЕКТУ

1. Форкни репозиторий
2. Создай ветку (`git checkout -b feature/BeastMode`)
3. Закоммить изменения (`git commit -m 'Added more iron'`)
4. Запушь (`git push origin feature/BeastMode`)
5. Открой Pull Request

## 📜 ЛИЦЕНЗИЯ

ISC. Качайся на здоровье.

---

> Для тех, кто не ищет лёгких путей | [@iron_developer](https://t.me/dVakhmyanin)
