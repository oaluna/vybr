import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BATCH_SIZE = 10;

interface CandidateProfile {
  user_id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  gender: string;
  avatar: string;
  last_active: string;
}

interface ScoredMatch {
  profile_id: string;
  score: number;
  reason: string;
}

async function scoreBatch(
  userProfile: { name: string; age: number; bio: string; interests: string[]; gender: string },
  candidates: CandidateProfile[],
  apiKey: string
): Promise<ScoredMatch[]> {
  const candidateList = candidates
    .map(
      (c, i) =>
        `${i + 1}. ID: ${c.user_id} | Name: ${c.name} | Age: ${c.age} | Gender: ${c.gender} | Interests: [${c.interests.join(", ")}] | Bio: "${c.bio}"`
    )
    .join("\n");

  const systemPrompt = `You are a matchmaking compatibility engine. Score each candidate's compatibility with the user on a 0-100 scale using these weights:
- Interest overlap (40%): shared hobbies, passions, activities
- Personality/bio alignment (40%): complementary or similar personality traits, values, lifestyle
- Age proximity (20%): closer ages score higher

Be nuanced — don't just count shared interests. Consider depth of compatibility.`;

  const userPrompt = `## User Profile
Name: ${userProfile.name} | Age: ${userProfile.age} | Gender: ${userProfile.gender}
Interests: [${userProfile.interests.join(", ")}]
Bio: "${userProfile.bio}"

## Candidates
${candidateList}

Score every candidate. Return results using the tool provided.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "submit_scores",
            description: "Submit compatibility scores for all candidates.",
            parameters: {
              type: "object",
              properties: {
                scores: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      profile_id: { type: "string", description: "The candidate's user_id" },
                      score: { type: "integer", description: "Compatibility score 0-100" },
                      reason: { type: "string", description: "Brief explanation of the score" },
                    },
                    required: ["profile_id", "score", "reason"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["scores"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "submit_scores" } },
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const text = await response.text();
    console.error(`AI gateway error (${status}):`, text);
    if (status === 429 || status === 402) {
      throw new Error(`AI_RATE_LIMIT_${status}`);
    }
    throw new Error(`AI gateway returned ${status}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    console.error("No tool call in AI response:", JSON.stringify(data));
    throw new Error("No tool call returned");
  }

  const args = JSON.parse(toolCall.function.arguments);
  return (args.scores || []) as ScoredMatch[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate
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

    const userId = claimsData.claims.sub as string;
    const { orientation } = await req.json();

    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("name, age, bio, interests, gender")
      .eq("user_id", userId)
      .single();

    if (profileError || !userProfile) {
      console.error("Error fetching user profile:", profileError);
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (userProfile.age < 18) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch candidate profiles
    let query = supabase
      .from("profiles")
      .select("user_id, name, age, bio, interests, gender, avatar, last_active")
      .limit(50);

    if (orientation === "women") {
      query = query.eq("gender", "female");
    } else if (orientation === "men") {
      query = query.eq("gender", "male");
    }

    const { data: candidates, error: candidateError } = await query;

    if (candidateError || !candidates || candidates.length === 0) {
      console.error("Error fetching candidates:", candidateError);
      return new Response(JSON.stringify({ error: "No candidates found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Batch and score
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allScores: ScoredMatch[] = [];
    const batches: CandidateProfile[][] = [];

    for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
      batches.push(candidates.slice(i, i + BATCH_SIZE) as CandidateProfile[]);
    }

    // Process batches concurrently (max 3 at a time to avoid rate limits)
    const concurrency = 3;
    for (let i = 0; i < batches.length; i += concurrency) {
      const chunk = batches.slice(i, i + concurrency);
      const results = await Promise.allSettled(
        chunk.map((batch) => scoreBatch(userProfile, batch, apiKey))
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          allScores.push(...result.value);
        } else {
          console.error("Batch scoring failed:", result.reason);
        }
      }
    }

    // Build response: merge scores with candidate data
    const scoreMap = new Map(allScores.map((s) => [s.profile_id, s]));

    const matches = candidates
      .map((c) => {
        const scored = scoreMap.get(c.user_id);
        return {
          id: c.user_id,
          name: c.name,
          age: c.age,
          avatar: c.avatar,
          compatibility: scored?.score ?? 50,
          interests: c.interests,
          lastActive: c.last_active,
          bio: c.bio,
          compatibilityReason: scored?.reason ?? "",
        };
      })
      .sort((a, b) => b.compatibility - a.compatibility);

    return new Response(JSON.stringify({ matches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("calculate-compatibility error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
