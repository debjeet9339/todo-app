'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [focused, setFocused] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [strength, setStrength] = useState(0)
  const router = useRouter()

  const calcStrength = (val: string) => {
    let s = 0
    if (val.length >= 8) s++
    if (/[A-Z]/.test(val)) s++
    if (/[0-9]/.test(val)) s++
    if (/[^A-Za-z0-9]/.test(val)) s++
    setStrength(s)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    const data = await res.json()
    console.log(data)
    setLoading(false)
    setDone(true)
    if (res.ok) {
      router.push('/notes')
    }
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .signup-root {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          min-height: 100dvh;
          background: #f5f2ed;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
        }

        /* Background blobs */
        .signup-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 20%, #e8ddd0 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, #dde8e0 0%, transparent 50%),
            radial-gradient(circle at 60% 10%, #e0dded 0%, transparent 40%);
          pointer-events: none;
        }

        /* Dot grid */
        .signup-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, #c5b9a8 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.25;
          pointer-events: none;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes successPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes barGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .card {
          position: relative;
          z-index: 1;
          background: #fffefb;
          border-radius: 24px;
          box-shadow:
            0 2px 0 #e8e0d4,
            0 8px 0 #ede6db,
            0 4px 40px #b8a99033,
            0 24px 80px #a0908033;
          padding: 2.25rem 1.5rem 2rem;
          width: 100%;
          max-width: 440px;
          animation: slideUp 0.6s cubic-bezier(.22,1,.36,1) both;
        }

        /* Tablet and up */
        @media (min-width: 480px) {
          .signup-root {
            padding: 2rem;
          }
          .card {
            padding: 3rem 2.75rem 2.5rem;
          }
        }

        .logo-mark {
          width: 42px;
          height: 42px;
          background: #1c1917;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 16px #1c191733;
        }

        @media (min-width: 480px) {
          .logo-mark {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            margin-bottom: 1.5rem;
          }
        }

        .headline {
          font-family: 'Lora', serif;
          font-size: 1.55rem;
          font-weight: 600;
          color: #1c1917;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 0.35rem;
        }

        @media (min-width: 480px) {
          .headline { font-size: 1.85rem; }
        }

        .subline {
          font-size: 0.85rem;
          color: #9c8f84;
          font-weight: 300;
          margin-bottom: 1.75rem;
          line-height: 1.6;
        }

        @media (min-width: 480px) {
          .subline { margin-bottom: 2.25rem; font-size: 0.875rem; }
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        @media (min-width: 480px) {
          .field-group {
            gap: 1.1rem;
            margin-bottom: 1.5rem;
          }
        }

        .field-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b5e55;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        @media (min-width: 480px) {
          .field-label { font-size: 0.75rem; }
        }

        .input-shell {
          position: relative;
          border-radius: 12px;
          transition: box-shadow 0.2s;
        }
        .input-shell.is-focused {
          box-shadow: 0 0 0 3px #c9a96e44;
        }

        .field-input {
          width: 100%;
          background: #f8f5f0;
          border: 1.5px solid #e5ddd5;
          border-radius: 12px;
          padding: 0.75rem 1rem 0.75rem 2.6rem;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem; /* 16px min to prevent iOS zoom */
          font-weight: 400;
          color: #1c1917;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          -webkit-appearance: none;
          appearance: none;
        }

        @media (min-width: 480px) {
          .field-input {
            padding: 0.8rem 1rem 0.8rem 2.75rem;
            font-size: 0.925rem;
          }
        }

        .field-input::placeholder { color: #c4b8af; }
        .field-input:focus {
          border-color: #c9a96e;
          background: #fffefb;
        }

        .field-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: #c4b8af;
          pointer-events: none;
          font-size: 15px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .input-shell.is-focused .field-icon { color: #c9a96e; }

        .toggle-pw {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #c4b8af;
          padding: 6px;
          font-size: 14px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          -webkit-tap-highlight-color: transparent;
          min-width: 32px;
          min-height: 32px;
          justify-content: center;
        }
        .toggle-pw:hover { color: #6b5e55; }

        .strength-bar-wrap {
          display: flex;
          gap: 5px;
          margin-top: 8px;
        }
        .strength-seg {
          flex: 1;
          height: 3px;
          border-radius: 99px;
          background: #e5ddd5;
          overflow: hidden;
        }
        .strength-seg-fill {
          height: 100%;
          border-radius: 99px;
          transform-origin: left;
          animation: barGrow 0.3s ease;
        }
        .strength-hint {
          font-size: 0.7rem;
          color: #9c8f84;
          margin-top: 5px;
          font-weight: 400;
        }

        .submit-btn {
          width: 100%;
          background: #1c1917;
          color: #fffefb;
          border: none;
          border-radius: 12px;
          padding: 0.875rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 16px #1c191722;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          min-height: 48px; /* comfortable touch target */
        }

        @media (min-width: 480px) {
          .submit-btn {
            font-size: 0.9rem;
            padding: 0.9rem;
          }
        }

        .submit-btn:hover:not(:disabled) {
          background: #2c2520;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px #1c191733;
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid #ffffff44;
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }



        .footer-note {
          text-align: center;
          font-size: 0.75rem;
          color: #b5a99f;
          margin-top: 1.25rem;
          line-height: 1.7;
        }

        @media (min-width: 480px) {
          .footer-note { font-size: 0.78rem; margin-top: 1.5rem; }
        }

        .footer-note a {
          color: #6b5e55;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: #c9a96e88;
          transition: color 0.2s;
        }
        .footer-note a:hover { color: #c9a96e; }

        /* Success state */
        .success-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 0.75rem 0;
          animation: slideUp 0.5s cubic-bezier(.22,1,.36,1) both;
        }
        .success-circle {
          width: 68px; height: 68px;
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: successPop 0.5s cubic-bezier(.22,1,.36,1) both;
          box-shadow: 0 8px 24px #22c55e22;
        }
        .check-svg {
          stroke: #16a34a;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 40;
          animation: checkDraw 0.5s ease 0.3s both;
        }

        .success-title {
          font-family: 'Lora', serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #1c1917;
          margin-bottom: 6px;
        }

        @media (min-width: 480px) {
          .success-title { font-size: 1.4rem; }
        }

        .success-body {
          font-size: 0.85rem;
          color: #9c8f84;
          line-height: 1.6;
        }

        .success-link {
          display: inline-block;
          margin-top: 8px;
          background: #1c1917;
          color: #fff;
          border-radius: 10px;
          padding: 0.75rem 2rem;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
          min-height: 44px;
          display: flex;
          align-items: center;
        }
        .success-link:hover { opacity: 0.85; transform: translateY(-1px); }
      `}</style>

      <div className="signup-root">
        <div className="card">

          {done ? (
            <div className="success-wrap">
              <div className="success-circle">
                <svg width="30" height="30" viewBox="0 0 24 24">
                  <polyline className="check-svg" points="4,13 9,18 20,7" />
                </svg>
              </div>
              <div>
                <div className="success-title">You're in! 🎉</div>
                <div className="success-body">
                  Account created successfully.<br />Check your inbox to verify your email.
                </div>
              </div>
              <a href="/login" className="success-link">
                Go to Login →
              </a>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="logo-mark">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="headline">Create your<br /><em>account.</em></h1>
              <p className="subline">Join the community. It only takes a minute.</p>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="field-group">

                  {/* Username */}
                  <div className="field-wrap">
                    <label className="field-label" htmlFor="username">Username</label>
                    <div className={`input-shell ${focused === 'username' ? 'is-focused' : ''}`}>
                      <span className="field-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      </span>
                      <input
                        className="field-input"
                        type="text"
                        id="username"
                        name="username"
                        placeholder="yourname"
                        required
                        autoComplete="username"
                        onFocus={() => setFocused('username')}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="field-wrap">
                    <label className="field-label" htmlFor="email">Email</label>
                    <div className={`input-shell ${focused === 'email' ? 'is-focused' : ''}`}>
                      <span className="field-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 7 10 7 10-7" />
                        </svg>
                      </span>
                      <input
                        className="field-input"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="field-wrap">
                    <label className="field-label" htmlFor="password">Password</label>
                    <div className={`input-shell ${focused === 'password' ? 'is-focused' : ''}`}>
                      <span className="field-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        className="field-input"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="Min. 8 characters"
                        required
                        autoComplete="new-password"
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused(null)}
                        onChange={e => calcStrength(e.target.value)}
                        style={{ paddingRight: '2.75rem' }}
                      />
                      <button
                        type="button"
                        className="toggle-pw"
                        onClick={() => setShowPassword(p => !p)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword
                          ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        }
                      </button>
                    </div>

                    {/* Strength meter */}
                    {strength > 0 && (
                      <div>
                        <div className="strength-bar-wrap">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="strength-seg">
                              {i <= strength && (
                                <div className="strength-seg-fill" style={{ background: strengthColors[strength] }} />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="strength-hint" style={{ color: strengthColors[strength] }}>
                          {strengthLabels[strength]} password
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <><div className="spinner" />Creating account…</>
                  ) : (
                    <>Create account <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
                  )}
                </button>
              </form>

              <p className="footer-note">
                Already have an account? <a href="/login">Sign in</a><br />
                <span style={{ fontSize: '0.72rem' }}>
                  By signing up you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}