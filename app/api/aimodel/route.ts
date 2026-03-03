import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// ─── Phase 1: Ask questions one at a time ─────────────────────────────────────
const QA_PROMPT = `
You are an AI Trip Planner. Collect trip info by asking ONE question at a time, but FIRST extract as much as possible from what the user already said.

Extraction targets:
- origin (starting point) e.g., "Japan"
- destination e.g., "Russia"
- group_size e.g., "2 people", "solo"
- budget e.g., "low", "moderate", "high", "luxury"
- days (number)
- special_requirements (free text)

Examples:
- "I am traveling Japan to Russia for 5 days" → origin=Japan, destination=Russia, days=5
- "Solo trip, moderate budget" → group_size=1, budget=Moderate

Flow:
1) Parse the latest user message and conversation to fill any missing fields automatically.
2) Ask only for the NEXT missing field in this sequence:
   source → destination → groupSize → budget → days → final (special requirements)
3) If all fields are known, set ui="generate".
4) If the user's message is general chat, answer briefly and set ui="final".

Rules:
- Keep responses short and friendly.
- Return ONLY valid JSON.

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
        "hotel_image_url": "",
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
- Set hotel_image_url to an empty string; images will be resolved separately.
- Generate a day-by-day itinerary for the number of days the user said.
- Each day should have 3–5 activities with realistic place names for the destination.
- Make ticket_pricing and time realistic.
- duration should be formatted as "X Days".
- group_size should reflect what the user said.
`

type Msg = { role: "user" | "assistant"; content: string }

function extractFromText(text: string) {
  const lower = text.toLowerCase()
  const out: {
    origin?: string; destination?: string; group_size?: number; budget?: string; days?: number; special_requirements?: string
  } = {}
  const mFromTo = text.match(/(?:from\s+)?([A-Za-z][\w\s.&'-]+?)\s+to\s+([A-Za-z][\w\s.&'-]+?)(?:[\s,.]|$)/i)
  if (mFromTo) { out.origin = mFromTo[1].trim(); out.destination = mFromTo[2].trim() }
  else {
    const mToOnly = text.match(/([A-Za-z][\w\s.&'-]+?)\s+to\s+([A-Za-z][\w\s.&'-]+?)(?:[\s,.]|$)/i)
    if (mToOnly) { out.origin = mToOnly[1].trim(); out.destination = mToOnly[2].trim() }
  }
  const mDays = lower.match(/(\d+)\s*(day|days)\b/); if (mDays) out.days = parseInt(mDays[1], 10)
  if (/\bsolo\b|\bjust me\b|\bonly me\b/.test(lower)) out.group_size = 1
  const mGroup = lower.match(/(\d+)\s*(people|persons|ppl|members)\b/); if (mGroup) out.group_size = parseInt(mGroup[1], 10)
  if (/\blow\b/.test(lower)) out.budget = "Low"
  else if (/\bmoderate\b|\bmedium\b/.test(lower)) out.budget = "Moderate"
  else if (/\bhigh\b/.test(lower)) out.budget = "High"
  else if (/\bluxury\b|\bpremium\b/.test(lower)) out.budget = "Luxury"
  const mReq = text.match(/requirements?:\s*(.+)$/i); if (mReq) out.special_requirements = mReq[1].trim()
  return out
}

function mergeExtracted(messages: Msg[]) {
  const out: any = {}
  for (const m of messages) Object.assign(out, extractFromText(m.content))
  return out as {
    origin?: string; destination?: string; group_size?: number; budget?: string; days?: number; special_requirements?: string
  }
}

function nextMissingUi(e: ReturnType<typeof mergeExtracted>) {
  if (!e.origin) return "source"
  if (!e.destination) return "destination"
  if (typeof e.group_size !== "number") return "groupSize"
  if (!e.budget) return "budget"
  if (typeof e.days !== "number") return "days"
  if (!e.special_requirements) return "final"
  return "generate"
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as { messages: Msg[] }

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
  } catch {
    const last = messages[messages.length - 1]?.content.toLowerCase() ?? ""
    const isSuggest =
      /\bsuggest\b|\brecommend\b|\binspire\b|\bideas\b|\badventure\b|\bwhere should i go\b/.test(last)
    if (isSuggest) {
      const list = [
        "Costa Rica (volcanoes, rainforests, rafting)",
        "Bali (surf, waterfalls, jungle hikes)",
        "Iceland (glaciers, lava fields, northern lights)",
        "Nepal (trekking in the Himalayas)",
        "New Zealand (alpine hikes, bungee, fjords)"
      ]
      return NextResponse.json({ resp: `Here are adventure picks:\n- ${list.join("\n- ")}`, ui: "final" })
    }
    const e = mergeExtracted(messages)
    const ui = nextMissingUi(e)
    const prompts: Record<string, string> = {
      source: "Where are you starting from?",
      destination: "Where are you traveling to?",
      groupSize: "How many people are in your group?",
      budget: "What’s your budget (Low/Moderate/High/Luxury)?",
      days: "How many days are you planning to stay?",
      final: "Any special requirements (dietary, mobility, interests)?",
    }
    if (ui === "generate") {
      const duration = typeof e.days === "number" ? `${e.days} Days` : "3 Days"
      const gs = typeof e.group_size === "number" ? (e.group_size === 1 ? "Solo" : `Group of ${e.group_size}`) : "Group of 2"
      const budget = e.budget ?? "Moderate"
      const dest = e.destination ?? "Destination"
      const origin = e.origin ?? "Origin"
      const activities = [
        { place_name: `Explore ${dest} Center`, place_address: `${dest}`, ticket_pricing: "Free", time_travel_each_location: "2 hours", best_time_to_visit: "9 AM – 11 AM" },
        { place_name: `Iconic spot in ${dest}`, place_address: `${dest}`, ticket_pricing: "₹200", time_travel_each_location: "1.5 hours", best_time_to_visit: "1 PM – 2 PM" },
      ]
      return NextResponse.json({
        ui: "final",
        trip_plan: {
          origin,
          destination: dest,
          duration,
          group_size: gs,
          budget,
          hotels: [
            { hotel_name: `Central ${dest} Stay`, hotel_address: `${dest}`, hotel_image_url: "", price_per_night: "₹3,500", rating: "4.3 / 5" },
            { hotel_name: `${dest} Comfort Inn`, hotel_address: `${dest}`, hotel_image_url: "", price_per_night: "₹3,000", rating: "4.1 / 5" },
          ],
          itinerary: [
            { day: 1, day_plan: "Arrival & Local Exploration", best_time_to_visit_day: "Morning", activities },
            { day: 2, day_plan: "Highlights & Culture", best_time_to_visit_day: "Afternoon", activities },
          ],
        },
      })
    }
    return NextResponse.json({ resp: prompts[ui], ui })
  }
}
