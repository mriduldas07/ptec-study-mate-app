#!/bin/bash

# PTEC Studymate - Production Build Script
# This script creates production builds for all platforms

echo "🚀 Starting PTEC Studymate Production Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI is not installed. Installing...${NC}"
    npm install -g eas-cli
fi

# Check if user is logged in to Expo
echo -e "${BLUE}🔐 Checking Expo authentication...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Please login to Expo:${NC}"
    eas login
fi

# Clean install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
rm -rf node_modules package-lock.json
npm install

# Configure EAS if not already configured
if [ ! -f "eas.json" ]; then
    echo -e "${BLUE}⚙️  Configuring EAS Build...${NC}"
    eas build:configure
fi

# Build options
echo -e "${YELLOW}📱 Select build type:${NC}"
echo "1) Android APK (Preview/Testing)"
echo "2) Android AAB (Play Store)"
echo "3) iOS (App Store)"
echo "4) Both Android & iOS (Production)"
echo "5) Web Build"
echo "6) All Platforms"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo -e "${GREEN}🤖 Building Android APK...${NC}"
        eas build --platform android --profile preview
        ;;
    2)
        echo -e "${GREEN}🤖 Building Android AAB for Play Store...${NC}"
        eas build --platform android --profile production
        ;;
    3)
        echo -e "${GREEN}🍎 Building iOS for App Store...${NC}"
        eas build --platform ios --profile production
        ;;
    4)
        echo -e "${GREEN}📱 Building for both Android & iOS...${NC}"
        eas build --platform all --profile production
        ;;
    5)
        echo -e "${GREEN}🌐 Building for Web...${NC}"
        npx expo export:web
        echo -e "${GREEN}✅ Web build completed! Files are in 'dist' folder${NC}"
        ;;
    6)
        echo -e "${GREEN}🌍 Building for all platforms...${NC}"
        eas build --platform all --profile production
        npx expo export:web
        echo -e "${GREEN}✅ Web build completed! Files are in 'dist' folder${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Exiting...${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Build process completed!${NC}"
echo -e "${BLUE}📋 Next steps:${NC}"
echo "• Check your Expo dashboard for build status"
echo "• Download the build files when ready"
echo "• For Android: Upload AAB to Google Play Console"
echo "• For iOS: Upload IPA to App Store Connect"
echo "• For Web: Deploy 'dist' folder to your hosting service"

echo -e "${YELLOW}🔗 Useful links:${NC}"
echo "• Expo Dashboard: https://expo.dev/"
echo "• Google Play Console: https://play.google.com/console/"
echo "• App Store Connect: https://appstoreconnect.apple.com/"