import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileError || !userProfile) {
      return new Response(
        JSON.stringify({ error: "User profile not found", matches: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch candidate profiles filtered by orientation
    const orientation = userProfile.orientation || "everyone";
    let query = supabase.from("profiles").select("*").limit(50);

    if (orientation === "women") {
      query = query.eq("gender", "female");
    } else if (orientation === "men") {
      query = query.eq("gender", "male");
    }

    const { data: candidates, error: candidatesError } = await query;

    if (candidatesError || !candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({ error: "No candidates found", matches: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Gemini to score compatibility
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const candidateSummaries = candidates.map((c, i) => ({
      index: i,
      user_id: c.user_id,
      name: c.name,
      age: c.age,
      interests: c.interests,
      bio: c.bio,
    }));

    const prompt = `You are a matchmaking compatibility scorer. Given a user profile and a list of candidate profiles, score each candidate's compatibility with the user from 0 to 100.

Scoring weights:
- Interest overlap: 40%
- Personality/bio alignment: 40%  
- Age proximity: 20%

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Interests: ${JSON.stringify(userProfile.interests || [])}
- Bio: ${userProfile.bio || "No bio provided"}

CANDIDATES:
${JSON.stringify(candidateSummaries)}

Return ONLY valid JSON (no markdown). Use this exact format - an array of objects:
[{"user_id": "...", "compatibility_score": 85}, ...]

Include ALL candidates. Sort by compatibility_score descending.`;

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a JSON-only response bot. Return only valid JSON arrays, no markdown or explanation." },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content || "[]";
    
    // Parse AI response - strip markdown fences if present
    let scores: Array<{ user_id: string; compatibility_score: number }>;
    try {
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      scores = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI scores:", rawContent);
      // Fallback: assign random scores
      scores = candidates.map((c) => ({
        user_id: c.user_id,
        compatibility_score: Math.floor(Math.random() * 40) + 60,
      }));
    }

    // Merge scores with profile data
    const scoreMap = new Map(scores.map((s) => [s.user_id, s.compatibility_score]));

    const matches = candidates
      .map((c) => ({
        id: c.user_id,
        name: c.name,
        age: c.age,
        avatar: c.avatar,
        compatibility: scoreMap.get(c.user_id) ?? 50,
        interests: c.interests || [],
        lastActive: c.last_active || "Just now",
        bio: c.bio || "",
      }))
      .sort((a, b) => b.compatibility - a.compatibility);

    return new Response(JSON.stringify({ matches }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("matchmaking error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", matches: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
