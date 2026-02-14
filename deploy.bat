@echo off
REM Windows batch script for deploying Anonymous Feed to Railway
REM This script automates the entire deployment process on Windows

setlocal enabledelayedexpansion

REM Color codes for Windows (using color command)
REM We'll use echo with color codes where possible

echo.
echo ========================================
echo   Автоматическое развертывание
echo   Anonymous Feed на Railway.app
echo ========================================
echo.

REM Check if required tools are installed
echo Проверка требований...

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Git не установлен. Установите Git и попробуйте снова.
    echo Скачайте с: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✓ Git установлен

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js не установлен. Установите Node.js и попробуйте снова.
    echo Скачайте с: https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js установлен

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm не установлен.
    pause
    exit /b 1
)
echo ✓ npm установлен

REM Check pnpm
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo Установка pnpm...
    call npm install -g pnpm
    if errorlevel 1 (
        echo ✗ Не удалось установить pnpm
        pause
        exit /b 1
    )
)
echo ✓ pnpm установлен

echo.
echo ========================================
echo   Ввод данных
echo ========================================
echo.

REM Get GitHub email
set /p GITHUB_EMAIL="Введите GitHub email: "
if "!GITHUB_EMAIL!"=="" (
    echo ✗ GitHub email не может быть пустым
    pause
    exit /b 1
)

REM Get GitHub password
echo Введите GitHub пароль (не будет видно):
for /f "tokens=*" %%A in ('powershell -Command "$pword = read-host 'Input' -AsSecureString ; $BSTR=[System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pword); [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)"') do set GITHUB_PASSWORD=%%A

if "!GITHUB_PASSWORD!"=="" (
    echo ✗ GitHub пароль не может быть пустым
    pause
    exit /b 1
)

REM Get GitHub username
set /p GITHUB_USERNAME="Введите GitHub username (например: Haxil132): "
if "!GITHUB_USERNAME!"=="" (
    echo ✗ GitHub username не может быть пустым
    pause
    exit /b 1
)

REM Get Railway API Token
set /p RAILWAY_TOKEN="Введите Railway API Token: "
if "!RAILWAY_TOKEN!"=="" (
    echo ✗ Railway API Token не может быть пустым
    pause
    exit /b 1
)

REM Get Cloudinary info (optional)
set /p CLOUDINARY_CLOUD_NAME="Введите Cloudinary Cloud Name (опционально, нажмите Enter для пропуска): "

if not "!CLOUDINARY_CLOUD_NAME!"=="" (
    set /p CLOUDINARY_API_KEY="Введите Cloudinary API Key: "
    echo Введите Cloudinary API Secret (не будет видно):
    for /f "tokens=*" %%A in ('powershell -Command "$pword = read-host 'Input' -AsSecureString ; $BSTR=[System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pword); [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)"') do set CLOUDINARY_API_SECRET=%%A
)

echo.
echo ✓ Данные получены
echo.

REM Configure Git
echo ========================================
echo   Настройка Git
echo ========================================
echo.

git config --global user.email "!GITHUB_EMAIL!"
if errorlevel 1 (
    echo ✗ Не удалось установить email Git
    pause
    exit /b 1
)
echo ✓ Email Git установлен

git config --global user.name "!GITHUB_USERNAME!"
if errorlevel 1 (
    echo ✗ Не удалось установить имя Git
    pause
    exit /b 1
)
echo ✓ Имя Git установлено

REM Initialize Git repository
echo.
echo ========================================
echo   Инициализация Git репозитория
echo ========================================
echo.

if exist ".git" (
    echo ℹ Git репозиторий уже инициализирован
) else (
    git init
    if errorlevel 1 (
        echo ✗ Не удалось инициализировать Git
        pause
        exit /b 1
    )
    echo ✓ Git репозиторий инициализирован
)

git add .
if errorlevel 1 (
    echo ✗ Не удалось добавить файлы в Git
    pause
    exit /b 1
)
echo ✓ Файлы добавлены

