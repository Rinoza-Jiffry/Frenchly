import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-28 px-6">

        {/* Hero-specific glow backdrop */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(0,201,167,0.1) 0%, transparent 65%), radial-gradient(ellipse at 80% 30%, rgba(255,107,74,0.08) 0%, transparent 50%)'
        }} />

        {/* Large decorative icons inside hero (visible, styled) */}
        <div className="absolute top-8 left-6 text-6xl opacity-20 deco-float-slow select-none" style={{ '--rot': '-12deg' } as React.CSSProperties}>🌴</div>
        <div className="absolute top-10 right-8 text-5xl opacity-15 deco-float-medium select-none" style={{ animationDelay: '1.2s' }}>🗼</div>
        <div className="absolute bottom-6 left-16 text-4xl opacity-20 deco-float-medium select-none" style={{ animationDelay: '0.8s' }}>🌊</div>
        <div className="absolute bottom-8 right-20 text-3xl opacity-20 deco-float-slow select-none" style={{ animationDelay: '3s' }}>🌺</div>
        <div className="absolute top-1/2 left-4 text-2xl opacity-15 select-none">⚜️</div>
        <div className="absolute top-1/3 right-6 text-2xl opacity-15 select-none">⚜️</div>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 text-sm font-medium" style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.25)', color: '#00c9a7' }}>
            <span>🇱🇰</span>
            <span>Sri Lanka&apos;s first AI French learning platform</span>
            <span>🇫🇷</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Learn French in{' '}
            <span className="gradient-text">Sinhala & English</span>
          </h1>

          {/* Sub */}
          <p className="text-xl text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered translations, accent coaching, and live French conversations —
            built for Sri Lankans who dream of speaking French.
          </p>

          {/* Cultural flavor line */}
          <p className="text-sm text-white/30 mb-10 tracking-widest uppercase">
            🌴 Colombo &nbsp;→&nbsp; 🗼 Paris &nbsp;·&nbsp; Powered by AI
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/translate" className="btn-primary px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg">
              Start Translating →
            </Link>
            <Link href="/conversation" className="btn-secondary px-8 py-4 rounded-xl text-white font-semibold text-lg">
              Talk to Pierre 💬
            </Link>
          </div>

          {/* Small emoji row */}
          <div className="flex justify-center gap-6 mt-12 text-3xl opacity-30 select-none">
            <span title="Sri Lanka">🇱🇰</span>
            <span>🌴</span>
            <span>🌊</span>
            <span>⚜️</span>
            <span>🗼</span>
            <span>🌺</span>
            <span title="France">🇫🇷</span>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 text-white/90">Three ways to learn French</h2>
          <p className="text-center text-white/35 text-sm mb-12">From first word to full conversation 🌟</p>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Feature 1 — Translate */}
            <Link href="/translate" className="card-glass rounded-2xl p-8 transition-all group cursor-pointer block hover:scale-[1.02]" style={{ borderColor: 'rgba(0,201,167,0.15)' }}>
              <div className="text-5xl mb-5">🌐</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00c9a7] transition-colors">
                Translate & Learn
              </h3>
              <p className="text-white/55 leading-relaxed mb-4">
                Say anything in <strong className="text-white/80">Sinhala or English</strong> — get the French translation with Sinhala phonetics and audio playback.
              </p>
              <ul className="space-y-2 text-sm text-white/45">
                <li className="flex items-center gap-2"><span className="text-[#00c9a7]">✓</span> Sinhala → French</li>
                <li className="flex items-center gap-2"><span className="text-[#00c9a7]">✓</span> English → French</li>
                <li className="flex items-center gap-2"><span className="text-[#00c9a7]">✓</span> Sinhala phonetic guide</li>
                <li className="flex items-center gap-2"><span className="text-[#00c9a7]">✓</span> Audio playback</li>
              </ul>
            </Link>

            {/* Feature 2 — Accent */}
            <Link href="/accent" className="card-glass rounded-2xl p-8 transition-all group cursor-pointer block hover:scale-[1.02]" style={{ borderColor: 'rgba(255,107,74,0.15)' }}>
              <div className="text-5xl mb-5">🎙️</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ff6b4a] transition-colors">
                Accent Coach
              </h3>
              <p className="text-white/55 leading-relaxed mb-4">
                Speak French and get <strong className="text-white/80">instant AI feedback</strong> on your accent, pronunciation errors, and how to fix them.
              </p>
              <ul className="space-y-2 text-sm text-white/45">
                <li className="flex items-center gap-2"><span className="text-[#ff6b4a]">✓</span> Real-time speech input</li>
                <li className="flex items-center gap-2"><span className="text-[#ff6b4a]">✓</span> Error detection & score</li>
                <li className="flex items-center gap-2"><span className="text-[#ff6b4a]">✓</span> Phonetic tips</li>
                <li className="flex items-center gap-2"><span className="text-[#ff6b4a]">✓</span> Before/after comparison</li>
              </ul>
            </Link>

            {/* Feature 3 — Conversation */}
            <Link href="/conversation" className="card-glass rounded-2xl p-8 transition-all group cursor-pointer block hover:scale-[1.02]" style={{ borderColor: 'rgba(0,201,167,0.1)' }}>
              <div className="text-5xl mb-5">💬</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#a3f0e4] transition-colors">
                Conversation Practice
              </h3>
              <p className="text-white/55 leading-relaxed mb-4">
                Chat with <strong className="text-white/80">Professeur Pierre</strong>, your AI French tutor who speaks only French and gently corrects your mistakes.
              </p>
              <ul className="space-y-2 text-sm text-white/45">
                <li className="flex items-center gap-2"><span className="text-[#a3f0e4]">✓</span> Full French conversations</li>
                <li className="flex items-center gap-2"><span className="text-[#a3f0e4]">✓</span> Inline grammar corrections</li>
                <li className="flex items-center gap-2"><span className="text-[#a3f0e4]">✓</span> Vocabulary suggestions</li>
                <li className="flex items-center gap-2"><span className="text-[#a3f0e4]">✓</span> Adjustable difficulty</li>
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sri Lanka meets France strip ── */}
      <section className="py-10 px-6 overflow-hidden" style={{ background: 'rgba(0,201,167,0.03)', borderTop: '1px solid rgba(0,201,167,0.08)', borderBottom: '1px solid rgba(0,201,167,0.08)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/25 text-xs uppercase tracking-widest mb-4">Where two cultures meet</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-4xl opacity-40 select-none">
            <span title="Sri Lanka flag">🇱🇰</span>
            <span>🌴</span>
            <span>🌊</span>
            <span>🌺</span>
            <span className="text-2xl text-white/20">✦</span>
            <span>☕</span>
            <span>⚜️</span>
            <span>🥐</span>
            <span>🗼</span>
            <span title="France flag">🇫🇷</span>
          </div>
        </div>
      </section>

      {/* ── Why Frenchly ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-white/80">Why Frenchly?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-glass rounded-xl p-6">
              <h3 className="font-semibold mb-2" style={{ color: '#00c9a7' }}>🇱🇰 Built for Sri Lankans</h3>
              <p className="text-white/55 text-sm">
                The only platform that supports Sinhala as an input language for French learning.
                No more relying on English-only resources.
              </p>
            </div>
            <div className="card-glass rounded-xl p-6">
              <h3 className="font-semibold mb-2" style={{ color: '#a3f0e4' }}>🤖 Powered by Groq AI</h3>
              <p className="text-white/55 text-sm">
                Uses Llama 3.3 70B via Groq for deep language understanding,
                accurate translations, and natural conversation.
              </p>
            </div>
            <div className="card-glass rounded-xl p-6">
              <h3 className="font-semibold text-green-300 mb-2">🎯 Accent-Focused</h3>
              <p className="text-white/55 text-sm">
                French pronunciation is notoriously difficult. Our AI coach identifies
                specific errors and gives actionable phonetic guidance.
              </p>
            </div>
            <div className="card-glass rounded-xl p-6">
              <h3 className="font-semibold mb-2" style={{ color: '#ff9e8a' }}>📈 Real Conversations</h3>
              <p className="text-white/55 text-sm">
                Practice actual dialogues rather than just vocabulary. Professeur Pierre
                adapts to your level and keeps the conversation flowing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,201,167,0.08) 0%, transparent 65%)' }} />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-5xl mb-4 select-none">🌴 🗼</div>
          <p className="text-white/35 text-sm mb-3 uppercase tracking-widest">Start learning for free today</p>
          <h2 className="text-3xl font-bold text-white mb-8">Bonjour! Ready to begin?</h2>
          <Link href="/translate" className="btn-primary inline-block px-10 py-4 rounded-xl text-white font-bold text-lg">
            Begin Your French Journey →
          </Link>
        </div>
      </section>

    </div>
  )
}
