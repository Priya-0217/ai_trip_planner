"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, User, Send, Loader2, Sparkles, Compass } from "lucide-react"
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

const loadingMessages = [
  "✨ Planning your dream trip...",
  "🗺️ Exploring destinations...",
  "🎒 Packing the best spots...",
  "🌍 Finding hidden gems...",
  "✈️ Mapping your adventure...",
  "🎨 Crafting your itinerary...",
]

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState(loadingMessages[0])
  const [renderedUiIds, setRenderedUiIds] = useState<Set<number>>(new Set())
  const [isDark, setIsDark] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  /* Detect dark mode from system/parent */
  useEffect(() => {
    // Check if dark mode class exists on html or body
    const checkDarkMode = () => {
      const htmlElement = document.documentElement
      const bodyElement = document.body
      const isDarkMode =
        htmlElement.classList.contains("dark") ||
        bodyElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDark(isDarkMode)
    }

    checkDarkMode()

    // Listen for changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => checkDarkMode()
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  /* Send Message */
  const onSend = async (input?: string) => {
    const text = input ?? userInput
    if (!text.trim()) return

    const userMsg: Message = { role: "user", content: text }
    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    setUserInput("")
    setIsLoading(true)

    const interval = setInterval(() => {
      setLoadingText(
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
      )
    }, 1500)

    try {
      const res = await axios.post("/api/aimodel", {
        messages: updatedMessages,
      })

      const newMessage = {
        role: "assistant" as const,
        content: res.data?.resp || "Sorry, I couldn't respond.",
        ui: res.data?.ui || "final",
      }

      setMessages(prev => [...prev, newMessage])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ AI failed to respond. Please try again later.",
          ui: "final",
        },
      ])
    } finally {
      clearInterval(interval)
      setIsLoading(false)
    }
  }

  /* Handle UI Selection */
  const handleUiSelect = (messageIndex: number, value: string) => {
    setRenderedUiIds(prev => new Set([...prev, messageIndex]))
    onSend(value)
  }

  /* Generative UI Renderer */
  const RenderGenerativeUi = (ui: string | undefined, messageIndex: number) => {
    if (!ui || ui === "final" || isLoading || renderedUiIds.has(messageIndex)) {
      return null
    }

    if (ui === "groupSize") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <GroupSizeUi
            onSelectedOption={(v: string) => handleUiSelect(messageIndex, v)}
          />
        </motion.div>
      )
    }

    if (ui === "budget") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <BudgetUi onSelect={(v: string) => handleUiSelect(messageIndex, v)} />
        </motion.div>
      )
    }

    if (ui === "days") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <DaysUi
            onSelect={(v: number) => handleUiSelect(messageIndex, v.toString())}
          />
        </motion.div>
      )
    }

    return null
  }

  return (
    <section
      className={`relative min-h-screen flex flex-col transition-colors duration-500 ${
        isDark ? "bg-slate-900" : "bg-amber-50"
      }`}
    >
      {/* Light Mode - Vintage Travel Map Background */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Vintage paper texture */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  rgba(139, 92, 46, 0.03) 0px,
                  transparent 1px,
                  transparent 2px,
                  rgba(139, 92, 46, 0.03) 3px
                ),
                repeating-linear-gradient(
                  90deg,
                  rgba(139, 92, 46, 0.03) 0px,
                  transparent 1px,
                  transparent 2px,
                  rgba(139, 92, 46, 0.03) 3px
                )
              `,
            }}
          />

          {/* Compass decorations */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-32 h-32 opacity-5"
          >
            <Compass className="w-full h-full text-amber-900" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-20 w-40 h-40 opacity-5"
          >
            <Compass className="w-full h-full text-amber-900" />
          </motion.div>

          {/* Vintage map lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern
                id="map-grid"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="40" cy="40" r="1" fill="#8B5C2E" />
                <line x1="0" y1="40" x2="80" y2="40" stroke="#8B5C2E" strokeWidth="0.5" strokeDasharray="5,5" />
                <line x1="40" y1="0" x2="40" y2="80" stroke="#8B5C2E" strokeWidth="0.5" strokeDasharray="5,5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>

          {/* Postage stamps */}
          <div className="absolute top-10 left-10 w-20 h-24 border-4 border-dashed border-amber-800/20 rotate-12" />
          <div className="absolute top-32 right-32 w-16 h-20 border-4 border-dashed border-amber-800/20 -rotate-6" />
          <div className="absolute bottom-40 left-40 w-24 h-20 border-4 border-dashed border-amber-800/20 rotate-3" />
        </div>
      )}

      {/* Dark Mode - Night Sky with Stars */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Starfield */}
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-1 h-1 bg-blue-100 rounded-full"
              style={{
                boxShadow: "0 0 4px rgba(255,255,255,0.8)",
              }}
            />
          ))}

          {/* Constellations */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <line x1="10%" y1="20%" x2="15%" y2="25%" stroke="#93C5FD" strokeWidth="1" />
            <line x1="15%" y1="25%" x2="20%" y2="22%" stroke="#93C5FD" strokeWidth="1" />
            <line x1="20%" y1="22%" x2="18%" y2="15%" stroke="#93C5FD" strokeWidth="1" />
            <circle cx="10%" cy="20%" r="2" fill="#93C5FD" />
            <circle cx="15%" cy="25%" r="2" fill="#93C5FD" />
            <circle cx="20%" cy="22%" r="2" fill="#93C5FD" />
            <circle cx="18%" cy="15%" r="2" fill="#93C5FD" />

            <line x1="80%" y1="30%" x2="85%" y2="35%" stroke="#93C5FD" strokeWidth="1" />
            <line x1="85%" y1="35%" x2="88%" y2="32%" stroke="#93C5FD" strokeWidth="1" />
            <circle cx="80%" cy="30%" r="2" fill="#93C5FD" />
            <circle cx="85%" cy="35%" r="2" fill="#93C5FD" />
            <circle cx="88%" cy="32%" r="2" fill="#93C5FD" />
          </svg>

          {/* Moon */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-20 w-24 h-24 bg-yellow-100 rounded-full opacity-80"
            style={{
              boxShadow: "0 0 60px rgba(254, 243, 199, 0.6)",
            }}
          >
            {/* Moon craters */}
            <div className="absolute top-4 left-6 w-6 h-6 bg-yellow-200/50 rounded-full" />
            <div className="absolute bottom-6 right-8 w-4 h-4 bg-yellow-200/50 rounded-full" />
            <div className="absolute top-12 right-4 w-5 h-5 bg-yellow-200/50 rounded-full" />
          </motion.div>
        </div>
      )}

      {/* Messages Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 overflow-y-auto px-6 py-12">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Empty onSelect={t => setUserInput(t)} />
          </motion.div>
        ) : (
          <div className="space-y-8 pb-4">
            {messages.map((msg, i) => {
              const isLast = i === messages.length - 1
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    type: "spring",
                    damping: 25,
                  }}
                >
                  <div
                    className={`flex items-start gap-4 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: isDark ? -5 : 5 }}
                      className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                        msg.role === "assistant"
                          ? isDark
                            ? "bg-linear-to-br from-blue-600 to-indigo-700 border-2 border-blue-400/30"
                            : "bg-linear-to-br from-amber-500 to-orange-600 border-2 border-amber-300"
                          : isDark
                          ? "bg-linear-to-br from-purple-600 to-pink-600 border-2 border-purple-400/30"
                          : "bg-linear-to-br from-red-500 to-rose-600 border-2 border-red-300"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <Bot className="h-6 w-6 text-white" />
                      ) : (
                        <User className="h-6 w-6 text-white" />
                      )}
                    </motion.div>

                    {/* Message Bubble */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`max-w-[70%] px-6 py-4 rounded-3xl shadow-lg transition-all ${
                        msg.role === "user"
                          ? isDark
                            ? "bg-linear-to-br from-purple-600 to-pink-600 text-white border-2 border-purple-400/30"
                            : "bg-linear-to-br from-red-500 to-rose-600 text-white border-2 border-red-300"
                          : isDark
                          ? "bg-slate-800 text-slate-100 border-2 border-slate-700"
                          : "bg-white text-amber-950 border-2 border-amber-200"
                      }`}
                      style={{
                        boxShadow: isDark
                          ? msg.role === "user"
                            ? "0 8px 32px rgba(168, 85, 247, 0.4)"
                            : "0 8px 32px rgba(0, 0, 0, 0.6)"
                          : msg.role === "user"
                          ? "0 8px 32px rgba(239, 68, 68, 0.3)"
                          : "0 8px 32px rgba(217, 119, 6, 0.2)",
                      }}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </motion.div>
                  </div>

                  {/* Render UI component */}
                  <AnimatePresence mode="wait">
                    {msg.role === "assistant" && isLast && (
                      <div className="ml-16 mt-4">
                        {RenderGenerativeUi(msg.ui, i)}
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    isDark
                      ? "bg-linear-to-br from-blue-600 to-indigo-700 border-2 border-blue-400/30"
                      : "bg-linear-to-br from-amber-500 to-orange-600 border-2 border-amber-300"
                  }`}
                >
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`px-6 py-4 rounded-3xl shadow-lg flex items-center gap-3 ${
                    isDark
                      ? "bg-slate-800 text-slate-100 border-2 border-slate-700"
                      : "bg-white text-amber-950 border-2 border-amber-200"
                  }`}
                >
                  <Loader2
                    className={`h-5 w-5 animate-spin ${
                      isDark ? "text-blue-400" : "text-amber-600"
                    }`}
                  />
                  <span className="text-sm">{loadingText}</span>
                  <Sparkles
                    className={`h-4 w-4 animate-pulse ${
                      isDark ? "text-yellow-300" : "text-amber-500"
                    }`}
                  />
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-8 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative rounded-3xl shadow-2xl overflow-hidden transition-all ${
            isDark
              ? "bg-slate-800 border-2 border-slate-700"
              : "bg-white border-2 border-amber-200"
          }`}
          style={{
            boxShadow: isDark
              ? "0 20px 60px rgba(0, 0, 0, 0.8)"
              : "0 20px 60px rgba(217, 119, 6, 0.3)",
          }}
        >
          <Textarea
            placeholder={
              isDark
                ? "🌙 Where shall we explore tonight?"
                : "☀️ Ready for your next adventure?"
            }
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            disabled={isLoading}
            className={`min-h-30 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none pr-20 pt-6 pb-6 text-base transition-colors ${
              isDark
                ? "bg-transparent text-slate-100 placeholder:text-slate-500"
                : "bg-transparent text-amber-950 placeholder:text-amber-600/50"
            }`}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
          />

          <motion.button
            onClick={() => onSend()}
            disabled={!userInput.trim() || isLoading}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute bottom-5 right-5 h-14 w-14 rounded-2xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg ${
              isDark
                ? "bg-linear-to-br from-blue-600 to-indigo-700 border-2 border-blue-400/30"
                : "bg-linear-to-br from-amber-500 to-orange-600 border-2 border-amber-300"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <Send className="h-6 w-6 text-white" />
            )}
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-center text-xs mt-4 transition-colors ${
            isDark ? "text-slate-500" : "text-amber-700"
          }`}
        >
          Press Enter to send • Shift + Enter for new line
        </motion.p>
      </div>
    </section>
  )
}