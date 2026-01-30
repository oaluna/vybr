# Copilot Instructions for Vybr

## Architecture Overview

**Vybr** is a React/TypeScript mobile dating app built with Vite, using a screen-based navigation pattern. The architecture follows:

- **State Management**: Zustand (`appStore.ts`) for global app state (current screen, matches, messages, notifications, auth state)
- **Backend**: Supabase for authentication, database, and user profiles
- **UI Framework**: shadcn/ui components styled with Tailwind CSS
- **Data Fetching**: React Query for server state management
- **Routing**: React Router (single-page app with screen-based navigation at `/pages/Index.tsx`)
- **Animation**: Framer Motion for transitions and screen animations

### Key Data Flow

1. **Auth Flow**: `useAuth` hook manages Supabase auth state → persists to localStorage
2. **Profiles**: User profiles fetched from Supabase `user_profiles` table in `useAuth`
3. **Matches**: `useAppStore` holds matches array; `useMatchFetching` hook fetches from API
4. **User Interactions**: Saved matches/likes tracked in `saved_matches` table via `useSavedMatches`

## Screen Structure

App has 13 screens (exported from `src/components/screens/`), displayed via `Index.tsx` using Framer Motion `AnimatePresence`. Each screen is a full-page component:

- `SplashScreen`, `AuthScreen`, `OnboardingScreen`, `PermissionsScreen`, `OrientationScreen`
- `CreateProfileScreen`, `AnalyzingScreen`, `MatchesScreen`, `ChatScreen`, `MessagesScreen`
- `ProfileScreen`, `SettingsScreen`

**Pattern**: Screens check `useAppStore` for current screen state and use `setScreen()` to navigate. Use Framer Motion for entrance/exit animations.

## Development Commands

```bash
npm run dev           # Start dev server (localhost:8080)
npm run build         # Production build (Vite)
npm run build:dev     # Dev build with source maps
npm run lint          # ESLint check (no auto-fix enabled)
npm test              # Run tests once (Vitest)
npm test:watch        # Watch mode tests
```

## Component Conventions

- **UI Components**: Located in `src/components/ui/` (auto-imported from shadcn). Use as building blocks.
- **Screen Components**: One component per file in `src/components/screens/`, always exported as named exports.
- **Sub-components**: Grouped by feature (e.g., `src/components/matches/ProfileCard.tsx`)
- **Styling**: Tailwind CSS with HSL color variables (defined in `tailwind.config.ts`). Use `className` prop directly.
- **Icons**: Lucide React (`lucide-react` package)

## Code Style & Configuration

- **TypeScript**: Loose config (`noImplicitAny: false`, `strictNullChecks: false`) for rapid development
- **ESLint**: Minimal rules; `react-refresh/only-export-components` warning for HMR. No `@typescript-eslint/no-unused-vars` rule.
- **Path Alias**: `@` points to `src/` (configured in `tsconfig.json` and `vite.config.ts`)
- **Module Type**: ES modules (`"type": "module"` in package.json)

## Hooks & Utilities

- **`useAuth()`**: Returns `{ user, session, profile, loading, signIn, signUp, signOut }`
- **`useAppStore()`**: Zustand hook for global state (screens, matches, messages, notifications)
- **`useSavedMatches(userId)`**: Manages saved/liked matches in Supabase; returns `{ isMatchSaved, saveMatch, unsaveMatch }`
- **`useMatchFetching()`**: Fetches matches from API; integrates with React Query

## Database Schema (Supabase)

Key tables inferred from code:
- `user_profiles` (user_id, name, age, bio, avatar, gender, interests, orientation)
- `saved_matches` (id, user_id, profile_id, liked, created_at)
- Auth managed by Supabase auth service

Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

## Testing Setup

- **Framework**: Vitest with jsdom environment
- **Setup**: `src/test/setup.ts` for global test configuration
- **Pattern**: Co-locate tests with source files using `.test.ts` or `.spec.ts`
- Example: `src/test/example.test.ts`

## Common Patterns

1. **Form Validation**: Use Zod schemas (see `AuthScreen.tsx` for example)
2. **Loading States**: Track loading in component state; use UI skeletons from shadcn
3. **Error Handling**: Display errors via `NotificationToast` component
4. **API Calls**: Use hooks that integrate with Supabase client; handle errors with try/catch
5. **Mobile-First**: Tailwind viewport uses `2xl: 430px` (mobile app viewport). Use responsive utilities sparingly.

## Important Notes

- **Lovable Integration**: Project uses Lovable (`@lovable.dev/cloud-auth-js`); componentTagger plugin in dev mode
- **No Manual Config**: Don't manually edit generated files; Supabase types auto-generated
- **Framer Motion**: Required for all screen transitions; use `motion` components and `AnimatePresence`
- **Notification System**: Use `useAppStore` to `addNotification()` and display via `NotificationToast` in main Index
