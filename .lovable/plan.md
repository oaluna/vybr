

# Matchmaking Engine

## Overview
Build a backend matchmaking engine that computes compatibility scores between the current user and other profiles based on interests, bio/personality, and demographic data. The engine runs as a backend function invoked during the "Analyzing" screen, and redirects to matches when complete.

## Architecture

```text
AnalyzingScreen
    |
    v (progress hits 100%)
useMatchFetching (enabled=true)
    |
    v
supabase.functions.invoke('matchmaking')
    |
    v
Edge Function: matchmaking/index.ts
    - Reads current user's profile (user_profiles)
    - Reads candidate profiles (profiles table), filtered by orientation
    - Computes compatibility scores using AI (Gemini Flash)
    - Returns ranked matches with scores
    |
    v
Frontend receives matches -> setMatches() -> setScreen('matches')
```

## Step 1: Create the Matchmaking Edge Function

**File:** `supabase/functions/matchmaking/index.ts`

The function will:
1. Authenticate the requesting user via JWT
2. Fetch the user's profile from `user_profiles`
3. Fetch candidate profiles from `profiles`, filtered by the user's orientation preference
4. Send both to Gemini Flash with a prompt asking it to score compatibility (0-100) for each candidate based on shared interests, personality alignment from bios, and age proximity
5. Return the scored and ranked list of matches

**AI Prompt Strategy:**
- Input: user's interests, bio, age + each candidate's interests, bio, age
- Output: JSON array of `{ user_id, compatibility_score, match_reason }` 
- Model: `google/gemini-2.5-flash` via Lovable AI (no API key needed)

## Step 2: Update useMatchFetching Hook

**File:** `src/hooks/useMatchFetching.ts`

Replace the mock data logic with a call to the matchmaking edge function:
- Call `supabase.functions.invoke('matchmaking')` 
- Parse the response into `Match[]` objects
- Fall back to the existing mock data approach if the function call fails (e.g., user not authenticated or no candidates)
- Keep the commented-out original DB fetch for reference

## Step 3: Update AnalyzingScreen Timing

**File:** `src/components/screens/AnalyzingScreen.tsx`

Minor adjustment: instead of waiting for `progress === 100` to trigger matching, start the match computation earlier (e.g., immediately on mount) and let the analyzing animation serve as a loading state. The screen transitions to matches once the engine responds OR progress completes, whichever is later. This ensures the animation feels meaningful and the user isn't waiting longer than necessary.

## Technical Details

### Edge Function Request/Response

**Request** (authenticated, POST):
```json
{}
```
The function reads the user ID from the JWT.

**Response:**
```json
{
  "matches": [
    {
      "id": "uuid",
      "name": "Alice",
      "age": 25,
      "avatar": "url",
      "compatibility": 87,
      "interests": ["hiking", "coding"],
      "lastActive": "2 hours ago",
      "bio": "..."
    }
  ]
}
```

### Compatibility Algorithm (AI-powered)

The edge function sends a structured prompt to Gemini with:
- The user's profile data (interests, bio, age)
- A batch of candidate profiles
- Instructions to score each candidate 0-100 based on: interest overlap (40% weight), personality/bio alignment (40%), and age proximity (20%)

The AI returns JSON scores which are merged with profile data and sorted.

### Fallback

If the edge function fails or returns no results, the hook falls back to the existing mock profile data to ensure the app remains functional.

### Config

Add JWT verification bypass in `supabase/config.toml` (verify manually in code instead):
```toml
[functions.matchmaking]
verify_jwt = false
```

