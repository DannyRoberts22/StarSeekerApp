# E2E Testing with Detox

This directory contains end-to-end tests using Detox for the StarSeeker app.

## Prerequisites

### iOS

- Xcode installed
- iOS Simulator set up
- Install Detox dependencies:
  ```bash
  brew tap wix/brew
  brew install applesimutils
  ```

### Android

- Android Studio installed
- Android emulator set up (default: Pixel_3a_API_30_x86)
- Update the emulator name in `.detoxrc.js` if using a different emulator

## Setup

1. Install dependencies:

   ```
   nvm use
   ```

   ```bash
   npm install
   ```

2. Build the app for testing:

   ```bash
   # iOS
   npm run build:e2e:ios

   # Android
   npm run build:e2e:android
   ```

## Running Tests

### iOS

```bash
npm run test:e2e:ios
```

### Android

```bash
npm run test:e2e:android
```

### Default (iOS)

```bash
npm run test:e2e
```

## Test Structure

- `gates.test.js` - Tests for the gates list screen
- `navigation.test.js` - Tests for tab navigation
- `calculator.test.js` - Tests for the calculator functionality

## Troubleshooting

- If tests fail to find elements, ensure testIDs are added to components
- Make sure the simulator/emulator is running
- Rebuild the app if you've made native changes
- Check that the correct configuration is being used in `.detoxrc.js`

## Configuration

Edit `.detoxrc.js` to:

- Change simulator/emulator devices
- Add new test configurations
- Adjust timeouts and other settings
