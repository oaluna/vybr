

# Plan: Add 300 Mock Test Profiles for Matches Screen

## Overview

Create a file with 300 hardcoded mock profiles and modify the `useMatchFetching` hook to use this mock data instead of fetching from the database. The original database fetch code will be commented out with a note explaining how to restore it.

## Implementation

### 1. Create Mock Data File

**New file: `src/data/mockProfiles.ts`**

Generate 300 diverse test profiles with:
- Unique UUIDs for each profile
- Mix of names (male, female, gender-neutral)
- Ages ranging from 18-45
- Varied compatibility scores (50-99%)
- Realistic Unsplash avatar URLs
- Diverse interests (music, sports, travel, tech, art, food, etc.)
- Varied "last active" times
- Unique bios

```text
Data structure per profile:
+------------------+----------------------------------------+
| Field            | Generation Strategy                    |
+------------------+----------------------------------------+
| id               | Sequential UUID-like string            |
| name             | From curated list of 100+ names        |
| age              | Random 18-45                           |
| avatar           | Unsplash face photos (50+ variations)  |
| compatibility    | Random 50-99                           |
| interests        | 3-5 random from pool of 30+ interests  |
| lastActive       | "Just now", "X min", "X hours", etc.   |
| bio              | From pool of 50+ unique bios           |
+------------------+----------------------------------------+
```

### 2. Modify Match Fetching Hook

**File: `src/hooks/useMatchFetching.ts`**

Changes:
1. Import mock profiles
2. Comment out the Supabase database fetch code with a clear note
3. Use mock data directly with same mapping logic
4. Keep gender filtering working (based on orientation)

```typescript
// NOTE: Database fetch temporarily disabled for testing.
// To restore, uncomment the Supabase query below and remove the mock data import.
// Original code start:
/*
let query = supabase
  .from('profiles')
  .select('*')
  ...
*/
// Original code end

// MOCK DATA - Remove this section and uncomment above to restore database fetch
import { mockProfiles } from '@/data/mockProfiles';
// Use mockProfiles instead of database data
```

### 3. Optional: Update MatchesScreen for Direct Loading

If the user wants profiles to show immediately (even without going through AnalyzingScreen), we can:
- Add a useEffect in MatchesScreen that loads mock profiles if none exist
- Or modify the app store to initialize with mock data

## Files Changed

| File | Action |
|------|--------|
| `src/data/mockProfiles.ts` | Create (new file with 300 profiles) |
| `src/hooks/useMatchFetching.ts` | Modify (comment out DB fetch, use mock data) |

## Technical Details

### Mock Profile Generation

The 300 profiles will be generated with this approach:
- 50 unique avatar URLs from Unsplash
- 100+ unique first names (diverse cultural backgrounds)
- 30+ unique interests to create varied combinations
- 50+ unique bio templates
- Gender distribution: ~40% female, ~40% male, ~20% nonbinary

### Preserving Original Code

The database fetch code will be wrapped in block comments with clear markers:

```typescript
/* ====== ORIGINAL DATABASE FETCH - UNCOMMENT TO RESTORE ======
   ...original code...
   ====== END ORIGINAL DATABASE FETCH ====== */
```

This ensures easy restoration when needed.

