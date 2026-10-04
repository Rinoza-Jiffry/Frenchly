'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface VoiceRecorderProps {
  onResult: (text: string) => void
  language?: string
  placeholder?: string
  holdToSpeak?: boolean
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
}

export default function VoiceRecorder({ onResult, language = 'fr-FR', placeholder, holdToSpeak = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionClass) {
      setIsSupported(false)
      return
    }
    recognitionRef.current = new SpeechRecognitionClass()
    recognitionRef.current.lang = language
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = true

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript)
        onResult(finalTranscript)
      }
    }

    recognitionRef.current.onerror = () => setIsRecording(false)
    recognitionRef.current.onend = () => setIsRecording(false)
  }, [language, onResult])

  const startRecording = useCallback(() => {
    if (!recognitionRef.current || isRecording) return
    setTranscript('')
    recognitionRef.current.start()
    setIsRecording(true)
  }, [isRecording])

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isRecording) return
    recognitionRef.current.stop()
    setIsRecording(false)
  }, [isRecording])

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording()
    else startRecording()
  }, [isRecording, startRecording, stopRecording])

  if (!isSupported) {
    return (
      <div className="text-white/40 text-xs">
        Speech not supported. Use Chrome or Edge.
      </div>
    )
  }

  // Hold-to-speak mode: compact inline button for use inside the input card
  if (holdToSpeak) {
    return (
      <div className="flex items-center gap-3">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          onTouchStart={e => { e.preventDefault(); startRecording() }}
          onTouchEnd={stopRecording}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all select-none ${
            isRecording
              ? 'bg-red-500 pulse-recording text-white'
              : 'btn-secondary text-white/70 hover:text-white'
          }`}
        >
          <span className="text-base">{isRecording ? '⏹' : '🎤'}</span>
          <span>{isRecording ? 'Listening...' : 'Hold to Speak'}</span>
        </button>
        {transcript && (
          <span className="text-white/40 text-xs truncate max-w-[140px]">&quot;{transcript}&quot;</span>
        )}
      </div>
    )
  }

  // Default: standalone big toggle button (used in accent/conversation pages)
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={toggleRecording}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
          isRecording
            ? 'bg-red-500 pulse-recording text-white'
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? '⏹' : '🎤'}
      </button>
      {isRecording && (
        <p className="text-red-400 text-sm animate-pulse">Listening...</p>
      )}
      {transcript && (
        <p className="text-white/70 text-sm text-center max-w-xs">
          &quot;{transcript}&quot;
        </p>
      )}
      {!isRecording && !transcript && placeholder && (
        <p className="text-white/30 text-xs text-center">{placeholder}</p>
      )}
    </div>
  )
}
