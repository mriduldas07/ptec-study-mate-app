# PTEC NoteBot - Student App

A comprehensive React Native + Expo mobile application for students to access educational notes, reports, and course materials from the PTEC NoteBot API.

## Features

- **Browse by Levels**: Explore educational content organized by academic levels
- **Course Management**: View courses and their associated notes
- **Note Access**: Direct access to Google Drive files and documents
- **Favorites System**: Save your favorite notes and courses for quick access
- **Search Functionality**: Find notes, courses, and levels quickly
- **Recent Links**: Track recently accessed notes
- **Modern UI**: Clean, intuitive interface following Material Design principles

## Technical Stack

- **Framework**: React Native with Expo SDK
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **UI Components**: React Native Elements + Custom Components
- **Icons**: Expo Vector Icons
- **Storage**: AsyncStorage for favorites and preferences
- **Network**: Axios for API calls
- **Link Handling**: Expo Linking for Google Drive integration

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Expo Go app (for testing on physical device)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PTECNoteBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## Running the App

### Development Mode

1. **Start Expo development server**
   ```bash
   npm start
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```

3. **Run on iOS** (macOS only)
   ```bash
   npm run ios
   ```

4. **Run on Web**
   ```bash
   npm run web
   ```

### Testing on Physical Device

1. Install Expo Go from Google Play Store or App Store
2. Scan the QR code from the Expo development server
3. The app will load on your device

## Building for Production

### Android APK

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build APK**
   ```bash
   eas build --platform android --profile preview
   ```

### Android App Bundle (for Play Store)

```bash
eas build --platform android --profile production
```

## Project Structure

```
PTECNoteBot/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LevelCard.js
│   │   ├── CourseCard.js
│   │   ├── NoteCard.js
│   │   ├── LoadingSpinner.js
│   │   └── ErrorBoundary.js
│   ├── screens/             # App screens
│   │   ├── HomeScreen.js
│   │   ├── LevelsScreen.js
│   │   ├── CoursesScreen.js
│   │   ├── NotesScreen.js
│   │   ├── NoteViewerScreen.js
│   │   ├── SearchScreen.js
│   │   ├── FavoritesScreen.js
│   │   └── SettingsScreen.js
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js
│   ├── context/             # State management
│   │   └── AppContext.js
│   └── services/            # API services
│       └── api.js
├── assets/                  # Images, icons, fonts
├── App.js                   # Main app component
├── app.json                 # Expo configuration
└── package.json            # Dependencies
```

## API Integration

The app connects to the PTEC NoteBot API at `https://ptec-notebot-server.vercel.app`

### Endpoints Used:
- `GET /levels` - Fetch all educational levels
- `GET /courses` - Fetch all courses
- `GET /courses_level/:id` - Fetch courses by level
- `GET /notes` - Fetch all notes
- `GET /notes_course/:courseId` - Fetch notes by course

## Key Features Implementation

### State Management
- Uses React Context API for global state
- AsyncStorage for persistent data (favorites, preferences)
- Automatic data synchronization

### Navigation
- Bottom tab navigation with 4 main sections
- Stack navigation within each tab
- Deep linking support for note sharing

### External App Integration
- Google Drive link handling
- Smart link opening (app vs browser)
- Share functionality for notes

### Performance Optimizations
- Lazy loading for large lists
- Efficient re-rendering with proper key props
- Memory management for images and data

## Customization

### Theming
The app uses a consistent color scheme defined in each component:
- Primary: `#2196F3` (Blue)
- Secondary: `#4CAF50` (Green)
- Accent: `#FF9800` (Orange)
- Error: `#F44336` (Red)

### Adding New Features
1. Create new components in `src/components/`
2. Add new screens in `src/screens/`
3. Update navigation in `src/navigation/AppNavigator.js`
4. Extend context state in `src/context/AppContext.js`

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Android build issues**
   ```bash
   cd android && ./gradlew clean && cd ..
   npx expo run:android
   ```

3. **Dependencies issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Performance Issues
- Check for memory leaks in useEffect hooks
- Ensure proper cleanup of event listeners
- Optimize FlatList rendering with proper keyExtractor

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**Developed for**: PTEC Students