'use client'

import { useState } from 'react'
import VoiceRecorder from '@/components/VoiceRecorder'
import AudioPlayer from '@/components/AudioPlayer'

type SourceLang = 'english' | 'sinhala' | 'tamil'

interface TranslationResult {
  french: string
  ipa: string
  phonetic: string
  literal?: string
  grammarNote?: string
  example: string
  exampleTranslation: string
  tips: string[]
}

const EXAMPLE_PHRASES: Record<SourceLang, string[]> = {
  english: ['Hello, how are you?', 'I would like a coffee please', 'Where is the beach?', 'Thank you very much', 'I am learning French'],
  sinhala: ['ඔබට ස්තූතියි', 'මට කෝපි එකක් ඕනෑ', 'ගිනිකොන් කොතනද?', 'සුභ රාත්‍රියක්', 'මම ප්‍රංශ ඉගෙනගනිමින් සිටිමි'],
  tamil: ['நன்றி மிகவும்', 'எனக்கு காபி வேண்டும்', 'கடற்கரை எங்கே?', 'இரவு வணக்கம்', 'நான் பிரஞ்சு கற்கிறேன்'],
}

export default function TranslatePage() {
  const [inputText, setInputText] = useState('')
  const [sourceLang, setSourceLang] = useState<SourceLang>('english')
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<Array<{ input: string; lang: SourceLang; result: TranslationResult }>>([])

  const translate = async (text = inputText) => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang }),
      })
      if (!res.ok) throw new Error('Translation failed')
      const data = await res.json()
      setResult(data)
      setHistory(h => [{ input: text, lang: sourceLang, result: data }, ...h.slice(0, 9)])
    } catch {
      setError('Translation failed. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🌐</div>
          <h1 className="text-3xl font-bold text-white mb-2">Translate & Learn</h1>
          <p className="text-white/50">Say anything in Sinhala, Tamil or English — get French with full pronunciation guide</p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-8">
          <div className="card-glass rounded-2xl p-2 flex gap-2">
            {([
              { id: 'english', flag: '🇬🇧', label: 'English' },
              { id: 'sinhala', flag: '🇱🇰', label: 'Sinhala' },
              { id: 'tamil',   flag: '🇱🇰', label: 'Tamil'   },
            ] as { id: SourceLang; flag: string; label: string }[]).map(lang => (
              <button
                key={lang.id}
                onClick={() => setSourceLang(lang.id)}
                className={`flex flex-col items-center gap-1 px-7 py-3 rounded-xl text-sm font-medium transition-all ${
                  sourceLang === lang.id
                    ? 'btn-primary text-white shadow-lg'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="card-glass rounded-2xl p-6 mb-6">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={
              sourceLang === 'sinhala' ? 'ඔබේ Sinhala text ඇතුළු කරන්න...' :
              sourceLang === 'tamil' ? 'உங்கள் தமிழ் உரையை இங்கே உள்ளிடவும்...' :
              'Type your English text here...'
            }
            className="w-full bg-transparent text-white placeholder-white/30 resize-none outline-none text-lg min-h-[100px]"
            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) translate() }}
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <VoiceRecorder
              holdToSpeak
              onResult={text => { setInputText(text); translate(text) }}
              language={sourceLang === 'sinhala' ? 'si-LK' : sourceLang === 'tamil' ? 'ta-IN' : 'en-US'}
            />
            <button
              onClick={() => translate()}
              disabled={!inputText.trim() || loading}
              className="btn-primary px-6 py-2.5 rounded-xl text-white font-semibold disabled:opacity-40"
            >
              {loading ? 'Translating...' : 'Translate →'}
            </button>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mb-8">
          <p className="text-white/30 text-xs mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PHRASES[sourceLang].map(phrase => (
              <button
                key={phrase}
                onClick={() => { setInputText(phrase); translate(phrase) }}
                className="btn-secondary px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="card-glass rounded-2xl p-6 animate-pulse">
            <div className="h-12 bg-white/10 rounded mb-4 w-3/4 mx-auto" />
            <div className="h-5 bg-white/10 rounded mb-2 w-1/2 mx-auto" />
            <div className="h-5 bg-white/10 rounded mb-6 w-2/3 mx-auto" />
            <div className="h-20 bg-white/5 rounded" />
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="card-glass rounded-2xl p-6 mb-8">

            {/* ① French Translation — HERO: biggest element, eye lands here first */}
            <div className="text-center pb-7 mb-7 border-b border-white/10">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-4">French Translation</p>
              <p className="text-6xl font-black leading-tight mb-5" style={{ color: '#00c9a7' }}>
                {result.french}
              </p>
              <AudioPlayer text={result.french} lang="fr-FR" label="🔊 Écouter" />
            </div>

            {/* ② How to Say It — full width, no IPA clutter */}
            <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(0,201,167,0.08)', border: '1px solid rgba(0,201,167,0.25)' }}>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(0,201,167,0.6)' }}>🗣 How to Say It</p>
              <p className="text-2xl font-medium" style={{ color: '#a3f0e4' }}>{result.phonetic}</p>
            </div>

            {/* ③ Example Sentence — prominent, above word-by-word */}
            <div className="rounded-xl p-5 mb-4" style={{ background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.25)' }}>
              <p className="text-white/40 text-xs uppercase tracking-wide mb-3">📖 Example Sentence</p>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-white text-xl font-semibold mb-1">{result.example}</p>
                  <p className="text-white/55">{result.exampleTranslation}</p>
                </div>
                <AudioPlayer text={result.example} lang="fr-FR" />
              </div>
            </div>

            {/* ④ Word-by-word — secondary weight */}
            {result.literal && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Word-by-word</p>
                <p className="text-white/65 text-sm">{result.literal}</p>
              </div>
            )}

            {/* Grammar Note */}
            {result.grammarNote && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">📚 Grammar Note</p>
                <p className="text-amber-200/80 text-sm">{result.grammarNote}</p>
              </div>
            )}

            {/* Tips */}
            {result.tips?.length > 0 && (
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-2">💡 Pronunciation Tips</p>
                <ul className="space-y-1">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                      <span className="mt-0.5" style={{ color: '#00c9a7' }}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* History — filtered to current language */}
        {(() => {
          const filtered = history.slice(1).filter(item => item.lang === sourceLang)
          if (!filtered.length) return null
          return (
            <div>
              <p className="text-white/30 text-xs mb-3">Recent translations</p>
              <div className="space-y-2">
                {filtered.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setResult(item.result)}
                    className="w-full card-glass rounded-xl p-3 text-left transition-all flex items-center justify-between"
                  >
                    <span className="text-white/50 text-sm truncate">{item.input}</span>
                    <span className="text-sm font-medium ml-4 shrink-0" style={{ color: '#00c9a7' }}>{item.result.french}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
