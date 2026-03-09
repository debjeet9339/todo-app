import Link from "next/link";

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .anim-1 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .anim-2 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.25s both; }
        .anim-3 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.4s both; }
        .anim-4 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.55s both; }
        .anim-5 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.7s both; }
        .anim-panel { animation: fadeIn 1s ease 0s both; }

        .divider-line {
          width: 56px; height: 2px;
          background: #c9a96e;
          transform-origin: left;
          animation: slideRight 0.8s cubic-bezier(.22,1,.36,1) 0.3s both;
        }

        .floating-card {
          animation: float 6s ease-in-out infinite;
        }

        /* ── BUTTONS ── */
        .btn-primary {
          position: relative;
          display: block;
          width: 100%;
          background: #1a1a2e;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          padding: 1rem 2rem;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.25s, box-shadow 0.25s, transform 0.2s;
          overflow: hidden;
          min-height: 48px;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #c9a96e22 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .btn-primary:hover { background: #16213e; transform: translateY(-2px); box-shadow: 0 12px 32px #1a1a2e33; }
        .btn-primary:hover::before { opacity: 1; }

        /* ── BADGE ── */
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fdf6ec; border: 1px solid #e8d5b0;
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b8892a;
          font-weight: 500;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #c9a96e; border-radius: 50%;
          position: relative;
        }
        .badge-dot::after {
          content: '';
          position: absolute; inset: 0;
          border-radius: 50%; background: #c9a96e;
          animation: pulse-ring 1.5s ease-out infinite;
        }

        /* ── FEATURES ── */
        .feature-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f0ece4;
        }
        .feature-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          background: #fdf6ec; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }

        /* ── SOCIAL PROOF ── */
        .social-proof { display: flex; align-items: center; gap: 10px; }
        .avatars { display: flex; }
        .avatar {
          width: 28px; height: 28px;
          border-radius: 50%; border: 2px solid #fff;
          margin-right: -8px;
          font-size: 11px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; color: #fff;
        }

        /* ── RIGHT PANEL ── */
        .right-panel {
          background: linear-gradient(145deg, #f8f4ee 0%, #ede8df 100%);
          position: relative; overflow: hidden;
        }
        .right-panel::before {
          content: '';
          position: absolute; top: -80px; right: -80px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, #c9a96e18 0%, transparent 70%);
          pointer-events: none;
        }
        .right-panel::after {
          content: '';
          position: absolute; bottom: -60px; left: -60px;
          width: 240px; height: 240px;
          background: radial-gradient(circle, #1a1a2e0d 0%, transparent 70%);
          pointer-events: none;
        }

        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 99;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* ── LAYOUT ── */
        .page-grid {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .page-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Left panel */
        .left-panel {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem 1.25rem;
          background: #fff;
          min-height: 100dvh;
        }

        @media (min-width: 480px) {
          .left-panel { padding: 2rem 2rem; }
        }

        @media (min-width: 768px) {
          .left-panel { padding: 3rem 4rem; min-height: 100vh; }
        }

        .left-content {
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
          padding: 1.5rem 0;
        }

        @media (min-width: 768px) {
          .left-content { padding: 0; }
        }

        /* Right panel — hidden on mobile */
        .right-panel-wrap {
          display: none;
        }

        @media (min-width: 768px) {
          .right-panel-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            position: relative;
          }
        }

        /* Top nav */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-est {
          font-size: 0.7rem;
          color: #999;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Headline */
        .headline {
          font-family: "'Playfair Display', serif";
          font-size: clamp(2rem, 8vw, 2.75rem);
          font-weight: 900;
          line-height: 1.1;
          color: #1a1a2e;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }

        @media (min-width: 768px) {
          .headline { font-size: clamp(2rem, 3.5vw, 2.75rem); }
        }

        /* Footer */
        .page-footer {
          font-size: 0.7rem;
          color: #bbb;
          letter-spacing: 0.04em;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f5f5f5;
        }

        @media (min-width: 768px) {
          .page-footer { border-top: none; margin-top: 0; padding-top: 0; }
        }
      `}</style>

      <div className="grain" />

      <main className="page page-grid">

        {/* ── LEFT: Auth Panel ── */}
        <div className="left-panel">

          {/* Top nav */}
          <div className="anim-1 top-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 36, height: 36,
                background: '#1a1a2e', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#c9a96e', fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 18 }}>A</span>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: '#1a1a2e', letterSpacing: '-0.01em' }}>Apex</span>
            </div>
            <span className="nav-est">est. 2025</span>
          </div>

          {/* Main content */}
          <div className="left-content">

            <div className="anim-1" style={{ marginBottom: '1.25rem' }}>
              <span className="badge"><span className="badge-dot" />Now in public beta</span>
            </div>

            <div className="anim-2">
              <div className="divider-line" style={{ marginBottom: '1.25rem' }} />
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 8vw, 2.75rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                color: '#1a1a2e',
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}>
                Where great<br /><em style={{ color: '#c9a96e' }}>work</em> begins.
              </h1>
              <p style={{ fontSize: '0.95rem', color: '#777', lineHeight: 1.7, fontWeight: 300 }}>
                Join thousands of professionals building something remarkable. Your tools, your flow, your rules.
              </p>
            </div>

            {/* Features */}
            <div className="anim-3" style={{ margin: '1.75rem 0' }}>
              {[
                { icon: '⚡', title: 'Instant setup', desc: 'Live in under 60 seconds' },
                { icon: '🔒', title: 'Privacy first', desc: 'Your data never leaves your control' },
                { icon: '✦', title: 'No limits', desc: 'Unlimited projects on every plan' },
              ].map(f => (
                <div key={f.title} className="feature-item">
                  <div className="feature-icon">{f.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#1a1a2e', marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#999', fontWeight: 300 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="anim-4">
              <Link href="/signup" className="btn-primary">Create Note</Link>
            </div>

            {/* Social proof */}
            <div className="anim-5" style={{ marginTop: '1.75rem' }}>
              <div className="social-proof">
                <div className="avatars">
                  {[['#e8a87c','M'],['#85c1e9','J'],['#82e0aa','S'],['#bb8fce','R']].map(([bg, letter]) => (
                    <div key={letter} className="avatar" style={{ background: bg }}>{letter}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 500, color: '#1a1a2e' }}>12,400+ creators</div>
                  <div style={{ fontSize: '0.68rem', color: '#aaa', fontWeight: 300 }}>joined this month</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ color: '#c9a96e', fontSize: 12 }}>★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="anim-1 page-footer">
            © 2025 Apex Inc. ·{' '}
            <a href="#" style={{ color: '#bbb', textDecoration: 'underline', textUnderlineOffset: 3 }}>Terms</a>
            {' '}·{' '}
            <a href="#" style={{ color: '#bbb', textDecoration: 'underline', textUnderlineOffset: 3 }}>Privacy</a>
          </div>
        </div>

        {/* ── RIGHT: Visual Panel — desktop only ── */}
        <div className="right-panel right-panel-wrap anim-panel">

          {/* Decorative lines */}
          <div style={{ position: 'absolute', top: 40, left: 40, width: 80, height: 80, border: '1px solid #d4b896', borderRadius: 4, opacity: 0.4, transform: 'rotate(15deg)' }} />
          <div style={{ position: 'absolute', bottom: 60, right: 50, width: 50, height: 50, border: '1px solid #d4b896', borderRadius: 4, opacity: 0.3, transform: 'rotate(-10deg)' }} />
          <div style={{ position: 'absolute', top: '30%', right: 30, width: 6, height: 80, background: '#c9a96e', borderRadius: 3, opacity: 0.35 }} />
          <div style={{ position: 'absolute', bottom: '25%', left: 30, width: 6, height: 50, background: '#1a1a2e', borderRadius: 3, opacity: 0.15 }} />

          {/* Floating card */}
          <div className="floating-card" style={{
            background: '#fff', borderRadius: 16, padding: '2rem',
            maxWidth: 320, width: '100%',
            boxShadow: '0 32px 80px #1a1a2e18, 0 8px 24px #1a1a2e0c',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #1a1a2e, #2d3561)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#c9a96e', fontSize: 18 }}>✦</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e' }}>Good morning, Alex</div>
                <div style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 300 }}>Monday, March 9</div>
              </div>
            </div>

            {[
              { label: 'Projects', val: 87, color: '#c9a96e' },
              { label: 'Tasks done', val: 64, color: '#1a1a2e' },
              { label: 'This week', val: 92, color: '#82e0aa' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.72rem', color: '#888', fontWeight: 400 }}>{s.label}</span>
                  <span style={{ fontSize: '0.72rem', color: '#1a1a2e', fontWeight: 500 }}>{s.val}%</span>
                </div>
                <div style={{ height: 5, background: '#f0ece4', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${s.val}%`, background: s.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: '#fdf6ec', borderRadius: 10, border: '1px solid #e8d5b0' }}>
              <div style={{ fontSize: '0.7rem', color: '#b8892a', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Today's highlight</div>
              <div style={{ fontSize: '0.8rem', color: '#1a1a2e', lineHeight: 1.5, fontWeight: 300 }}>You completed 3 milestones ahead of schedule. Keep it up! 🎉</div>
            </div>
          </div>

          {/* Testimonial chip */}
          <div style={{
            position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
            background: '#fff', borderRadius: 999,
            padding: '10px 18px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 8px 32px #1a1a2e14',
            whiteSpace: 'nowrap',
          }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #85c1e9, #82e0aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>J</div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 500, color: '#1a1a2e' }}>"Changed how I work entirely"</div>
              <div style={{ fontSize: '0.65rem', color: '#aaa' }}>Jamie L. · Product Designer</div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}