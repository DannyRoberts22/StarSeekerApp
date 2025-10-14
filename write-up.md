# StarSeekerApp Technical Write-Up

## Design Decisions

### Architecture

- **Expo Router with File-based Routing**: Chose Expo Router for its modern, Next.js-inspired approach to React Native navigation and it's ease of use straight out the box from Expo templates. The `(tabs)` folder structure provides an intuitive tab navigation while maintaining type safety.
- **Clean Architecture with Separation of Concerns**:
  - `src/hooks/` - Custom hooks for data fetching and business logic
  - `src/components/` - Reusable UI components with clear responsibilities
  - `services/api.ts` - Centralized API layer with proper error handling
  - `src/lib/types.ts` - Strong TypeScript typing throughout

### State Management

- **TanStack Query (React Query)**: Selected for its excellent caching, background updates, and optimistic updates. Provides built-in loading states, error handling, and request deduplication.
- **Local Component State**: Used React's `useState` for UI-specific state (form inputs, toggles)
- **AsyncStorage Integration**: Implemented query persistence for offline-first experience using `@tanstack/query-async-storage-persister`

### Libraries Chosen

- **TypeScript**: Full type safety across the entire codebase
- **@testing-library/react-native**: Comprehensive testing with 156 unit tests covering hooks, components, and screens
- **Lottie React Native**: Smooth animations for splash screen and loading states
- **NetInfo**: Network connectivity monitoring for offline awareness
- **Detox**: End-to-end testing framework for iOS/Android simulators
- **Expo Vector Icons**: Comprehensive icon library for UI elements
- **React Native Picker**: Native picker components for form inputs

## Trade-offs Made

### Performance vs. Features

- **Implemented custom `useMinimumLoadingTime` hook**: Ensures loading states are visible for at least 2 seconds to prevent jarring UI flashes, trading slight delay for better UX
- **Aggressive caching with TanStack Query**: 5-minute stale time for gate data balances fresh data with performance
- **Optimistic UI rendering**: Components render immediately with loading states rather than waiting for all data, prioritizing perceived performance and user engagement over complete data availability before display.

### Code Complexity vs. Maintainability

- **Comprehensive mocking strategy**: Created detailed mock helpers (`createMockQueryResult`) that add complexity but ensure reliable tests
- **Strong typing with UseQueryResult**: Added TypeScript complexity but prevents runtime errors and improves developer experience
- **Modular hook design**: Each hook has single responsibility (useGate, useGates, useRoute, useTransport) rather than one large hook

### Mobile-First vs. Web Compatibility

- **Expo Router over React Navigation**: Provides better web support but with some mobile-specific trade-offs
- **StyleSheet over Styled Components**: Native performance over developer experience conveniences

## Bonus Tasks Attempted

### ✅ State Persistence

- **AsyncStorage Integration**: Implemented with TanStack Query's persistence layer via `PersistQueryClientProvider`
- **Automatic Cache Hydration**: App restores previous query cache on launch through persisted AsyncStorage
- **Configurable Cache Lifetime**: 1-hour garbage collection time ensures data freshness while enabling offline access

### ✅ Offline Mode

- **Network Status Monitoring**: `useIsOnline` hook tracks connectivity
- **Offline Notice Component**: Displays persistent banner when offline
- **Graceful Degradation**: Cached data remains available offline
- **Smart Retry Logic**: Automatic retries when connection restored

### ✅ Comprehensive Testing

- **156 Unit Tests**: 100% coverage of hooks and components
- **Integration Tests**: Full screen rendering and interaction tests
- **E2E Testing**: Detox setup for iOS/Android simulator testing
- **Realistic Mocking**: Proper UseQueryResult mocking with all required properties

### ✅ Thoughtful Animations

- **Lottie Splash Screen**: Custom StarSeeker logo animation
- **Loading States**: Consistent loading indicators across all screens
- **Smooth Transitions**: Native navigation animations with Expo Router

### 🔄 Additional Enhancements Implemented

#### **Advanced Error Handling**

- **Comprehensive Error Boundaries**: Graceful error recovery
- **User-Friendly Error Messages**: Clear, actionable error states
- **Retry Mechanisms**: Built into TanStack Query configuration

#### **Developer Experience**

- **Full TypeScript Coverage**: Strict typing with proper interface definitions
- **ESLint + Prettier**: Consistent code formatting and quality
- **Comprehensive Documentation**: Detailed README with setup instructions
- **Jest Configuration**: Proper test environment with realistic mocks

#### **Mobile UX Optimizations**

- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper testIDs and semantic elements
- **Performance Monitoring**: Optimized re-renders and query invalidation
- **Native Feel**: Platform-appropriate UI patterns and interactions

The implementation successfully delivers all core requirements while adding significant value through bonus features, demonstrating production-ready architecture suitable for a team environment with strong emphasis on maintainability, testing, and user experience.
