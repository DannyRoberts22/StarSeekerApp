# StarSeekerApp

A React Native app built with Expo for tracking and managing gates, calculating journey costs, and finding routes.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19.0 (managed via nvm)
- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- iOS Simulator (Mac only) or Android Emulator
- [Watchman](https://facebook.github.io/watchman/) (recommended for file watching)

## Setup

### 1. Install the correct Node version

This project uses nvm to manage Node.js versions. The required version is specified in `.nvmrc`.

```bash
# Install and use the correct Node version
nvm use
```

If you don't have the required version installed, nvm will prompt you to install it:

```bash
nvm install
```

### 2. Install Watchman (recommended)

Watchman improves file watching performance during development:

```bash
# macOS
brew install watchman
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure API Settings

The app requires API configuration to connect to the Star Seeker backend. Create an `app.config.ts` file in the project root:

```typescript
export default {
  expo: {
    name: 'Star Seeker',
    slug: 'star-seeker',
    extra: {
      API_URL: 'https://hstc-api.testing.keyholding.com',
      API_KEY: 'YOUR_API_KEY_HERE',
    },
  },
};
```

**Important**:

- Make sure to create this file before running the app, or you'll get API connection errors

### 5. Install Expo CLI (optional)

While not required (npm scripts handle this), you can install Expo CLI globally:

```bash
npm install -g expo-cli
```

## Running the App

### Development with Expo Go (Recommended for Quick Start)

The simplest way to run the app is using Expo Go:

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `i` to open iOS Simulator (Expo Go will be automatically installed)
- Press `a` to open Android Emulator (Expo Go will be automatically installed)
- Scan the QR code with the [Expo Go app](https://expo.dev/go) on your physical device (download from App Store/Play Store)

**Note**:

- Expo Go is automatically installed on simulators/emulators when you press `i` or `a`
- For physical devices, you need to manually download Expo Go from the App Store (iOS) or Play Store (Android)
- Expo Go has some limitations and doesn't support custom native modules. For full functionality, use a development build (see below).

### Development Build (Full Functionality)

For testing with custom native modules or running E2E tests, you need a development build:

#### First Time Setup

Generate native folders (required for Detox E2E tests):

```bash
npx expo prebuild
```

This creates the `ios/` and `android/` folders needed for native builds.

#### Running with Development Build

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Web
npm run web
```

These commands will:

1. Build the native app
2. Install it on the simulator/emulator
3. Start the Metro bundler

**Experiencing issues?** See [Common Setup Issues](#common-setup-issues) for troubleshooting.

## Development

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check
```

## Testing

### Overview

StarSeekerApp uses two types of testing:

1. **Unit Tests** - Fast component and screen tests using Jest and React Native Testing Library (87 tests)
2. **End-to-End Tests** - Full app testing using Detox on iOS/Android simulators

#### Run all unit tests

```bash
npm test
```

#### Run a specific unit test file

```bash
npm test <path-to-test-file>
```

Example:

```bash
npm test src/components/__tests__/StyledText.test.tsx
```

#### Watch mode for development

```bash
npm run test:watch
```

### End-to-End Tests

See [e2e/README.md](./e2e/README.md) for E2E testing instructions

### Test Configuration

#### Key Files

- `jest.config.js` - Jest setup for unit tests with web/html exclusions
- `jest.setup.js` - Essential mocks for React Native testing
- `e2e/jest.config.js` - Detox E2E test configuration
- `*.test.tsx` - Test files following simple pattern

#### Exclusions

- Web-specific files (`.web.`)
- HTML files (`+html.tsx`)
- Build artifacts

### Test Patterns

#### Simple Component Tests

- Mount the component
- Check it renders
- Verify key elements exist
- Test user interactions

#### Simple Screen Tests

- Mock required hooks
- Render the screen
- Verify main UI elements
- Test basic interactions

### Mocked Dependencies

- `expo-router` - Navigation
- `lottie-react-native` - Animations
- `react-native-reanimated` - Animations
- `@tanstack/react-query` - Data fetching
- `@react-native-async-storage/async-storage` - Storage
- `@react-native-community/netinfo` - Network
- `expo-font` - Fonts

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: TanStack Query (React Query)
- **Storage**: AsyncStorage
- **Animations**: Lottie, React Native Reanimated
- **Styling**: StyleSheet with theme support
- **Testing**: Jest, React Native Testing Library, Detox

## Project Structure

```
StarSeekerApp/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Gates list
│   │   ├── calculator.tsx # Journey calculator
│   │   ├── route.tsx      # Route finder
│   │   └── memory.tsx     # Favorites & recent
│   └── gate/              # Gate details
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities and types
├── constants/             # App constants (colors, etc.)
├── e2e/                   # End-to-end tests
└── assets/                # Images, fonts, animations
```

## License

Private

## Common Setup Issues

### Metro bundler won't start

If you encounter issues with the Metro bundler:

```bash
# Clear Metro bundler cache
npx expo start --clear
```

### "Expo CLI not found" error

The project uses `npx expo` commands, which don't require global installation. If you see this error:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### iOS Simulator issues

If the iOS Simulator won't open:

```bash
# Check Xcode Command Line Tools are installed
xcode-select --install

# Reset simulator if needed
xcrun simctl erase all
```

### Android Emulator issues

If the Android Emulator won't connect:

```bash
# Check ADB is running
adb devices

# Restart ADB if needed
adb kill-server
adb start-server
```

### Node version mismatch

Always ensure you're using the correct Node version:

```bash
# Check current version
node --version

# Should output: v20.19.0
# If not, run:
nvm use
```

### Port already in use

If port 8081 is already in use:

```bash
# Kill the process using port 8081
npx kill-port 8081

# Or start on a different port
npx expo start --port 8082
```
