'use client'

import Link from "next/link";
import { useEffect, useState } from 'react'

export default function Home() {
  const [noteCount, setNoteCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setNoteCount(d.totalNotes))
      .catch(() => setNoteCount(0))
  }, [])
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #1a1714;
          --gold: #c9a96e;
          --cream: #faf8f4;
          --warm: #e8e4dc;
          --muted: #9c9288;
          --border: #e5dfd6;
        }

        body { background: var(--warm); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%       { transform: translateY(-10px) rotate(0.5deg); }
        }
        @keyframes pen-write {
          0%   { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        .a1 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.05s both; }
        .a2 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.18s both; }
        .a3 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.31s both; }
        .a4 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.44s both; }
        .a5 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.57s both; }
        .a6 { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.7s both; }

        .root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh; min-height: 100dvh;
          background: var(--warm);
          position: relative; overflow: hidden;
        }

        .root::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: radial-gradient(circle, #b0aa9f 1px, transparent 1px);
          background-size: 24px 24px; opacity: 0.22;
        }

        .page-grid {
          position: relative; z-index: 1;
          min-height: 100vh; min-height: 100dvh;
          display: flex; flex-direction: column;
        }
        @media (min-width: 768px) {
          .page-grid { display: grid; grid-template-columns: 1fr 1fr; }
        }

        /* ── LEFT ── */
        .left-panel {
          display: flex; flex-direction: column; justify-content: space-between;
          background: var(--cream);
          padding: 1.5rem 1.25rem;
          min-height: 100dvh;
          border-right: 1.5px solid var(--border);
        }
        @media (min-width: 480px) { .left-panel { padding: 2rem; } }
        @media (min-width: 768px) { .left-panel { padding: 3rem 4rem; min-height: 100vh; } }

        .left-content {
          max-width: 400px; width: 100%;
          margin: 0 auto; padding: 1.5rem 0;
        }
        @media (min-width: 768px) { .left-content { padding: 0; } }

        .top-nav { display: flex; justify-content: space-between; align-items: center; }

        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-icon {
          width: 36px; height: 36px; background: var(--ink); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px #1a171422;
        }
        .logo-text {
          font-family: 'Lora', serif; font-weight: 700; font-size: 1.05rem;
          color: var(--ink); letter-spacing: -0.01em;
        }
        .logo-text span { color: var(--gold); font-style: italic; }

        .nav-tag {
          font-size: 0.68rem; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--muted);
          background: var(--warm); border: 1px solid var(--border);
          border-radius: 999px; padding: 3px 10px;
        }

        .tagline-wrap { margin: 2rem 0 1.5rem; }

        .note-label {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--gold); margin-bottom: 1rem;
        }
        .note-label-line { width: 24px; height: 1.5px; background: var(--gold); border-radius: 99px; }

        .headline {
          font-family: 'Lora', serif;
          font-size: clamp(1.9rem, 7vw, 2.6rem);
          font-weight: 700; line-height: 1.15;
          color: var(--ink); letter-spacing: -0.025em; margin-bottom: 1rem;
        }
        .headline em { font-style: italic; color: var(--gold); }

        .subline { font-size: 0.9rem; color: var(--muted); font-weight: 300; line-height: 1.7; }

        .features { margin: 1.75rem 0; display: flex; flex-direction: column; }

        .feature {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 0.85rem 0; border-bottom: 1px solid #f0ece5;
        }
        .feature:last-child { border-bottom: none; }

        .feature-dot {
          width: 28px; height: 28px; flex-shrink: 0;
          background: var(--warm); border: 1.5px solid var(--border);
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          margin-top: 1px;
        }
        .feature-title { font-size: 0.82rem; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
        .feature-desc { font-size: 0.77rem; color: var(--muted); font-weight: 300; line-height: 1.5; }

        .cta-wrap { display: flex; flex-direction: column; gap: 10px; }

        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--ink); color: var(--cream);
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
          letter-spacing: 0.04em; padding: 0.95rem 2rem; border-radius: 14px;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 18px #1a171422; min-height: 52px;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-primary:hover { background: #2c2620; transform: translateY(-2px); box-shadow: 0 10px 28px #1a171433; }
        .btn-primary:active { transform: translateY(0); }

        .btn-secondary {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          background: transparent; color: var(--muted);
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500;
          text-decoration: none; padding: 0.65rem;
          transition: color 0.2s; -webkit-tap-highlight-color: transparent;
        }
        .btn-secondary:hover { color: var(--ink); }

        .proof { display: flex; align-items: center; gap: 10px; margin-top: 1.5rem; }
        .proof-avatars { display: flex; }
        .proof-avatar {
          width: 26px; height: 26px; border-radius: 50%;
          border: 2px solid var(--cream); margin-right: -7px;
          font-size: 10px; font-weight: 700; color: #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .proof-text { font-size: 0.72rem; color: var(--muted); font-weight: 300; }
        .proof-text strong { color: var(--ink); font-weight: 600; }

        .page-footer {
          font-size: 0.68rem; color: #c0b8ae; letter-spacing: 0.04em;
          padding-top: 1rem; border-top: 1px solid var(--border);
        }
        @media (min-width: 768px) { .page-footer { border-top: none; padding-top: 0; } }
        .page-footer a { color: #c0b8ae; text-decoration: underline; text-underline-offset: 3px; }
        .page-footer a:hover { color: var(--gold); }

        /* ── RIGHT PANEL ── */
        .right-panel-wrap { display: none; }
        @media (min-width: 768px) {
          .right-panel-wrap {
            display: flex; align-items: center; justify-content: center;
            padding: 3rem; position: relative; background: var(--warm);
          }
        }

        .deco-circle {
          position: absolute; border: 1.5px solid var(--border);
          border-radius: 50%; opacity: 0.5;
        }

        /* notebook */
        .notebook {
          position: relative; width: 100%; max-width: 320px;
          animation: float 7s ease-in-out infinite;
        }
        .notebook::after {
          content: ''; position: absolute; bottom: -24px; left: 10%; right: 10%;
          height: 20px;
          background: radial-gradient(ellipse, #1a171433 0%, transparent 70%);
          border-radius: 50%;
        }

        .nb-cover {
          background: var(--ink); border-radius: 16px 4px 4px 16px;
          padding: 1.5rem;
          box-shadow: 4px 0 0 #2c2620, 8px 0 0 #3a3028, 0 32px 80px #1a171440;
          position: relative; overflow: hidden;
        }
        .nb-cover::before {
          content: ''; position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 28px, #ffffff08 28px, #ffffff08 29px);
          pointer-events: none;
        }

        .nb-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .nb-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: #ffffff14; border: 1px solid #ffffff18;
          border-radius: 999px; padding: 3px 10px;
          font-size: 0.62rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--gold);
        }
        .nb-dot { width: 5px; height: 5px; background: var(--gold); border-radius: 50%; }

        .nb-title-area { margin-bottom: 1.25rem; }
        .nb-title {
          font-family: 'Lora', serif; font-size: 1.05rem; font-weight: 700;
          color: var(--cream); letter-spacing: -0.01em; margin-bottom: 0.3rem; line-height: 1.3;
        }
        .nb-subtitle { font-size: 0.7rem; color: #9c9288; font-weight: 300; }

        .nb-lines { display: flex; flex-direction: column; }
        .nb-line-row {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 0; border-bottom: 1px solid #ffffff0c;
        }
        .nb-line-bullet { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .nb-line-text { height: 2px; border-radius: 99px; background: #ffffff18; flex: 1; }
        .nb-line-tag {
          font-size: 0.58rem; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; padding: 2px 6px; border-radius: 4px; flex-shrink: 0;
        }

        .sticky-note {
          position: absolute; background: #fef9c3; border-radius: 4px;
          padding: 10px 12px; box-shadow: 2px 4px 14px #1a171428;
          font-size: 0.68rem; font-weight: 400; color: #78716c; line-height: 1.5; max-width: 130px;
        }
        .sticky-note.pink { background: #fce7f3; }
        .sticky-title { font-weight: 600; font-size: 0.65rem; color: #1a1714; margin-bottom: 3px; letter-spacing: -0.01em; }
        .sticky-1 { top: -18px; right: -20px; transform: rotate(4deg); animation: float 8s ease-in-out 1s infinite; z-index: 10; }
        .sticky-2 { bottom: 30px; right: -30px; transform: rotate(-3deg); animation: float 9s ease-in-out 2s infinite; z-index: 10; }

        .count-pill {
          position: absolute; top: -10px; left: -14px;
          background: var(--gold); color: var(--ink);
          font-size: 0.65rem; font-weight: 700;
          padding: 4px 10px; border-radius: 999px;
          box-shadow: 0 4px 12px #c9a96e44; white-space: nowrap; z-index: 10;
        }

        .pen-line {
          stroke: var(--gold); stroke-width: 2.5; stroke-linecap: round;
          fill: none; stroke-dasharray: 120;
          animation: pen-write 2s ease 1s both;
        }

        .cursor {
          display: inline-block; width: 2px; height: 13px;
          background: var(--gold); border-radius: 1px; margin-left: 2px;
          animation: blink 1s ease infinite; vertical-align: middle;
        }
      `}</style>

      <div className="root">
        <main className="page-grid">

          {/* ── LEFT ── */}
          <div className="left-panel">

            <div className="a1 top-nav">
              <div className="logo">
                <div className="logo-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <span className="logo-text">Apex <span>Notes</span></span>
              </div>
              <span className="nav-tag">Beta</span>
            </div>

            <div className="left-content">

              <div className="a2 tagline-wrap">
                <div className="note-label">
                  <span className="note-label-line" />
                  Your personal notebook
                </div>
                <h1 className="headline">
                  Capture every<br />thought, <em>beautifully.</em>
                </h1>
                <p className="subline">
                  Write, organize and revisit your notes in a clean, distraction-free space. Simple as pen and paper — but smarter.
                </p>
              </div>

              <div className="a3 features">
                {[
                  {
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
                    title: 'Write freely',
                    desc: 'Create and edit notes with a clean, focused editor'
                  },
                  {
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
                    title: 'Stay organized',
                    desc: 'All your notes in one place, always easy to find'
                  },
                  {
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
                    title: 'Private & secure',
                    desc: 'Your notes are protected with JWT authentication'
                  },
                ].map(f => (
                  <div key={f.title} className="feature">
                    <div className="feature-dot">{f.icon}</div>
                    <div>
                      <div className="feature-title">{f.title}</div>
                      <div className="feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="a4 cta-wrap">
                <Link href="/signup" className="btn-primary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Start writing for free
                </Link>
                <Link href="/login" className="btn-secondary">
                  Already have an account? <strong style={{ color: '#1a1714' }}>Sign in →</strong>
                </Link>
              </div>

              <div className="a5 proof">
                <div className="proof-avatars">
                  {[['#e8a87c', 'M'], ['#85c1e9', 'J'], ['#82e0aa', 'S'], ['#bb8fce', 'R'], ['#f9c74f', 'K']].map(([bg, l]) => (
                    <div key={l} className="proof-avatar" style={{ background: bg }}>{l}</div>
                  ))}
                </div>
                <div className="proof-text">
                  {noteCount === null
                    ? <span style={{ color: '#c0b8ae' }}>Loading…</span>
                    : <><strong>{noteCount.toLocaleString()} notes</strong> written so far</>
                  }
                </div>
              </div>

            </div>

            <div className="a6 page-footer">
              © 2025 Apex Notes · <a href="#">Terms</a> · <a href="#">Privacy</a>
            </div>
          </div>

          {/* ── RIGHT — desktop only ── */}
          <div className="right-panel-wrap">

            <div className="deco-circle" style={{ width: 280, height: 280, top: '10%', right: '-60px' }} />
            <div className="deco-circle" style={{ width: 140, height: 140, bottom: '15%', left: '10%' }} />

            <div style={{ position: 'relative', width: '100%', maxWidth: 320, animation: 'fadeIn 1s ease 0.3s both' }}>

              <div className="sticky-note sticky-1">
                <div className="sticky-title">📌 Idea</div>
                Build something people love
              </div>
              <div className="sticky-note pink sticky-2">
                <div className="sticky-title">🎯 Todo</div>
                Review meeting notes
              </div>

              <div className="count-pill">✦ 12 notes</div>

              <div className="notebook">
                <div className="nb-cover">
                  <div className="nb-top-row">
                    <div className="nb-badge"><span className="nb-dot" />My Notes</div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff30" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>

                  <div className="nb-title-area">
                    <div className="nb-title">Daily Journal<span className="cursor" /></div>
                    <div className="nb-subtitle">Last edited just now</div>
                  </div>

                  <div className="nb-lines">
                    {[
                      { color: '#c9a96e', width: '85%', tag: 'Work', tagBg: '#c9a96e22', tagColor: '#c9a96e' },
                      { color: '#82e0aa', width: '70%', tag: 'Done', tagBg: '#82e0aa22', tagColor: '#82e0aa' },
                      { color: '#85c1e9', width: '90%', tag: 'Idea', tagBg: '#85c1e922', tagColor: '#85c1e9' },
                      { color: '#bb8fce', width: '60%', tag: null },
                      { color: '#f9c74f', width: '75%', tag: null },
                      { color: '#ffffff30', width: '45%', tag: null },
                    ].map((line, i) => (
                      <div key={i} className="nb-line-row">
                        <div className="nb-line-bullet" style={{ background: line.color }} />
                        <div className="nb-line-text" style={{ width: line.width, background: `${line.color}30` }} />
                        {line.tag && (
                          <div className="nb-line-tag" style={{ background: line.tagBg, color: line.tagColor }}>{line.tag}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <svg width="80" height="28" viewBox="0 0 80 28">
                      <path className="pen-line" d="M4 22 Q 20 6, 36 14 Q 52 22, 68 8 Q 74 4, 78 10" />
                    </svg>
                  </div>
                </div>

                <div style={{
                  position: 'absolute', left: 0, top: 10, bottom: 10, width: 12,
                  background: 'linear-gradient(to right, #0d0c0a, #2c2620)',
                  borderRadius: '4px 0 0 4px', zIndex: -1,
                }} />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingLeft: 12 }}>
                {[
                  { title: 'Shopping list', lines: 3, color: '#c9a96e' },
                  { title: 'Book notes', lines: 4, color: '#82e0aa' },
                ].map(card => (
                  <div key={card.title} style={{
                    flex: 1, background: 'var(--cream)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 12, padding: '0.75rem',
                    boxShadow: '0 4px 14px #1a171412',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, background: card.color, borderRadius: '50%' }} />
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#1a1714', fontFamily: 'Lora, serif' }}>{card.title}</div>
                    </div>
                    {Array.from({ length: card.lines }).map((_, i) => (
                      <div key={i} style={{
                        height: 2, background: '#e5dfd6', borderRadius: 99, marginBottom: 5,
                        width: i === card.lines - 1 ? '60%' : '100%',
                      }} />
                    ))}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </main>
      </div>
    </>
  );
}