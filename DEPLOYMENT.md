# 🚀 PTEC Studymate - Production Deployment Guide

This guide will help you build and deploy PTEC Studymate to production environments.

## 📋 Prerequisites

Before building for production, ensure you have:

- ✅ Node.js (v16 or higher)
- ✅ Expo CLI (`npm install -g @expo/cli`)
- ✅ EAS CLI (`npm install -g eas-cli`)
- ✅ Expo account (sign up at [expo.dev](https://expo.dev))
- ✅ Google Play Console account (for Android)
- ✅ Apple Developer account (for iOS)

## 🛠️ Quick Start

### Option 1: Automated Build Script

**For Windows:**
```bash
./build-production.bat
```

**For macOS/Linux:**
```bash
./build-production.sh
```

### Option 2: Manual Build Process

1. **Install EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login to Expo:**
```bash
eas login
```

3. **Install dependencies:**
```bash
npm install
```

4. **Configure EAS (first time only):**
```bash
eas build:configure
```

## 📱 Platform-Specific Builds

### 🤖 Android

#### APK Build (for testing)
```bash
eas build --platform android --profile preview
```

#### AAB Build (for Google Play Store)
```bash
eas build --platform android --profile production
```

**Android Requirements:**
- Package name: `com.ptec.studymate`
- Target SDK: 34 (Android 14)
- Minimum SDK: 21 (Android 5.0)

### 🍎 iOS

#### App Store Build
```bash
eas build --platform ios --profile production
```

**iOS Requirements:**
- Bundle ID: `com.ptec.studymate`
- iOS Deployment Target: 13.0+
- Valid Apple Developer certificate

### 🌐 Web

#### Static Web Build
```bash
npx expo export:web
```

The build will be created in the `dist` folder.

## 🔧 Build Configurations

### EAS Build Profiles (`eas.json`)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

### App Configuration (`app.json`)

Key production settings:
- **Version**: `1.0.0`
- **Bundle ID**: `com.ptec.studymate`
- **Permissions**: Internet, Network State
- **Orientation**: Portrait
- **Theme**: Automatic (follows system)

## 📦 Deployment Steps

### 🤖 Google Play Store (Android)

1. **Build AAB:**
```bash
eas build --platform android --profile production
```

2. **Download the AAB file** from Expo dashboard

3. **Upload to Google Play Console:**
   - Go to [Google Play Console](https://play.google.com/console/)
   - Create new app or select existing
   - Upload AAB to Internal Testing → Production
   - Fill out store listing information
   - Submit for review

### 🍎 App Store (iOS)

1. **Build IPA:**
```bash
eas build --platform ios --profile production
```

2. **Download the IPA file** from Expo dashboard

3. **Upload to App Store Connect:**
   - Use Xcode or Application Loader
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Create new app or select existing
   - Upload IPA file
   - Fill out app information
   - Submit for review

### 🌐 Web Deployment

#### Netlify
1. Build: `npx expo export:web`
2. Drag `dist` folder to Netlify
3. Configure custom domain (optional)

#### Vercel
1. Build: `npx expo export:web`
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy: `vercel --prod dist`

#### Firebase Hosting
1. Build: `npx expo export:web`
2. Install Firebase CLI: `npm i -g firebase-tools`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🔍 Build Monitoring

### Check Build Status
```bash
eas build:list
```

### View Build Logs
```bash
eas build:view [BUILD_ID]
```

### Cancel Build
```bash
eas build:cancel [BUILD_ID]
```

## 🐛 Troubleshooting

### Common Issues

#### Build Fails
- Check `eas build:list` for error details
- Ensure all dependencies are compatible
- Verify app.json configuration

#### Android Build Issues
- Check package name conflicts
- Verify Android permissions
- Ensure target SDK compatibility

#### iOS Build Issues
- Verify Apple Developer account
- Check bundle identifier
- Ensure iOS deployment target compatibility

#### Web Build Issues
- Check for React Native specific code
- Verify web-compatible dependencies
- Test locally with `expo start --web`

### Debug Commands
```bash
# Clear Expo cache
expo r -c

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📊 Performance Optimization

### Bundle Size Optimization
- Remove unused dependencies
- Use dynamic imports for large libraries
- Optimize images and assets

### Runtime Performance
- Enable Hermes engine (Android)
- Use FlatList for large lists
- Implement proper memoization

## 🔐 Security Considerations

### Production Checklist
- [ ] Remove debug logs
- [ ] Secure API endpoints
- [ ] Validate user inputs
- [ ] Use HTTPS for all requests
- [ ] Implement proper error handling
- [ ] Add crash reporting (Sentry)

## 📈 Analytics & Monitoring

### Recommended Tools
- **Expo Analytics**: Built-in usage analytics
- **Sentry**: Error tracking and performance monitoring
- **Firebase Analytics**: User behavior tracking
- **Flipper**: Development debugging

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: eas build --platform all --non-interactive
```

## 📞 Support

### Getting Help
- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **EAS Build Docs**: [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction)
- **Community Forum**: [forums.expo.dev](https://forums.expo.dev)
- **Discord**: [expo.dev/discord](https://expo.dev/discord)

### Build Status
- **Expo Dashboard**: [expo.dev/accounts/[username]/projects/ptec-studymate](https://expo.dev)
- **Build History**: Available in Expo dashboard
- **Download Links**: Generated after successful builds

---

**Happy Deploying! 🎉**

*Last updated: 2025*