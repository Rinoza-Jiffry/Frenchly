import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Frenchly — Learn French in Sinhala & English',
  description: 'AI-powered French learning platform for Sri Lanka. Translate, fix your accent, and practice conversations in French.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">

        {/* ── Global decorative background layer ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">

          {/* Ambient glow orbs */}
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.13) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: '500px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,74,0.09) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '55%', left: '35%', width: '600px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,80,200,0.12) 0%, transparent 70%)', filter: 'blur(70px)' }} />

          {/* 🌴 Palm trees — Sri Lanka vibes */}
          <div
            className="deco-float-slow"
            style={{ position: 'absolute', bottom: '2%', left: '-1%', fontSize: '11rem', opacity: 0.09, filter: 'blur(0.5px)', '--rot': '-8deg' } as React.CSSProperties}
          >🌴</div>
          <div
            className="deco-float-slow"
            style={{ position: 'absolute', bottom: '4%', right: '-1%', fontSize: '9rem', opacity: 0.08, filter: 'blur(0.5px)', '--rot': '10deg', animationDelay: '2s' } as React.CSSProperties}
          >🌴</div>

          {/* 🗼 Eiffel Tower — France vibes */}
          <div
            className="deco-float-medium"
            style={{ position: 'absolute', top: '8%', right: '4%', fontSize: '13rem', opacity: 0.05, filter: 'blur(1.5px)', animationDelay: '1s' } as React.CSSProperties}
          >🗼</div>

          {/* ⚜️ Fleur-de-lis — French royal symbol */}
          <div
            className="deco-float-medium"
            style={{ position: 'absolute', top: '6%', left: '12%', fontSize: '4rem', opacity: 0.1, animationDelay: '0.5s' } as React.CSSProperties}
          >⚜️</div>
          <div
            className="deco-float-slow"
            style={{ position: 'absolute', bottom: '28%', right: '12%', fontSize: '3rem', opacity: 0.08, animationDelay: '3s' } as React.CSSProperties}
          >⚜️</div>
          <div
            style={{ position: 'absolute', top: '45%', left: '4%', fontSize: '2.5rem', opacity: 0.06 } as React.CSSProperties}
          >⚜️</div>

          {/* 🌺 Tropical flowers — Sri Lanka */}
          <div
            className="deco-float-medium"
            style={{ position: 'absolute', top: '30%', left: '7%', fontSize: '3.5rem', opacity: 0.09, animationDelay: '1.5s' } as React.CSSProperties}
          >🌺</div>
          <div
            className="deco-float-slow"
            style={{ position: 'absolute', bottom: '20%', left: '18%', fontSize: '3rem', opacity: 0.07, animationDelay: '4s' } as React.CSSProperties}
          >🌸</div>
          <div
            style={{ position: 'absolute', top: '20%', right: '18%', fontSize: '2.5rem', opacity: 0.07 } as React.CSSProperties}
          >🌺</div>

          {/* 🌊 Ocean wave hint */}
          <div
            className="deco-float-slow"
            style={{ position: 'absolute', bottom: '12%', left: '40%', fontSize: '5rem', opacity: 0.07, animationDelay: '2.5s' } as React.CSSProperties}
          >🌊</div>

          {/* Scrolling wave band at the very bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '90px', overflow: 'hidden' }}>
            <div className="wave-drift" style={{ display: 'flex', width: '200%' }}>
              <svg viewBox="0 0 1440 90" style={{ width: '50%', flexShrink: 0 }} preserveAspectRatio="none">
                <path d="M0,45 C240,90 480,0 720,45 C960,90 1200,10 1440,45 L1440,90 L0,90 Z" fill="rgba(0,201,167,0.06)" />
                <path d="M0,55 C180,20 420,80 660,55 C900,30 1200,70 1440,55 L1440,90 L0,90 Z" fill="rgba(0,201,167,0.04)" />
              </svg>
              <svg viewBox="0 0 1440 90" style={{ width: '50%', flexShrink: 0 }} preserveAspectRatio="none">
                <path d="M0,45 C240,90 480,0 720,45 C960,90 1200,10 1440,45 L1440,90 L0,90 Z" fill="rgba(0,201,167,0.06)" />
                <path d="M0,55 C180,20 420,80 660,55 C900,30 1200,70 1440,55 L1440,90 L0,90 Z" fill="rgba(0,201,167,0.04)" />
              </svg>
            </div>
          </div>
        </div>
        {/* ── End background layer ── */}

        <nav className="fixed top-0 w-full z-50 card-glass border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🇫🇷</span>
              <span className="text-xl font-bold gradient-text">Frenchly</span>
            </a>
            <div className="flex items-center gap-2">
              <a href="/translate" className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium text-white">
                Translate
              </a>
              <a href="/accent" className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium text-white">
                Accent Coach
              </a>
              <a href="/conversation" className="btn-primary px-4 py-2 rounded-lg text-sm font-medium text-white">
                Practice
              </a>
            </div>
          </div>
        </nav>

        <main className="pt-16 relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
