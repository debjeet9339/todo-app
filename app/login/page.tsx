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
      localStorage.setItem("username", data.username)
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
          background: #e8e4dc;
          background-image:
            radial-gradient(circle at 15% 50%, #ddd8ce 0%, transparent 55%),
            radial-gradient(circle at 85% 20%, #e2ddd5 0%, transparent 45%),
            radial-gradient(circle at 60% 85%, #d8d3c9 0%, transparent 40%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        /* Dot grid — matches screenshot */
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
          padding: 2.5rem 2.25rem 2.25rem;
          width: 100%; max-width: 430px;
          animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both;
        }
        .card.shaking {
          animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both;
        }

        /* Logo icon — matches dark rounded square */
        .logo-wrap {
          margin-bottom: 1.6rem;
        }
        .logo-icon {
          width: 52px; height: 52px;
          background: #1a1714;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px #1a171422;
        }

        /* Headline — Lora serif with italic second line, matches screenshot exactly */
        .headline {
          font-family: 'Lora', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1714;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 0.45rem;
        }
        .headline em {
          font-style: italic;
          font-weight: 600;
        }
        .subline {
          font-size: 0.875rem;
          color: #9c9288;
          font-weight: 300;
          margin-bottom: 1.75rem;
          line-height: 1.5;
        }

        /* Social buttons */
        .social-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 1.4rem;
        }
        .social-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #f0ece5;
          border: 1.5px solid #e5dfd6;
          border-radius: 10px;
          padding: 0.7rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: #3a3530;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
          text-decoration: none;
        }
        .social-btn:hover {
          background: #ebe5dd;
          border-color: #d8d0c5;
          transform: translateY(-1px);
        }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 1.4rem;
        }
        .div-line { flex: 1; height: 1px; background: #e0d9d0; }
        .div-text {
          font-size: 0.7rem;
          color: #b5ada4;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
          white-space: nowrap;
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
        .fields { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem; }

        .field-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: #6b635a;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .input-wrap {
          position: relative;
          border-radius: 12px;
          transition: box-shadow 0.2s;
        }
        .input-wrap.focused {
          box-shadow: 0 0 0 3px #c9a96e33;
        }

        .field-input {
          width: 100%;
          background: #f0ece5;
          border: 1.5px solid #e5dfd6;
          border-radius: 12px;
          padding: 0.8rem 1rem 0.8rem 2.75rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: #1a1714;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          -webkit-appearance: none;
        }
        .field-input::placeholder { color: #c0b8ae; }
        .field-input:focus {
          border-color: #c9a96e;
          background: #faf8f4;
        }

        .field-ico {
          position: absolute;
          left: 0.875rem; top: 50%;
          transform: translateY(-50%);
          color: #c0b8ae;
          pointer-events: none;
          transition: color 0.2s;
        }
        .input-wrap.focused .field-ico { color: #c9a96e; }

        .pw-toggle {
          position: absolute;
          right: 0.875rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: #c0b8ae;
          padding: 4px; display: flex;
          transition: color 0.2s;
        }
        .pw-toggle:hover { color: #6b635a; }

        /* Forgot */
        .forgot {
          text-align: right;
          margin-top: -0.5rem;
          margin-bottom: 1.25rem;
        }
        .forgot a {
          font-size: 0.75rem;
          color: #9c9288;
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot a:hover { color: #c9a96e; }

        /* Submit — dark pill, matches screenshot */
        .submit-btn {
          width: 100%;
          background: #1a1714;
          color: #faf8f4;
          border: none;
          border-radius: 12px;
          padding: 0.95rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px #1a171433;
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
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 1.4rem;
          font-size: 0.8rem;
          color: #b5ada4;
          line-height: 1.6;
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
              {/* Layers icon matching screenshot */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#c9a96e"/>
                <path d="M2 12l10 5 10-5" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h1 className="headline">
            Welcome<br /><em>back.</em>
          </h1>
          <p className="subline">Sign in to pick up where you left off.</p>

          {/* Social */}
          <div className="social-row">
            <button className="social-btn" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="social-btn" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1714">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="div-line"/>
            <span className="div-text">or continue with email</span>
            <div className="div-line"/>
          </div>

          {/* Error */}
          {error && (
            <div className="error-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
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
                      <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/>
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
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
                  <button type="button" className="pw-toggle" onClick={() => setShowPassword(p => !p)} aria-label="Toggle password">
                    {showPassword
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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
                ? <><div className="spinner"/> Signing in…</>
                : <>Sign in <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              }
            </button>
          </form>

          <p className="footer">
            Don't have an account? <a href="/signup">Create one</a><br/>
            <span style={{ fontSize: '0.72rem' }}>
              By signing in you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.
            </span>
          </p>

        </div>
      </div>
    </>
  )
}