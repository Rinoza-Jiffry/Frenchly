'use client'

import { useState } from 'react'
import VoiceRecorder from '@/components/VoiceRecorder'
import AudioPlayer from '@/components/AudioPlayer'

interface PronunciationError {
  word: string
  yourVersion: string
  correctVersion: string
  tip: string
}

interface AccentResult {
  whatYouSaid: string
  correctFrench: string
  overallScore: number
  errors: PronunciationError[]
  generalTips: string[]
  encouragement: string
  practicePhrase: string
}

const PRACTICE_PHRASES = [
  { french: 'Bonjour, comment allez-vous?', meaning: 'Hello, how are you?' },
  { french: 'Je voudrais un café, s\'il vous plaît', meaning: 'I would like a coffee, please' },
  { french: 'Je m\'appelle Pierre, et vous?', meaning: 'My name is Pierre, and you?' },
  { french: 'Où est la gare, s\'il vous plaît?', meaning: 'Where is the train station, please?' },
  { french: 'C\'est magnifique!', meaning: 'It\'s magnificent!' },
  { french: 'Je ne comprends pas', meaning: 'I don\'t understand' },
]

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
  const ring = score >= 80 ? 'border-green-400/40' : score >= 60 ? 'border-yellow-400/40' : 'border-red-400/40'

  return (
    <div className={`w-20 h-20 rounded-full border-4 ${ring} flex flex-col items-center justify-center`}>
      <span className={`text-2xl font-bold ${color}`}>{score}</span>
      <span className="text-white/40 text-xs">/100</span>
    </div>
  )
}

export default function AccentPage() {
  const [spokenText, setSpokenText] = useState('')
  const [targetPhrase, setTargetPhrase] = useState('')
  const [result, setResult] = useState<AccentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'free' | 'guided'>('guided')

  const analyze = async (text: string) => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setSpokenText(text)

    try {
      const res = await fetch('/api/accent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText: text,
          targetPhrase: mode === 'guided' ? targetPhrase : null,
        }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Analysis failed. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎙️</div>
          <h1 className="text-3xl font-bold text-white mb-2">Accent Coach</h1>
          <p className="text-white/50">Speak French — get AI feedback on your pronunciation</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="card-glass rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setMode('guided')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'guided' ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
            >
              🎯 Guided Practice
            </button>
            <button
              onClick={() => setMode('free')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'free' ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
            >
              🎤 Free Practice
            </button>
          </div>
        </div>

        {mode === 'guided' ? (
          <div>
            {/* Phrase Selector */}
            <div className="mb-6">
              <p className="text-white/50 text-sm mb-3">Choose a phrase to practice:</p>
              <div className="grid gap-2">
                {PRACTICE_PHRASES.map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => setTargetPhrase(phrase.french)}
                    className={`card-glass rounded-xl p-4 text-left transition-all ${
                      targetPhrase === phrase.french
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">{phrase.french}</p>
                        <p className="text-white/40 text-sm mt-0.5">{phrase.meaning}</p>
                      </div>
                      <AudioPlayer text={phrase.french} lang="fr-FR" label="Native" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {targetPhrase && (
              <div className="card-glass rounded-2xl p-6 text-center mb-6">
                <p className="text-white/40 text-sm mb-2">Now say this in French:</p>
                <p className="text-2xl font-bold text-white mb-4">{targetPhrase}</p>
                <VoiceRecorder
                  onResult={analyze}
                  language="fr-FR"
                  placeholder="Click to record your pronunciation"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="card-glass rounded-2xl p-6 text-center mb-6">
            <p className="text-white/50 mb-4">Speak any French phrase and get pronunciation feedback</p>
            <VoiceRecorder
              onResult={analyze}
              language="fr-FR"
              placeholder="Click microphone and speak any French"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card-glass rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4 animate-bounce">🔍</div>
            <p className="text-white/60">Analyzing your pronunciation...</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="space-y-4">
            {/* Score Overview */}
            <div className="card-glass rounded-2xl p-6">
              <div className="flex items-center gap-6">
                <ScoreCircle score={result.overallScore} />
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">{result.encouragement}</p>
                  <p className="text-white/50 text-sm">
                    You said: <span className="text-white/70 italic">&quot;{result.whatYouSaid}&quot;</span>
                  </p>
                  {result.correctFrench !== result.whatYouSaid && (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-white/40 text-sm">Correct form:</p>
                      <p className="text-green-400 text-sm font-medium">{result.correctFrench}</p>
                      <AudioPlayer text={result.correctFrench} lang="fr-FR" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Specific Errors */}
            {result.errors?.length > 0 && (
              <div className="card-glass rounded-2xl p-6">
                <h3 className="text-white/80 font-semibold mb-4">🔍 Specific Issues</h3>
                <div className="space-y-3">
                  {result.errors.map((err, i) => (
                    <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-medium text-lg">{err.word}</span>
                        <span className="text-white/40 text-sm">→</span>
                        <span className="text-red-400 text-sm line-through">{err.yourVersion}</span>
                        <span className="text-white/40 text-sm">should be</span>
                        <span className="text-green-400 text-sm font-medium">{err.correctVersion}</span>
                      </div>
                      <p className="text-white/60 text-sm">💡 {err.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Tips */}
            {result.generalTips?.length > 0 && (
              <div className="card-glass rounded-2xl p-6">
                <h3 className="text-white/80 font-semibold mb-3">📚 Tips for Sri Lankan Speakers</h3>
                <ul className="space-y-2">
                  {result.generalTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                      <span className="text-blue-400 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practice Phrase */}
            {result.practicePhrase && (
              <div className="card-glass rounded-2xl p-6 border-purple-500/20">
                <h3 className="text-white/80 font-semibold mb-2">🎯 Practice This</h3>
                <div className="flex items-center justify-between">
                  <p className="text-purple-300 text-lg font-medium">{result.practicePhrase}</p>
                  <AudioPlayer text={result.practicePhrase} lang="fr-FR" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
