'use client'

import { useState } from 'react'

interface AudioPlayerProps {
  text: string
  lang?: string
  label?: string
}

export default function AudioPlayer({ text, lang = 'fr-FR', label = 'Listen' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const speak = () => {
    if (!window.speechSynthesis || isPlaying) return
    setIsPlaying(true)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.8 // slightly slower for learning
    utterance.pitch = 1

    // Try to find a French voice
    const voices = window.speechSynthesis.getVoices()
    const frenchVoice = voices.find(v => v.lang.startsWith('fr'))
    if (frenchVoice) utterance.voice = frenchVoice

    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  return (
    <button
      onClick={speak}
      disabled={isPlaying}
      className="flex items-center gap-2 btn-secondary px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white"
      title={`Listen to pronunciation`}
    >
      <span>{isPlaying ? '🔊' : '▶️'}</span>
      <span>{isPlaying ? 'Playing...' : label}</span>
    </button>
  )
}
