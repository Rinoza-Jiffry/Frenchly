'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ChatMessage from '@/components/ChatMessage'
import VoiceRecorder from '@/components/VoiceRecorder'

type Difficulty = 'beginner' | 'intermediate' | 'advanced'
type LivePhase = 'idle' | 'thinking' | 'speaking' | 'ready' | 'listening'

interface Message {
  role: 'user' | 'assistant'
  content: string
}


const STARTER_TOPICS = [
  { label: 'Introduce yourself', prompt: 'Bonjour! Je veux me présenter en français.' },
  { label: 'Order food', prompt: 'Je voudrais commander quelque chose dans un restaurant.' },
  { label: 'Ask for directions', prompt: 'Je cherche la Tour Eiffel, pouvez-vous m\'aider?' },
  { label: 'Talk about Sri Lanka', prompt: 'Je viens du Sri Lanka. Pouvez-vous me parler de la France?' },
  { label: 'Shopping', prompt: 'Je voudrais faire du shopping. Qu\'est-ce que vous recommandez?' },
]

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  // Live mode state
  const [liveMode, setLiveMode] = useState(false)
  const [livePhase, setLivePhase] = useState<LivePhase>('idle')
  const [interimText, setInterimText] = useState('')
  const [readyCountdown, setReadyCountdown] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Refs to track latest values inside async callbacks
  const liveModeRef = useRef(false)
  const livePhaseRef = useRef<LivePhase>('idle')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const sendMessageRef = useRef<((msg: Message, history: Message[]) => Promise<void>) | undefined>(undefined)

  useEffect(() => { liveModeRef.current = liveMode }, [liveMode])
  useEffect(() => { livePhaseRef.current = livePhase }, [livePhase])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Init speech recognition once
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionClass) return
    const rec = new SpeechRecognitionClass()
    rec.lang = 'fr-FR'
    rec.continuous = false
    rec.interimResults = true
    recognitionRef.current = rec
  }, [])

  // ── TTS: speak Pierre's message (French only, strips [EN: ...] tags) ──
  const speakPierre = useCallback((text: string, onDone?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { onDone?.(); return }
    window.speechSynthesis.cancel()

    const frenchOnly = text
      .replace(/\[EN:[^\]]+\]/g, ' ')
      .replace(/\[💡 Correction:[^\]]+\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!frenchOnly) { onDone?.(); return }

    const utterance = new SpeechSynthesisUtterance(frenchOnly)
    utterance.lang = 'fr-FR'
    utterance.rate = 0.85
    utterance.pitch = 1

    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const frVoice = voices.find(v => v.lang.startsWith('fr'))
      if (frVoice) utterance.voice = frVoice
      utterance.onend = () => onDone?.()
      utterance.onerror = () => onDone?.()
      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak()
    } else {
      window.speechSynthesis.onvoiceschanged = doSpeak
    }
  }, [])

  // ── Live listening: starts mic and calls onResult with final transcript ──
  const startLiveListening = useCallback((onResult: (text: string) => void) => {
    const rec = recognitionRef.current
    if (!rec) return

    setLivePhase('listening')
    setInterimText('')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setInterimText(interim || final)
      if (final) {
        rec.stop()
        setInterimText('')
        onResult(final.trim())
      }
    }

    rec.onerror = () => {
      // On error, keep listening phase so user knows to try again
    }

    // If no speech detected, restart recognition after a pause
    rec.onend = () => {
      if (liveModeRef.current && livePhaseRef.current === 'listening') {
        setTimeout(() => {
          if (liveModeRef.current && livePhaseRef.current === 'listening') {
            try { rec.start() } catch (_) { /* already running */ }
          }
        }, 800)
      }
    }

    try { rec.start() } catch (_) { /* already running */ }
  }, [])

  // ── Core send + stream + live turn-taking ──
  const sendMessage = async (userMsg: Message, currentMessages: Message[]) => {
    const updatedMessages = [...currentMessages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)
    setInput('')
    if (liveModeRef.current) setLivePhase('thinking')

    try {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, difficulty }),
      })

      if (!res.ok) throw new Error('Failed')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        assistantContent += decoder.decode(value, { stream: true })
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantContent },
        ])
      }

      // Live mode: auto-TTS → countdown buffer → auto-listen → loop
      if (liveModeRef.current) {
        const fullHistory: Message[] = [...updatedMessages, { role: 'assistant', content: assistantContent }]
        setLivePhase('speaking')
        speakPierre(assistantContent, () => {
          if (!liveModeRef.current) { setLivePhase('idle'); return }
          // 2-second buffer so TTS audio clears from the room before mic opens
          setLivePhase('ready')
          setReadyCountdown(2)
          const t1 = setTimeout(() => {
            setReadyCountdown(1)
            const t2 = setTimeout(() => {
              setReadyCountdown(0)
              if (!liveModeRef.current) { setLivePhase('idle'); return }
              startLiveListening((spokenText) => {
                // Reject echoes / noise (must be at least 3 chars)
                if (spokenText.trim().length < 3) return
                setLivePhase('thinking')
                sendMessageRef.current?.({ role: 'user', content: spokenText }, fullHistory)
              })
            }, 1000)
            return () => clearTimeout(t2)
          }, 1000)
          return () => clearTimeout(t1)
        })
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Désolé, il y a eu une erreur. / Sorry, there was an error.' },
      ])
      if (liveModeRef.current) setLivePhase('idle')
    } finally {
      setIsLoading(false)
    }
  }

  // Keep ref current every render
  sendMessageRef.current = sendMessage

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage({ role: 'user', content: input.trim() }, messages)
  }

  const startConversation = async (starterPrompt?: string) => {
    setHasStarted(true)
    await sendMessage({ role: 'user', content: starterPrompt || 'Bonjour!' }, [])
  }

  const toggleLiveMode = () => {
    if (liveMode) {
      window.speechSynthesis?.cancel()
      recognitionRef.current?.stop()
      setLivePhase('idle')
      setInterimText('')
      setLiveMode(false)
    } else {
      setLiveMode(true)
      // If Pierre already responded, start listening right away
      if (messages.length > 0 && !isLoading) {
        const last = messages[messages.length - 1]
        if (last.role === 'assistant') {
          // Small delay so liveModeRef updates first
          setTimeout(() => {
            startLiveListening((text) => {
              setLivePhase('thinking')
              sendMessageRef.current?.({ role: 'user', content: text }, messages)
            })
          }, 100)
        }
      }
    }
  }

  const resetConversation = () => {
    window.speechSynthesis?.cancel()
    recognitionRef.current?.stop()
    setMessages([])
    setHasStarted(false)
    setInput('')
    setLiveMode(false)
    setLivePhase('idle')
    setInterimText('')
  }

  // ── Setup screen ──
  if (!hasStarted) {
    return (
      <div className="min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h1 className="text-3xl font-bold text-white mb-2">Meet Professeur Pierre</h1>
            <p className="text-white/50">Your personal AI French conversation partner — corrects mistakes, teaches naturally</p>
          </div>

          {/* Difficulty Selector */}
          <div className="card-glass rounded-2xl p-6 mb-6">
            <p className="text-white/60 text-sm mb-3 font-medium">Choose your level:</p>
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: 'beginner', label: '🌱 Beginner', desc: 'Simple French + English hints' },
                { id: 'intermediate', label: '🌿 Intermediate', desc: 'Mixed French, some hints' },
                { id: 'advanced', label: '🌳 Advanced', desc: 'Full French, no hints' },
              ] as { id: Difficulty; label: string; desc: string }[]).map(level => (
                <button
                  key={level.id}
                  onClick={() => setDifficulty(level.id)}
                  className={`rounded-xl p-4 text-left transition-all ${
                    difficulty === level.id
                      ? 'border border-[#00c9a7]/50 bg-[rgba(0,201,167,0.12)]'
                      : 'card-glass hover:border-white/20'
                  }`}
                >
                  <p className="font-medium text-white text-sm">{level.label}</p>
                  <p className="text-white/40 text-xs mt-1">{level.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Starter Topics */}
          <div className="card-glass rounded-2xl p-6 mb-6">
            <p className="text-white/60 text-sm mb-3 font-medium">Start with a topic:</p>
            <div className="grid gap-2">
              {STARTER_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => startConversation(topic.prompt)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                >
                  <span className="text-white/70 group-hover:text-white text-sm">{topic.label}</span>
                  <span className="text-white/30 group-hover:text-[#00c9a7] text-lg">→</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => startConversation()}
            className="w-full btn-primary py-4 rounded-xl text-white font-bold text-lg"
          >
            Commencer la conversation! 🗣️
          </button>
        </div>
      </div>
    )
  }

  // ── Conversation screen ──
  return (
    <div className="flex flex-col h-screen pt-16">
      {/* Header */}
      <div className="card-glass border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={resetConversation}
            className="btn-secondary px-3 py-2 rounded-lg text-white/60 text-xs hover:text-white flex items-center gap-1.5"
          >
            ← Back
          </button>
          <span className="text-2xl">👨‍🏫</span>
          <div>
            <p className="text-white font-semibold text-sm">Professeur Pierre</p>
            <p className="text-white/40 text-xs capitalize">{difficulty} mode</p>
          </div>
          {liveMode ? (
            <span className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 pulse-recording" />
              LIVE
            </span>
          ) : (
            <div className="w-2 h-2 rounded-full bg-green-400" />
          )}
        </div>

        {/* Live Mode toggle */}
        <button
          onClick={toggleLiveMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            liveMode
              ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
              : 'btn-secondary text-white/70 hover:text-white'
          }`}
          title={liveMode ? 'End live conversation' : 'Start live voice conversation'}
        >
          <span>{liveMode ? '⏹' : '🎙️'}</span>
          <span>{liveMode ? 'End Live' : 'Go Live'}</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
            <span className="text-2xl">👨‍🏫</span>
            <span className="typing-dots">Pierre is typing</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Live Status Area */}
      {liveMode ? (
        // ── Live Mode Status Panel ──
        <div className="card-glass border-t border-white/10 px-6 py-5">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              {livePhase === 'thinking' && (
                <div className="flex items-center gap-3 text-white/70">
                  <span className="text-3xl animate-pulse">💭</span>
                  <div>
                    <p className="font-medium">Pierre réfléchit...</p>
                    <p className="text-white/40 text-xs">Pierre is thinking</p>
                  </div>
                </div>
              )}

              {livePhase === 'speaking' && (
                <div className="flex items-center gap-3 text-[#00c9a7]">
                  <span className="text-3xl animate-pulse">🔊</span>
                  <div>
                    <p className="font-medium">Pierre parle...</p>
                    <p className="text-[#00c9a7]/60 text-xs">Pierre is speaking</p>
                  </div>
                </div>
              )}

              {livePhase === 'ready' && (
                <div className="flex flex-col items-center gap-2 text-white/60">
                  <div className="w-14 h-14 rounded-full border-2 border-[#00c9a7]/40 flex items-center justify-center text-3xl font-bold text-[#00c9a7]">
                    {readyCountdown}
                  </div>
                  <p className="text-sm">Get ready to speak...</p>
                </div>
              )}

              {livePhase === 'listening' && (
                <div className="flex flex-col items-center gap-2 text-red-400">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl pulse-recording">🎙️</span>
                    <div>
                      <p className="font-medium">À vous de parler...</p>
                      <p className="text-red-400/60 text-xs">Speak in French — Pierre is listening</p>
                    </div>
                  </div>
                  {interimText && (
                    <div className="card-glass rounded-xl px-4 py-2 mt-1 text-center">
                      <p className="text-white/60 text-sm italic">&ldquo;{interimText}&rdquo;</p>
                    </div>
                  )}
                </div>
              )}

              {livePhase === 'idle' && (
                <div className="flex items-center gap-3 text-white/50">
                  <span className="text-3xl">👂</span>
                  <p className="text-sm">Waiting to start live conversation...</p>
                </div>
              )}

              <button
                onClick={toggleLiveMode}
                className="mt-2 btn-secondary px-5 py-2 rounded-xl text-sm text-white/60 hover:text-white"
              >
                ⏹ End Live Conversation
              </button>
            </div>
          </div>
        </div>
      ) : (
        // ── Regular Input Area ──
        <div className="card-glass border-t border-white/10 px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              {/* Voice Input */}
              <VoiceRecorder
                onResult={text => setInput(text)}
                language="fr-FR"
              />

              {/* Text Input */}
              <div className="flex-1 card-glass rounded-xl px-4 py-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Type in French (or English) — Pierre will respond in French..."
                  className="w-full bg-transparent text-white placeholder-white/30 resize-none outline-none text-sm max-h-32"
                  rows={1}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="btn-primary px-4 py-3 rounded-xl text-white font-medium disabled:opacity-40 shrink-0"
              >
                {isLoading ? '⏳' : '→'}
              </button>
            </div>

            <p className="text-white/20 text-xs mt-2 text-center">
              Press Enter to send • 🎤 to speak • or{' '}
              <button
                onClick={toggleLiveMode}
                className="text-[#00c9a7]/60 hover:text-[#00c9a7] underline underline-offset-2 transition-colors"
              >
                Go Live 🎙️
              </button>{' '}
              for hands-free conversation
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
