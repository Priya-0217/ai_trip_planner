"use client"

import React, { useState, useEffect, useRef } from "react"
import { Bot, User, Send, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"

import Empty from "./empty"
import GroupSizeUi from "./groupsizeui"
import BudgetUi from "./BudgetUi"
import DaysUi from "./daysui"

type Message = {
  role: "user" | "assistant"
  content: string
  ui?: string
}

type ChatBoxProps = {
  setTripData: (data: any) => void
}

const loadingMessages = [
  "✨ Planning your dream trip...",
  "🗺️ Exploring destinations...",
  "🎒 Packing the best spots...",
  "🌍 Finding hidden gems...",
  "✈️ Mapping your adventure...",
  "🎨 Crafting your itinerary...",
]

/* ─── Animated floating blobs ─── */
const BgBlobs = ({ dark }: { dark: boolean }) => {
  if (!dark) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div style={{ position:"absolute", top:"-18%", left:"-12%", width:520, height:520, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(251,146,60,.38) 0%, transparent 68%)", filter:"blur(42px)",
          animation:"drift1 18s ease-in-out infinite alternate" }} />
        <div style={{ position:"absolute", top:"28%", left:"20%", width:440, height:440, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(167,139,250,.32) 0%, transparent 68%)", filter:"blur(52px)",
          animation:"drift2 22s ease-in-out infinite alternate" }} />
        <div style={{ position:"absolute", bottom:"-12%", right:"-10%", width:480, height:480, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(56,189,248,.30) 0%, transparent 68%)", filter:"blur(46px)",
          animation:"drift3 20s ease-in-out infinite alternate" }} />
        <div style={{ position:"absolute", bottom:"8%", left:"-6%", width:320, height:320, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(52,211,153,.24) 0%, transparent 68%)", filter:"blur(36px)",
          animation:"drift1 25s ease-in-out infinite alternate-reverse" }} />
      </div>
    )
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div style={{ position:"absolute", top:"-22%", left:"8%", width:540, height:540, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(99,102,241,.28) 0%, transparent 68%)", filter:"blur(56px)",
        animation:"drift2 20s ease-in-out infinite alternate" }} />
      <div style={{ position:"absolute", bottom:"-18%", left:"-12%", width:500, height:500, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(16,185,129,.22) 0%, transparent 68%)", filter:"blur(52px)",
        animation:"drift3 24s ease-in-out infinite alternate" }} />
      <div style={{ position:"absolute", top:"38%", right:"-14%", width:420, height:420, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(244,63,94,.20) 0%, transparent 68%)", filter:"blur(46px)",
        animation:"drift1 19s ease-in-out infinite alternate-reverse" }} />
      <div style={{ position:"absolute", top:"-6%", right:"-6%", width:340, height:340, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(139,92,246,.24) 0%, transparent 68%)", filter:"blur(42px)",
        animation:"drift2 21s ease-in-out infinite alternate" }} />
    </div>
  )
}

/* ─── AI bubble styles (frosted teal) ─── */
const aiBubbleLight: React.CSSProperties = {
  background: "rgba(204,251,252,0.52)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(103,232,249,0.42)",
  boxShadow: "0 2px 12px rgba(6,182,212,0.10)"
}

const aiBubbleDark: React.CSSProperties = {
  background: "rgba(21,55,65,0.68)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(103,232,249,0.25)",
  boxShadow: "0 2px 12px rgba(6,182,212,0.15)"
}

/* ─── Input bar styles (frosted) ─── */
const inputBarLight: React.CSSProperties = {
  background: "rgba(255,255,255,0.58)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(167,139,250,0.28)",
  boxShadow: "0 8px 30px rgba(167,139,250,0.13)"
}

const inputBarDark: React.CSSProperties = {
  background: "rgba(22,27,34,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(99,102,241,0.25)",
  boxShadow: "0 8px 30px rgba(99,102,241,0.14)"
}

