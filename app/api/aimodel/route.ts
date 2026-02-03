import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// ─── Phase 1: Ask questions one at a time ─────────────────────────────────────
const QA_PROMPT = `
You are an AI Trip Planner. Your job is to collect trip info by asking ONE question at a time.

ORDER (strictly follow this sequence):
1. Ask: "Where are you starting from?" → ui: "source"
2. Ask: "Where are you traveling to?" → ui: "destination"
3. Ask: "How many people in your group?" → ui: "groupSize"
4. Ask: "What's your budget?" → ui: "budget"
5. Ask: "How many days?" → ui: "days"
6. Ask: "Any special requirements (dietary, mobility, interests)?" → ui: "final"

RULES:
- Look at the conversation history. Figure out which questions have ALREADY been answered.
- Ask the NEXT unanswered question only.
- If ALL 6 questions have been answered, set ui = "generate".
- If the user asks a casual travel question (not related to planning), answer it and set ui = "final". Do NOT advance the flow.
- Keep responses short and friendly.
- Return ONLY valid JSON. No markdown. No extra text.

JSON FORMAT:
{
  "resp": "Your message to the user",
  "ui": "source | destination | groupSize | budget | days | final | generate"
}
`

// ─── Phase 2: Generate the full structured trip plan ──────────────────────────
const GENERATE_PROMPT = `
You are a travel expert. Based on the conversation below, generate a COMPLETE trip plan.

Return ONLY a valid JSON object with this EXACT structure (no markdown, no extra text):

{
  "ui": "final",
  "trip_plan": {
    "origin": "string",
    "destination": "string",
    "duration": "e.g. 3 Days",
    "group_size": "e.g. Family of 4",
    "budget": "e.g. Moderate",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "hotel_image_url": "https://images.unsplash.com/photo-1506904925346-21bda4d32df4?w=200&q=80",
        "price_per_night": "e.g. ₹3,500",
        "rating": "e.g. 4.2 / 5"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "Arrival & Local Exploration",
        "best_time_to_visit_day": "e.g. Morning",
        "activities": [
          {
            "place_name": "string",
            "place_address": "string",
            "ticket_pricing": "e.g. ₹200",
            "time_travel_each_location": "e.g. 2 hours",
            "best_time_to_visit": "e.g. 9 AM – 11 AM"
          }
        ]
      }
    ]
  }
}

RULES:
- Generate 2–3 realistic hotels that match the budget.
- For hotel_image_url use these real Unsplash URLs based on budget:
    Low:      https://images.unsplash.com/photo-1555769532-433536d04907?w=200&q=80
    Moderate: https://images.unsplash.com/photo-1506904925346-21bda4d32df4?w=200&q=80
    High:     https://images.unsplash.com/photo-1551882372-43511094a093?w=200&q=80
    Luxury:   https://images.unsplash.com/photo-1535591946-8adbea526327?w=200&q=80
- Generate a day-by-day itinerary for the number of days the user said.
- Each day should have 3–5 activities with realistic place names for the destination.
- Make ticket_pricing and time realistic.
- duration should be formatted as "X Days".
- group_size should reflect what the user said.
`

// ─── Utility: check if the QA phase said "generate" ───────────────────────────
function extractAnsweredFields(messages: Array<{ role: string; content: string }>): {
  hasSource: boolean
  hasDestination: boolean
  hasGroupSize: boolean
  hasBudget: boolean
  hasDays: boolean
  hasSpecial: boolean
} {
  // Simple heuristic: count user messages after each bot question keyword
  const userMessages = messages.filter(m => m.role === "user").map(m => m.content.toLowerCase())
  // We rely on the LLM's own "generate" signal instead of manual parsing
  return {
    hasSource: userMessages.length >= 1,
    hasDestination: userMessages.length >= 2,
    hasGroupSize: userMessages.length >= 3,
    hasBudget: userMessages.length >= 4,
    hasDays: userMessages.length >= 5,
    hasSpecial: userMessages.length >= 6,
  }
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  try {
    // ── Step 1: Run QA prompt to decide next action ───────────────────────────
    const qaResponse = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: QA_PROMPT },
        ...messages,
      ],
    })

    const qaResult = JSON.parse(qaResponse.choices[0].message.content ?? "{}")

    // ── Step 2: If QA says "generate", run the trip generation prompt ─────────
    if (qaResult.ui === "generate") {
      const generateResponse = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: GENERATE_PROMPT },
          {
            role: "user",
            content: `Here is the planning conversation:\n\n${messages
              .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
              .join("\n")}\n\nGenerate the full trip plan now.`,
          },
        ],
      })

      const tripResult = JSON.parse(generateResponse.choices[0].message.content ?? "{}")
      return NextResponse.json(tripResult)
    }

    // ── Step 3: Otherwise return the normal QA response ───────────────────────
    return NextResponse.json(qaResult)
  } catch (e: any) {
    console.error("API Error:", e)
    return NextResponse.json(
      { resp: "⚠️ Something went wrong. Please try again.", ui: "final" },
      { status: 500 }
    )
  }
}