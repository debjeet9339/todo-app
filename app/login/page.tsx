'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [focused, setFocused] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username || data.user?.username || '')
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
      router.push('/notes')
    } else {
      setError(data.message || 'Invalid email or password.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          min-height: 100dvh;
          background: #e8e4dc;
          background-image:
            radial-gradient(circle at 15% 50%, #ddd8ce 0%, transparent 55%),
            radial-gradient(circle at 85% 20%, #e2ddd5 0%, transparent 45%),
            radial-gradient(circle at 60% 85%, #d8d3c9 0%, transparent 40%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 480px) {
          .root { padding: 2rem; }
        }

        /* Dot grid */
        .root::after {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #b0aa9f 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.18;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-7px); }
          40%     { transform: translateX(7px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes errIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card {
          position: relative; z-index: 1;
          background: #faf8f4;
          border-radius: 20px;
          box-shadow:
            0 1px 0 #e0dbd2,
            0 6px 0 #e8e3da,
            0 2px 40px #0000001a,
            0 20px 60px #00000012;
          padding: 2rem 1.5rem 1.75rem;
          width: 100%;
          max-width: 430px;
          animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both;
        }

        @media (min-width: 480px) {
          .card {
            padding: 2.5rem 2.25rem 2.25rem;
          }
        }

        .card.shaking {
          animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both;
        }

        .logo-wrap { margin-bottom: 1.4rem; }

        .logo-icon {
          width: 46px; height: 46px;
          background: #1a1714;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px #1a171422;
        }

        @media (min-width: 480px) {
          .logo-icon { width: 52px; height: 52px; border-radius: 14px; }
          .logo-wrap { margin-bottom: 1.6rem; }
        }

        .headline {
          font-family: 'Lora', serif;
          font-size: 1.65rem;
          font-weight: 700;
          color: #1a1714;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
        }

        @media (min-width: 480px) {
          .headline { font-size: 2rem; }
        }

        .headline em { font-style: italic; font-weight: 600; }

        .subline {
          font-size: 0.85rem;
          color: #9c9288;
          font-weight: 300;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        @media (min-width: 480px) {
          .subline { font-size: 0.875rem; margin-bottom: 1.75rem; }
        }

        /* Error */
        .error-box {
          display: flex; align-items: center; gap: 8px;
          background: #fdf0ee;
          border: 1px solid #f5c8c0;
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          font-size: 0.8rem;
          color: #c0503a;
          animation: errIn 0.3s ease both;
          margin-bottom: 1rem;
        }

        /* Fields */
        .fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        @media (min-width: 480px) {
          .fields { margin-bottom: 1.25rem; }
        }

        .field-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b635a;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        @media (min-width: 480px) {
          .field-label { font-size: 0.72rem; }
        }

        .input-wrap {
          position: relative;
          border-radius: 12px;
          transition: box-shadow 0.2s;
        }
        .input-wrap.focused { box-shadow: 0 0 0 3px #c9a96e33; }

        .field-input {
          width: 100%;
          background: #f0ece5;
          border: 1.5px solid #e5dfd6;
          border-radius: 12px;
          padding: 0.75rem 1rem 0.75rem 2.6rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem; /* 16px — prevents iOS zoom */
          font-weight: 400;
          color: #1a1714;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          -webkit-appearance: none;
          appearance: none;
        }

        @media (min-width: 480px) {
          .field-input {
            padding: 0.8rem 1rem 0.8rem 2.75rem;
            font-size: 0.9rem;
          }
        }

        .field-input::placeholder { color: #c0b8ae; }
        .field-input:focus {
          border-color: #c9a96e;
          background: #faf8f4;
        }

        .field-ico {
          position: absolute;
          left: 0.8rem; top: 50%;
          transform: translateY(-50%);
          color: #c0b8ae;
          pointer-events: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .input-wrap.focused .field-ico { color: #c9a96e; }

        .pw-toggle {
          position: absolute;
          right: 0.75rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: #c0b8ae;
          padding: 6px; display: flex;
          align-items: center;
          justify-content: center;
          min-width: 32px; min-height: 32px;
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .pw-toggle:hover { color: #6b635a; }

        /* Forgot */
        .forgot {
          text-align: right;
          margin-top: -0.25rem;
          margin-bottom: 1.1rem;
        }

        @media (min-width: 480px) {
          .forgot { margin-top: -0.5rem; margin-bottom: 1.25rem; }
        }

        .forgot a {
          font-size: 0.75rem;
          color: #9c9288;
          text-decoration: none;
          transition: color 0.2s;
          padding: 4px 0; /* larger tap area */
          display: inline-block;
        }
        .forgot a:hover { color: #c9a96e; }

        /* Submit */
        .submit-btn {
          width: 100%;
          background: #1a1714;
          color: #faf8f4;
          border: none;
          border-radius: 12px;
          padding: 0.9rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px #1a171433;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          min-height: 48px;
        }

        @media (min-width: 480px) {
          .submit-btn { padding: 0.95rem 1rem; }
        }

        .submit-btn:hover:not(:disabled) {
          background: #2c2620;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px #1a171444;
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid #ffffff33;
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.78rem;
          color: #b5ada4;
          line-height: 1.7;
        }

        @media (min-width: 480px) {
          .footer { margin-top: 1.4rem; font-size: 0.8rem; }
        }

        .footer a {
          color: #6b635a;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: #c9a96e88;
          transition: color 0.2s;
        }
        .footer a:hover { color: #c9a96e; }
      `}</style>

      <div className="root">
        <div className={`card ${shake ? 'shaking' : ''}`}>

          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#c9a96e" />
                <path d="M2 12l10 5 10-5" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17l10 5 10-5" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h1 className="headline">
            Welcome<br /><em>back.</em>
          </h1>
          <p className="subline">Sign in to pick up where you left off.</p>

          {/* Error */}
          {error && (
            <div className="error-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="fields">

              {/* Email */}
              <div>
                <label className="field-label" htmlFor="email">Email</label>
                <div className={`input-wrap ${focused === 'email' ? 'focused' : ''}`}>
                  <span className="field-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 7 10 7 10-7" />
                    </svg>
                  </span>
                  <input
                    className="field-input"
                    type="email" id="email" name="email"
                    placeholder="you@example.com"
                    required autoComplete="email"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="field-label" htmlFor="password">Password</label>
                <div className={`input-wrap ${focused === 'password' ? 'focused' : ''}`}>
                  <span className="field-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    className="field-input"
                    type={showPassword ? 'text' : 'password'}
                    id="password" name="password"
                    placeholder="••••••••"
                    required autoComplete="current-password"
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot */}
            <div className="forgot">
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading
                ? <><div className="spinner" /> Signing in…</>
                : <>Sign in <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
              }
            </button>
          </form>

          <p className="footer">
            Don't have an account? <a href="/signup">Create one</a><br />
            <span style={{ fontSize: '0.72rem' }}>
              By signing in you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.
            </span>
          </p>

        </div>
      </div>
    </>
  )
}