export default function ChatBox({ setTripData }: ChatBoxProps) {
  const [messages, setMessages]           = useState<Message[]>([])
  const [userInput, setUserInput]         = useState("")
  const [isLoading, setIsLoading]         = useState(false)
  const [loadingText, setLoadingText]     = useState(loadingMessages[0])
  const [renderedUiIds, setRenderedUiIds] = useState<Set<number>>(new Set())
  const [tripGenerated, setTripGenerated] = useState(false)
  const [dark, setDark]                   = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  /* detect dark class on <html> */
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  /* auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  /* ─── send ─── */
  const onSend = async (input?: string) => {
    const text = input ?? userInput
    if (!text.trim() || isLoading || tripGenerated) return

    const userMsg: Message  = { role: "user", content: text }
    const updatedMessages   = [...messages, userMsg]
    setMessages(updatedMessages)
    setUserInput("")
    setIsLoading(true)

    const interval = setInterval(() => {
      setLoadingText(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, 1500)

    try {
      const res  = await axios.post("/api/aimodel", { messages: updatedMessages })
      const data = res.data

      if (data?.ui === "final" && data?.trip_plan) {
        setTripData(data.trip_plan)
        setTripGenerated(true)
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "✅ Your trip plan is ready! Check the details on the right 👉",
          ui: "final"
        }])
        return
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data?.resp || "Sorry, I couldn't respond.",
        ui: data?.ui
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ AI failed to respond. Please try again later.",
        ui: "final"
      }])
    } finally {
      clearInterval(interval)
      setIsLoading(false)
    }
  }

  /* ─── generative UI ─── */
  const handleUiSelect = (idx: number, value: string) => {
    setRenderedUiIds(prev => new Set([...prev, idx]))
    onSend(value)
  }

  const RenderGenerativeUi = (ui: string | undefined, idx: number) => {
    if (!ui || ui === "final" || ui === "generate" || isLoading || renderedUiIds.has(idx))
      return null
    if (ui === "groupSize") return <GroupSizeUi onSelectedOption={(v: string) => handleUiSelect(idx, v)} />
    if (ui === "budget")    return <BudgetUi onSelect={v => handleUiSelect(idx, v)} />
    if (ui === "days")      return <DaysUi onSelect={v => handleUiSelect(idx, v.toString())} />
    return null
  }

  /* ─── render ─── */
  return (
    <>
      <style>{`
        @keyframes drift1 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(58px,-42px) scale(1.07)} }
        @keyframes drift2 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(-48px,52px) scale(1.06)} }
        @keyframes drift3 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(42px,54px) scale(1.09)} }

        .chat-scroll::-webkit-scrollbar             { width:6px }
        .chat-scroll::-webkit-scrollbar-track       { background:transparent }
        .chat-scroll::-webkit-scrollbar-thumb       { background:rgba(167,139,250,.30); border-radius:3px }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background:rgba(167,139,250,.50) }
        .dark .chat-scroll::-webkit-scrollbar-thumb       { background:rgba(99,102,241,.28) }
        .dark .chat-scroll::-webkit-scrollbar-thumb:hover { background:rgba(99,102,241,.48) }
      `}</style>

      <section
        className="relative h-screen flex flex-col overflow-hidden"
        style={{ background: dark ? "#0e1117" : "#faf5ff" }}
      >
        {/* animated blobs */}
        <BgBlobs dark={dark} />

        {/* ── messages ── */}
        <div className="chat-scroll relative z-10 flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-2xl mx-auto w-full">
            {messages.length === 0 ? (
              <Empty onSelect={t => setUserInput(t)} />
            ) : (
              <div className="space-y-5">
                {messages.map((msg, i) => (
                  <div key={i}>
                    <div className={`flex gap-3 items-end ${msg.role === "user" ? "flex-row-reverse" : ""}`}>

                      {/* avatar */}
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md"
                        style={{
                          background: msg.role === "user"
                            ? "linear-gradient(135deg,#ec4899,#a855f7)"
                            : "linear-gradient(135deg,#06b6d4,#14b8a6)"
                        }}
                      >
                        {msg.role === "assistant" ? <Bot size={17} /> : <User size={17} />}
                      </div>

                      {/* bubble */}
                      <div
                        className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed
                          ${msg.role === "user" ? "rounded-br-sm text-white" : "rounded-bl-sm"}
                          ${msg.role !== "user" ? (dark ? "text-gray-100" : "text-gray-800") : ""}`}
                        style={
                          msg.role === "user"
                            ? { background:"linear-gradient(135deg,#ec4899,#a855f7)", boxShadow:"0 2px 10px rgba(168,85,247,.25)" }
                            : (dark ? aiBubbleDark : aiBubbleLight)
                        }
                      >
                        {msg.content}
                      </div>
                    </div>

                    {/* generative UI */}
                    {msg.role === "assistant" && (
                      <div className="ml-12 mt-2">{RenderGenerativeUi(msg.ui, i)}</div>
                    )}
                  </div>
                ))}

                {/* loading bubble */}
                {isLoading && (
                  <div className="flex gap-3 items-end">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md"
                      style={{ background:"linear-gradient(135deg,#06b6d4,#14b8a6)" }}
                    >
                      <Loader2 size={17} className="animate-spin" />
                    </div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm flex items-center gap-3 ${dark ? "text-gray-300" : "text-gray-600"}`}
                      style={dark ? aiBubbleDark : aiBubbleLight}
                    >
                      <span className="flex gap-1.5 items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" style={{ animation:"pulse-dot 1.4s ease infinite" }} />
                        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" style={{ animation:"pulse-dot 1.4s ease infinite 0.2s" }} />
                        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" style={{ animation:"pulse-dot 1.4s ease infinite 0.4s" }} />
                      </span>
                      {loadingText}
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>

        {/* ── input bar ── */}
        <div className="relative z-10 px-4 pb-5 pt-2">
          <div className="max-w-2xl mx-auto rounded-2xl p-3 flex items-end gap-3" style={dark ? inputBarDark : inputBarLight}>
            {tripGenerated ? (
              <p className={`w-full text-center text-sm py-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                🎉 Trip planning complete! Refresh to plan a new trip.
              </p>
            ) : (
              <>
                <Textarea
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend() } }}
                  placeholder="Ask me about your trip…"
                  disabled={isLoading}
                  rows={1}
                  className={`flex-1 resize-none bg-transparent border-0 shadow-none focus-visible:ring-0
                    text-sm leading-relaxed min-h-0
                    ${dark ? "text-gray-100 placeholder-gray-500" : "text-gray-800 placeholder-gray-400"}`}
                  style={{ outline:"none" }}
                />
                <button
                  onClick={() => onSend()}
                  disabled={isLoading || !userInput.trim()}
                  className="flex-shrink-0 w-10 h-10 rounded-xl text-white flex items-center justify-center
                             shadow-md transition-all duration-200 disabled:opacity-35 hover:scale-105 active:scale-95"
                  style={{ background:"linear-gradient(135deg,#06b6d4,#14b8a6)", boxShadow:"0 2px 10px rgba(6,182,212,.35)" }}
                >
                  <Send size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}