import { NextRequest, NextResponse } from "next/server"
import { OpenRouter } from "@openrouter/sdk";

 import OpenAI from "openai"
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  
})


const SYSTEM_PROMPT = `
You are an AI Trip Planner and Travel Assistant.

You can:
- Plan trips step by step
- Answer casual travel questions (hotels, food, places, inspiration)

PLANNING FLOW (ask ONE question at a time in this order):
1. Starting location
2. Destination
3. Group size
4. Budget
5. Days
6. Interests
7. Special requirements

CASUAL QUESTIONS:
- Answer immediately
- Do NOT advance planning
- Set ui = "final"

STYLE RULES:
- Short responses
- Bullet points or numbered lists
- Clean and readable
- No long paragraphs

CRITICAL RULES:
- Ask ONLY one question at a time
- ALWAYS return ONLY valid JSON
- NO markdown
- NO extra text

Allowed ui values:
- source
- destination
- groupSize
- budget
- days
- interests
- final

JSON FORMAT:
{
  "resp": "Text shown to user",
  "ui": "source | destination | groupSize | budget | days | interests | final"
}
`

export async function POST(req: NextRequest) {
    const { messages } = await req.json();
try{
   const completion = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b:free",
    response_format: { type: "json_object" },
    messages: [
      { role: "system",
        content: SYSTEM_PROMPT
       },
       ...messages
    ],
  })
  console.log(completion.choices[0].message)
  const message = completion.choices[0].message;
   return NextResponse.json(JSON.parse(message.content??''));
  }
  catch(e){
    return NextResponse.json(e);
  }
  
}
   