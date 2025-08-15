@echo off
title PTEC Studymate - Production Build

echo.
echo 🚀 Starting PTEC Studymate Production Build Process...
echo.

REM Check if EAS CLI is installed
eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ EAS CLI is not installed. Installing...
    npm install -g eas-cli
)

REM Check if user is logged in to Expo
echo 🔐 Checking Expo authentication...
eas whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Please login to Expo:
    eas login
)

REM Clean install dependencies
echo 📦 Installing dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm install

REM Configure EAS if not already configured
if not exist eas.json (
    echo ⚙️  Configuring EAS Build...
    eas build:configure
)

REM Build options
echo.
echo 📱 Select build type:
echo 1) Android APK (Preview/Testing)
echo 2) Android AAB (Play Store)
echo 3) iOS (App Store)
echo 4) Both Android ^& iOS (Production)
echo 5) Web Build
echo 6) All Platforms
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo 🤖 Building Android APK...
    eas build --platform android --profile preview
) else if "%choice%"=="2" (
    echo 🤖 Building Android AAB for Play Store...
    eas build --platform android --profile production
) else if "%choice%"=="3" (
    echo 🍎 Building iOS for App Store...
    eas build --platform ios --profile production
) else if "%choice%"=="4" (
    echo 📱 Building for both Android ^& iOS...
    eas build --platform all --profile production
) else if "%choice%"=="5" (
    echo 🌐 Building for Web...
    npx expo export:web
    echo ✅ Web build completed! Files are in 'dist' folder
) else if "%choice%"=="6" (
    echo 🌍 Building for all platforms...
    eas build --platform all --profile production
    npx expo export:web
    echo ✅ Web build completed! Files are in 'dist' folder
) else (
    echo ❌ Invalid choice. Exiting...
    pause
    exit /b 1
)

echo.
echo ✅ Build process completed!
echo.
echo 📋 Next steps:
echo • Check your Expo dashboard for build status
echo • Download the build files when ready
echo • For Android: Upload AAB to Google Play Console
echo • For iOS: Upload IPA to App Store Connect
echo • For Web: Deploy 'dist' folder to your hosting service
echo.
echo 🔗 Useful links:
echo • Expo Dashboard: https://expo.dev/
echo • Google Play Console: https://play.google.com/console/
echo • App Store Connect: https://appstoreconnect.apple.com/
echo.

pause