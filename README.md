# 💪 Telegram Testosterone Bot

[![Telegram Bot API](https://img.shields.io/badge/Telegram_Bot_API-2.0-blue.svg)](https://core.telegram.org/bots/api)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Telegraf](https://img.shields.io/badge/Telegraf-4.x-blueviolet.svg)](https://telegraf.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4%2B-blue.svg)](https://www.typescriptlang.org/)

Бот для настоящих мужиков, которые не филонит на тренировках. Фиксирует каждый твой подход к железу и в конце месяца показывает, кто тут качок, а кто - маслёнок.

## ✨ Возможности

-   **Запись тренировок**  
    Одна команда - и день засчитан. Никаких "ой я забыл"

-   **Автоматический позор**  
    В конце месяца бот сам вычислит главного лентяя чата, определит кто качался, а кто сосал лапу

-   **Честная система баллов**  
    Только правильные дни дают полные баллы. Остальное - жалкие подачки

-   **Админ-контроль**  
    Можешь отменить запись или пометить опоздание. Без соплей
-   **Железная мотивация** - бот не даст тебе расслабиться
-   **Гибкая настройка** через конфигурационный файл (src/config.ts)

## </> Команды

| Команда     | Что делает                      |
| ----------- | ------------------------------- |
| `/start`    | Запуск бота                     |
| `/register` | Подписаться на унижения         |
| `/gym`      | Записать сегодняшнюю тренировку |
| `/stats`    | Показать текущую статистику     |
| `/shame`    | Анти-рейтинг лентяев            |

## 🏋️‍♂️ Быстрый старт

### Предварительные требования

-   Node.js
-   Аккаунт Telegram
-   Токен бота от [@BotFather](https://t.me/BotFather)

### ⚙️ Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/d-vakhmyanin/testosterone_bot.git
cd testosterone_bot
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте и заполните файл .env в корне проекта:

```env
TG_TOKEN=ваш_токен_бота
TG_WEBHOOK_SECRET=ваш_секретный_ключ
```

4. Запустите систему:

```bash
# Разработка
npm run dev

# Продакшен
npm run build
npm run start
```

5. Для работы WebApp потребуется:

-   Настроить туннель
-   Установить вебхук

## 🛠 Технологии

-   **Backend**:

    -   [Node.js](https://nodejs.org/) - Серверная платформа
    -   [TypeScript](https://www.typescriptlang.org/) - Статическая типизация
    -   [Telegraf.js](https://telegraf.js.org/) - Фреймворк для Telegram ботов
    -   [Cron](https://www.npmjs.com/package/cron) - Расписание задач
    -   [Dotenv](https://github.com/motdotla/dotenv) - Управление переменными окружения

-   **Frontend**:

    -   [Next.js](https://nextjs.org/) - React-фреймворк
    -   [Telegram WebApp API](https://core.telegram.org/bots/webapps) - Интеграция с Telegram
    -   [CSS Modules](https://github.com/css-modules/css-modules) - Локальная изоляция стилей

-   **Инфраструктура**:
    -   [Serveo](https://serveo.net/) - Туннелинг для разработки
    -   [PowerShell](https://learn.microsoft.com/ru-ru/powershell/) - Автоматизация запуска
    -   [PM2](https://pm2.keymetrics.io/) - Менеджер процессов (опционально)

Ключевые особенности:

-   Единая кодовая база для бота и веб-интерфейса
-   Автоматическая настройка туннеля и вебхука
-   Поддержка горячей перезагрузки в разработке
-   Использование CSS Modules для изолированных стилей
-   Готовые конфиги для продакшн-сборки

## 🏆 ПРИМЕР РАБОТЫ

```
User: /gym
Bot: Ты записан на сегодня!

Admin (ответом на сообщение): Время считать не научился
Bot: Отметил опоздание. Пусть знает, что так нельзя!

[В конце месяца]
Bot: 📅 ИТОГИ НОЯБРЯ:
🏆 Лучший: @real_athlete - 15 баллов
💩 Лох месяца: @sofa_king - 2 балла
Ты: /shame
Бот: 🏆 Анти-чемпион этого месяца - @weakling с жалкими 3 тренировками!
```

## 📊 Как считаем баллы

-   **Идеальная тренировка** → `+1.0`
-   **Опоздание** (правильный день, но не время) → `+0.6`
-   **Любой другой день** → `+0.2` (жалкие подачки)
-   **Пропуск** → `-0.5` (позор на всю деревню)

## 🤜🤛 КАК ПОМОЧЬ ПРОЕКТУ

1. Форкни репозиторий
2. Создай ветку (`git checkout -b feature/BeastMode`)
3. Закоммить изменения (`git commit -m 'Added more iron'`)
4. Запушь (`git push origin feature/BeastMode`)
5. Открой Pull Request

## 📜 ЛИЦЕНЗИЯ

ISC. Качайся на здоровье.

---