git commit -m "Initial commit: Anonymous feed platform" --allow-empty
if errorlevel 1 (
    echo ✗ Не удалось создать commit
    pause
    exit /b 1
)
echo ✓ Commit создан

git branch -M main
if errorlevel 1 (
    echo ✗ Не удалось переименовать ветку
    pause
    exit /b 1
)
echo ✓ Ветка переименована в main

REM Create GitHub repository
echo.
echo ========================================
echo   Создание GitHub репозитория
echo ========================================
echo.

echo ℹ Создаю репозиторий на GitHub...

REM Using curl to create GitHub repo
for /f "tokens=*" %%A in ('powershell -Command "[Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes('!GITHUB_USERNAME!:!GITHUB_PASSWORD!'))"') do set AUTH_HEADER=%%A

curl -s -X POST ^
  -H "Authorization: Basic !AUTH_HEADER!" ^
  -H "Accept: application/vnd.github.v3+json" ^
  https://api.github.com/user/repos ^
  -d "{\"name\":\"anonymous-feed\",\"description\":\"Anonymous social feed platform\",\"private\":false,\"auto_init\":false}" >nul 2>&1

echo ✓ GitHub репозиторий создан (или уже существует)

set REPO_URL=https://github.com/!GITHUB_USERNAME!/anonymous-feed.git

git remote remove origin 2>nul
git remote add origin "!REPO_URL!"
if errorlevel 1 (
    echo ✗ Не удалось добавить remote
    pause
    exit /b 1
)
echo ✓ Remote добавлен

REM Push to GitHub
echo.
echo ========================================
echo   Загрузка кода на GitHub
echo ========================================
echo.

echo ℹ Это может занять несколько минут...

git push -u origin main --force
if errorlevel 1 (
    echo ✗ Не удалось загрузить код на GitHub
    echo Проверьте:
    echo - Правильность email и пароля
    echo - Интернет соединение
    pause
    exit /b 1
)
echo ✓ Код загружен на GitHub

REM Install dependencies
echo.
echo ========================================
echo   Установка зависимостей
echo ========================================
echo.

echo ℹ Это может занять 5-10 минут...

call pnpm install
if errorlevel 1 (
    echo ✗ Не удалось установить зависимости
    pause
    exit /b 1
)
echo ✓ Зависимости установлены

REM Build project
echo.
echo ========================================
echo   Сборка проекта
echo ========================================
echo.

call pnpm build
if errorlevel 1 (
    echo ✗ Не удалось собрать проект
    pause
    exit /b 1
)
echo ✓ Проект собран

REM Setup Railway environment variables
echo.
echo ========================================
echo   Завершение развертывания
echo ========================================
echo.

echo.
echo Ваш код загружен на GitHub:
echo https://github.com/!GITHUB_USERNAME!/anonymous-feed
echo.
echo Теперь нужно завершить развертывание на Railway:
echo.
echo 1. Перейдите на https://railway.app
echo 2. Нажмите "New Project"
echo 3. Выберите "Deploy from GitHub repo"
echo 4. Найдите и выберите "anonymous-feed"
echo 5. Добавьте MySQL БД
echo 6. Установите переменные окружения:
echo    - DATABASE_URL (из MySQL сервиса)
echo    - JWT_SECRET (любая строка, например: !RANDOM!!RANDOM!!RANDOM!)
echo    - NODE_ENV = production
echo    - PORT = 3000
if not "!CLOUDINARY_CLOUD_NAME!"=="" (
    echo    - CLOUDINARY_CLOUD_NAME = !CLOUDINARY_CLOUD_NAME!
    echo    - CLOUDINARY_API_KEY = !CLOUDINARY_API_KEY!
    echo    - CLOUDINARY_API_SECRET = !CLOUDINARY_API_SECRET!
)
echo 7. Нажмите Deploy
echo.
echo Вопросы? Смотрите DEPLOYMENT_FULLY_FREE.md
echo.
pause
