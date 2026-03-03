

## AI-Powered Compatibility Matching

### What we're building
Replace the random compatibility scores (currently `getRandomNumber(50, 99)`) with an AI-powered engine that calculates meaningful scores based on the authenticated user's profile compared to each potential match's profile.

### Architecture

```text
AnalyzingScreen (progress=100)
  → useMatchFetching (enabled)
    → supabase.functions.invoke('calculate-compatibility')
      → Edge Function reads user's profile from DB
      → Edge Function reads candidate profiles from DB
      → Calls Lovable AI (Gemini Flash) with batch prompt
      → Returns profiles with AI-calculated scores
    → Falls back to mock data if AI fails
  → setMatches() → navigate to MatchesScreen
```

### Implementation steps

1. **Create edge function `calculate-compatibility`**
   - Accept `{ user_id, orientation }` in the request body
   - Read the user's `user_profiles` record (interests, bio, age, gender)
   - Read candidate profiles from the `profiles` table, filtered by orientation
   - Batch candidates into groups (~10 at a time) to keep prompts manageable
   - For each batch, call Lovable AI Gateway (`google/gemini-3-flash-preview`) with tool calling to extract structured output: an array of `{ profile_id, score, reason }`
   - The prompt will instruct the model to score compatibility 0-100 based on: interest overlap (40%), personality/bio alignment (40%), age proximity (20%)
   - Merge results, sort by score descending, return top 50
   - Handle 429/402 errors gracefully

2. **Update `useMatchFetching` hook**
   - When user is authenticated, call the edge function instead of using mock data
   - Pass `user_id` and `orientation` to the function
   - If the edge function fails (network error, no auth, etc.), fall back to mock profiles as today
   - Map the returned data to the `Match` interface

3. **Update `supabase/config.toml`** — add the new function with `verify_jwt = false` (auth validated in code)

### Technical notes
- Uses `LOVABLE_API_KEY` (already configured) for the AI gateway
- Uses tool calling for structured JSON extraction (scores + reasons) — more reliable than asking for raw JSON
- The "reason" field is stored on each match but not displayed yet (future enhancement)
- Batching prevents token limit issues with 50+ profiles
- Mock data fallback ensures the app always works even without auth or if AI is unavailable

