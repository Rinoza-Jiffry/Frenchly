import AudioPlayer from './AudioPlayer'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

function parseContent(text: string) {
  const correctionRegex = /\[💡 Correction:([^\]]+)\]/g
  const enRegex = /\[EN:([^\]]+)\]/g

  const corrections: string[] = []
  let enTranslation = ''

  let cleanText = text
    .replace(correctionRegex, (_, c) => { corrections.push(c.trim()); return '' })
    .replace(enRegex, (_, t) => { enTranslation = t.trim(); return '' })
    .trim()

  return { cleanText, corrections, enTranslation }
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'
  const { cleanText, corrections, enTranslation } = isUser
    ? { cleanText: content, corrections: [], enTranslation: '' }
    : parseContent(content)

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : ''}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">👨‍🏫</span>
            <span className="text-xs text-white/40 font-medium">Professeur Pierre</span>
          </div>
        )}

        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-purple-600/80 text-white rounded-tr-sm'
            : 'card-glass text-white/90 rounded-tl-sm'
        }`}>
          <p className="leading-relaxed whitespace-pre-wrap">{cleanText}</p>
        </div>

        {/* English translation */}
        {!isUser && enTranslation && (
          <div className="mt-1.5 flex items-start gap-1.5 bg-sky-500/8 border border-sky-500/20 rounded-xl px-3 py-2">
            <span className="text-sky-400 text-sm shrink-0">🇬🇧</span>
            <p className="text-sky-300/80 text-xs leading-relaxed">{enTranslation}</p>
          </div>
        )}

        {corrections.length > 0 && (
          <div className="mt-1.5 space-y-1">
            {corrections.map((correction, i) => (
              <div key={i} className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-sm">
                <span className="text-amber-400">💡 Correction:</span>
                <span className="text-white/70 ml-1">{correction}</span>
              </div>
            ))}
          </div>
        )}

        {!isUser && cleanText.length > 5 && (
          <div className="mt-2">
            <AudioPlayer text={cleanText} lang="fr-FR" label="Écouter" />
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-sm ml-2 flex-shrink-0 self-end">
          🧑
        </div>
      )}
    </div>
  )
}
