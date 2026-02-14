# Руководство по развертыванию Лента

## Требования

- Node.js 18+ и npm/pnpm
- MySQL 8.0+ или совместимая база данных
- Доступ к S3-совместимому хранилищу (AWS S3, MinIO и т.д.)

## Установка

1. **Распакуйте архив:**
```bash
tar -xzf anonymous-feed-complete.tar.gz
cd anonymous-feed
```

2. **Установите зависимости:**
```bash
pnpm install
```

3. **Создайте файл `.env.local`:**
```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/anonymous_feed"

# JWT Secret (генерируйте безопасный ключ)
JWT_SECRET="your-secure-random-secret-key-here"

# OAuth (если используете Manus OAuth, оставьте как есть, иначе настройте свой провайдер)
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im"

# S3 Storage
AWS_ACCESS_KEY_ID="your-s3-access-key"
AWS_SECRET_ACCESS_KEY="your-s3-secret-key"
AWS_S3_BUCKET="your-bucket-name"
AWS_S3_REGION="us-east-1"
AWS_S3_ENDPOINT="https://s3.amazonaws.com" # или ваш endpoint

# Owner Info (для уведомлений)
OWNER_NAME="Your Name"
OWNER_OPEN_ID="your-unique-id"

# Analytics (опционально)
VITE_ANALYTICS_ENDPOINT="https://analytics.example.com"
VITE_ANALYTICS_WEBSITE_ID="your-site-id"
```

4. **Инициализируйте базу данных:**
```bash
pnpm db:push
```

5. **Соберите проект:**
```bash
pnpm build
```

6. **Запустите в продакшене:**
```bash
pnpm start
```

Сервер запустится на порту 3000 (или указанном в переменной PORT).

## Структура проекта

```
anonymous-feed/
├── client/              # React фронтенд
│   ├── src/
│   │   ├── pages/      # Страницы (Home, Feed)
│   │   ├── components/ # React компоненты
│   │   └── lib/        # Утилиты (tRPC клиент)
│   └── public/         # Статические файлы
├── server/             # Express бэкенд
│   ├── routers.ts      # tRPC процедуры
│   ├── db.ts           # Функции базы данных
│   └── ipLogger.ts     # Логирование IP
├── drizzle/            # Миграции БД
├── storage/            # S3 хелперы
└── package.json
```

## Функции

- **Приветственная страница** с информацией о проекте
- **Бесконечная прокрутка** постов в ленте
- **Создание постов** с поддержкой медиа (фото, видео, аудио)
- **Система лайков** с подсчетом
- **Комментарии** к постам
- **IP логирование** в файл `ip-logs.txt`
- **Уведомления владельца** при создании нового поста
- **Полная анонимность** - все посты от "Аноним"

## Логирование IP

IP адреса логируются в файл `ip-logs.txt` в корне проекта при создании каждого поста.

## Поддержка медиа

Поддерживаемые форматы:
- **Изображения:** JPEG, PNG, GIF, WebP
- **Видео:** MP4, WebM, MOV
- **Аудио:** MP3, WAV, OGG, M4A

Максимальный размер файла: 16MB

## Переменные окружения

| Переменная | Описание | Обязательна |
|-----------|---------|-----------|
| DATABASE_URL | Строка подключения к БД | ✓ |
| JWT_SECRET | Ключ для подписи сессий | ✓ |
| AWS_ACCESS_KEY_ID | S3 ключ доступа | ✓ |
| AWS_SECRET_ACCESS_KEY | S3 секретный ключ | ✓ |
| AWS_S3_BUCKET | Имя S3 бакета | ✓ |
| VITE_APP_ID | ID приложения OAuth | ✗ |
| OWNER_NAME | Имя владельца | ✗ |
| PORT | Порт сервера (по умолчанию 3000) | ✗ |

## Тестирование

```bash
pnpm test
```

## Troubleshooting

**Ошибка подключения к БД:**
- Проверьте DATABASE_URL
- Убедитесь, что БД доступна и запущена
- Проверьте права доступа пользователя

**Ошибки S3:**
- Проверьте учетные данные AWS
- Убедитесь, что бакет существует
- Проверьте права доступа на загрузку файлов

**Проблемы с медиа:**
- Убедитесь, что размер файла < 16MB
- Проверьте формат файла
- Проверьте доступное место на диске

## Лицензия

MIT
