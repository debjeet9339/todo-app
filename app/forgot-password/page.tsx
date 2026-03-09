'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'email' | 'sent' | 'reset' | 'done'

export default function ForgotPassword() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [focused, setFocused] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Form values
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [strength, setStrength] = useState(0)

  const triggerShake = (msg: string) => {
    setError(msg)
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const calcStrength = (val: string) => {
    let s = 0
    if (val.length >= 8) s++
    if (/[A-Z]/.test(val)) s++
    if (/[0-9]/.test(val)) s++
    if (/[^A-Za-z0-9]/.test(val)) s++
    setStrength(s)
  }

  // Step 1 — send OTP email
  const handleSendEmail = async () => {
    if (!email.trim()) return triggerShake('Please enter your email.')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) return triggerShake(data.message || 'Could not send reset email.')
      setStep('sent')
    } catch {
      triggerShake('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — verify OTP
  const handleVerifyOtp = async () => {
    const code = otp.join('')
    if (code.length < 6) return triggerShake('Please enter the full 6-digit code.')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      })
      const data = await res.json()
      if (!res.ok) return triggerShake(data.message || 'Invalid or expired code.')
      setStep('reset')
    } catch {
      triggerShake('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 3 — reset password
  const handleResetPassword = async () => {
    if (password.length < 8) return triggerShake('Password must be at least 8 characters.')
    if (password !== confirm) return triggerShake('Passwords do not match.')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), password }),
      })
      const data = await res.json()
      if (!res.ok) return triggerShake(data.message || 'Could not reset password.')
      setStep('done')
    } catch {
      triggerShake('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // OTP input handler
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus()
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh; min-height: 100dvh;
          background: #e8e4dc;
          background-image:
            radial-gradient(circle at 15% 50%, #ddd8ce 0%, transparent 55%),
            radial-gradient(circle at 85% 20%, #e2ddd5 0%, transparent 45%),
            radial-gradient(circle at 60% 85%, #d8d3c9 0%, transparent 40%);
          display: flex; align-items: center; justify-content: center;
          padding: 1.25rem;
          position: relative; overflow: hidden;
        }

        @media (min-width: 480px) { .root { padding: 2rem; } }

        .root::after {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #b0aa9f 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.18; pointer-events: none; z-index: 0;
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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes errIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
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
        @keyframes barGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
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
          width: 100%; max-width: 430px;
          animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both;
          transition: min-height 0.3s ease;
        }

        @media (min-width: 480px) { .card { padding: 2.5rem 2.25rem 2.25rem; } }

        .card.shaking { animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }

        /* Step content animation */
        .step-content { animation: stepIn 0.35s cubic-bezier(.22,1,.36,1) both; }

        /* ── Logo ── */
        .logo-wrap { margin-bottom: 1.4rem; }
        .logo-icon {
          width: 46px; height: 46px; background: #1a1714;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px #1a171422;
        }
        @media (min-width: 480px) {
          .logo-icon { width: 52px; height: 52px; border-radius: 14px; }
          .logo-wrap { margin-bottom: 1.6rem; }
        }

        /* ── Step indicator ── */
        .step-dots {
          display: flex; gap: 6px;
          margin-bottom: 1.5rem;
        }
        .step-dot {
          height: 3px; border-radius: 99px;
          background: #e5dfd6;
          transition: background 0.3s, flex 0.3s;
          flex: 1;
        }
        .step-dot.active { background: #c9a96e; flex: 2; }
        .step-dot.done { background: #22c55e; }

        /* ── Headline ── */
        .headline {
          font-family: 'Lora', serif;
          font-size: 1.55rem; font-weight: 700;
          color: #1a1714; line-height: 1.15;
          letter-spacing: -0.02em; margin-bottom: 0.4rem;
        }
        @media (min-width: 480px) { .headline { font-size: 1.85rem; } }
        .headline em { font-style: italic; font-weight: 600; }

        .subline {
          font-size: 0.85rem; color: #9c9288;
          font-weight: 300; margin-bottom: 1.5rem; line-height: 1.6;
        }
        .subline strong { color: #6b635a; font-weight: 500; }

        /* ── Error ── */
        .error-box {
          display: flex; align-items: center; gap: 8px;
          background: #fdf0ee; border: 1px solid #f5c8c0;
          border-radius: 10px; padding: 0.65rem 0.9rem;
          font-size: 0.8rem; color: #c0503a;
          animation: errIn 0.3s ease both;
          margin-bottom: 1rem;
        }

        /* ── Fields ── */
        .field-wrap { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
        .field-label {
          font-size: 0.7rem; font-weight: 600;
          color: #6b635a; letter-spacing: 0.09em;
          text-transform: uppercase;
        }
        .input-shell {
          position: relative; border-radius: 12px;
          transition: box-shadow 0.2s;
        }
        .input-shell.focused { box-shadow: 0 0 0 3px #c9a96e33; }

        .field-input {
          width: 100%; background: #f0ece5;
          border: 1.5px solid #e5dfd6; border-radius: 12px;
          padding: 0.75rem 1rem 0.75rem 2.6rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem; font-weight: 400;
          color: #1a1714; outline: none;
          transition: border-color 0.2s, background 0.2s;
          -webkit-appearance: none; appearance: none;
        }
        @media (min-width: 480px) { .field-input { font-size: 0.9rem; } }
        .field-input::placeholder { color: #c0b8ae; }
        .field-input:focus { border-color: #c9a96e; background: #faf8f4; }

        .field-ico {
          position: absolute; left: 0.8rem; top: 50%;
          transform: translateY(-50%);
          color: #c0b8ae; pointer-events: none;
          transition: color 0.2s; display: flex; align-items: center;
        }
        .input-shell.focused .field-ico { color: #c9a96e; }

        .pw-toggle {
          position: absolute; right: 0.75rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #c0b8ae; padding: 6px; display: flex;
          align-items: center; justify-content: center;
          min-width: 32px; min-height: 32px;
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .pw-toggle:hover { color: #6b635a; }

        /* ── OTP boxes ── */
        .otp-row {
          display: flex; gap: 8px;
          margin-bottom: 1.25rem;
          justify-content: center;
        }
        @media (min-width: 360px) { .otp-row { gap: 10px; } }

        .otp-input {
          width: 44px; height: 52px;
          background: #f0ece5;
          border: 1.5px solid #e5dfd6;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1.3rem; font-weight: 600;
          color: #1a1714;
          text-align: center; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none; appearance: none;
          caret-color: #c9a96e;
          flex: 1; max-width: 52px;
        }
        .otp-input:focus {
          border-color: #c9a96e; background: #faf8f4;
          box-shadow: 0 0 0 3px #c9a96e33;
        }
        .otp-input.filled { border-color: #c9a96e88; background: #fdf8f0; }

        /* ── Strength bar ── */
        .strength-bar-wrap { display: flex; gap: 5px; margin-top: 8px; }
        .strength-seg {
          flex: 1; height: 3px; border-radius: 99px;
          background: #e5dfd6; overflow: hidden;
        }
        .strength-seg-fill {
          height: 100%; border-radius: 99px;
          transform-origin: left;
          animation: barGrow 0.3s ease;
        }
        .strength-hint { font-size: 0.7rem; color: #9c9288; margin-top: 5px; }

        /* ── Submit button ── */
        .submit-btn {
          width: 100%; background: #1a1714; color: #faf8f4;
          border: none; border-radius: 12px; padding: 0.9rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px #1a171433;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; min-height: 48px;
          margin-top: 0.25rem;
        }
        .submit-btn:hover:not(:disabled) {
          background: #2c2620; transform: translateY(-2px);
          box-shadow: 0 8px 24px #1a171444;
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid #ffffff33; border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }

        /* ── Resend ── */
        .resend-row {
          text-align: center; margin-top: 1rem;
          font-size: 0.78rem; color: #b5ada4;
        }
        .resend-btn {
          background: none; border: none; cursor: pointer;
          color: #6b635a; font-size: 0.78rem;
          font-family: 'DM Sans', sans-serif;
          text-decoration: underline; text-underline-offset: 3px;
          text-decoration-color: #c9a96e88;
          padding: 4px; transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .resend-btn:hover { color: #c9a96e; }

        /* ── Back link ── */
        .back-link {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.78rem; color: #9c9288;
          text-decoration: none; margin-top: 1.25rem;
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .back-link:hover { color: #c9a96e; }

        /* ── Success ── */
        .success-wrap {
          display: flex; flex-direction: column;
          align-items: center; text-align: center; gap: 1rem;
          padding: 0.5rem 0;
          animation: stepIn 0.4s cubic-bezier(.22,1,.36,1) both;
        }
        .success-circle {
          width: 68px; height: 68px;
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          animation: successPop 0.5s cubic-bezier(.22,1,.36,1) both;
          box-shadow: 0 8px 24px #22c55e22;
        }
        .check-svg {
          stroke: #16a34a; stroke-width: 2.5;
          stroke-linecap: round; stroke-linejoin: round;
          fill: none; stroke-dasharray: 40;
          animation: checkDraw 0.5s ease 0.3s both;
        }
        .success-title {
          font-family: 'Lora', serif;
          font-size: 1.3rem; font-weight: 700;
          color: #1a1714; margin-bottom: 4px;
        }
        .success-body {
          font-size: 0.85rem; color: #9c9288; line-height: 1.6;
        }
        .go-login {
          display: inline-flex; align-items: center;
          margin-top: 8px; background: #1a1714; color: #fff;
          border-radius: 10px; padding: 0.75rem 2rem;
          font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.05em; text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
          min-height: 44px;
        }
        .go-login:hover { opacity: 0.85; transform: translateY(-1px); }

        /* ── Email chip ── */
        .email-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0ece5; border: 1px solid #e5dfd6;
          border-radius: 8px; padding: 4px 10px;
          font-size: 0.78rem; color: #4a3f38; font-weight: 500;
          margin-bottom: 1.25rem;
        }
      `}</style>

      <div className="root">
        <div className={`card ${shake ? 'shaking' : ''}`}>

          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#c9a96e"/>
                <path d="M2 12l10 5 10-5" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
            </div>
          </div>

          {/* Step dots — only for steps 1–3 */}
          {step !== 'done' && (
            <div className="step-dots">
              {(['email','sent','reset'] as Step[]).map((s, i) => (
                <div key={s} className={`step-dot ${step === s ? 'active' : (
                  ['email','sent','reset'].indexOf(step) > i ? 'done' : ''
                )}`} />
              ))}
            </div>
          )}

          {/* ── STEP 1: Enter email ── */}
          {step === 'email' && (
            <div className="step-content">
              <h1 className="headline">Forgot your<br /><em>password?</em></h1>
              <p className="subline">No worries. Enter your email and we'll send you a reset code.</p>

              {error && (
                <div className="error-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="field-wrap">
                <label className="field-label" htmlFor="email">Email address</label>
                <div className={`input-shell ${focused === 'email' ? 'focused' : ''}`}>
                  <span className="field-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/>
                    </svg>
                  </span>
                  <input
                    className="field-input"
                    type="email" id="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    onKeyDown={e => e.key === 'Enter' && handleSendEmail()}
                    autoComplete="email" required
                  />
                </div>
              </div>

              <button className="submit-btn" onClick={handleSendEmail} disabled={loading}>
                {loading
                  ? <><div className="spinner"/> Sending code…</>
                  : <>Send reset code <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                }
              </button>

              <div style={{ textAlign: 'center' }}>
                <a href="/login" className="back-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                  Back to sign in
                </a>
              </div>
            </div>
          )}

          {/* ── STEP 2: Enter OTP ── */}
          {step === 'sent' && (
            <div className="step-content">
              <h1 className="headline">Check your<br /><em>inbox.</em></h1>
              <p className="subline">
                We sent a 6-digit code to<br />
                <strong>{email}</strong>
              </p>

              {error && (
                <div className="error-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="otp-row" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    className={`otp-input ${digit ? 'filled' : ''}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <button className="submit-btn" onClick={handleVerifyOtp} disabled={loading}>
                {loading
                  ? <><div className="spinner"/> Verifying…</>
                  : <>Verify code <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                }
              </button>

              <div className="resend-row">
                Didn't get it?{' '}
                <button className="resend-btn" onClick={() => { setOtp(['','','','','','']); handleSendEmail(); }}>
                  Resend code
                </button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button className="back-link" onClick={() => { setStep('email'); setError(null); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                  Change email
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: New password ── */}
          {step === 'reset' && (
            <div className="step-content">
              <h1 className="headline">New<br /><em>password.</em></h1>
              <p className="subline">Almost there — choose a strong password to secure your account.</p>

              {error && (
                <div className="error-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* New password */}
              <div className="field-wrap">
                <label className="field-label" htmlFor="password">New password</label>
                <div className={`input-shell ${focused === 'password' ? 'focused' : ''}`}>
                  <span className="field-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    className="field-input"
                    type={showPassword ? 'text' : 'password'}
                    id="password" placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => { setPassword(e.target.value); calcStrength(e.target.value) }}
                    onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                    autoComplete="new-password"
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPassword(p => !p)} aria-label="Toggle password">
                    {showPassword
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {strength > 0 && (
                  <div>
                    <div className="strength-bar-wrap">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="strength-seg">
                          {i <= strength && <div className="strength-seg-fill" style={{ background: strengthColors[strength] }} />}
                        </div>
                      ))}
                    </div>
                    <div className="strength-hint" style={{ color: strengthColors[strength] }}>
                      {strengthLabels[strength]} password
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="field-wrap">
                <label className="field-label" htmlFor="confirm">Confirm password</label>
                <div className={`input-shell ${focused === 'confirm' ? 'focused' : ''}`}>
                  <span className="field-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                    </svg>
                  </span>
                  <input
                    className="field-input"
                    type={showConfirm ? 'text' : 'password'}
                    id="confirm" placeholder="Re-enter password"
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                    autoComplete="new-password"
                    style={{
                      paddingRight: '2.75rem',
                      borderColor: confirm && confirm !== password ? '#f5c8c0' : undefined,
                    }}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowConfirm(p => !p)} aria-label="Toggle confirm">
                    {showConfirm
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <div style={{ fontSize: '0.7rem', color: '#c0503a', marginTop: 5 }}>Passwords don't match</div>
                )}
                {confirm && confirm === password && password.length >= 8 && (
                  <div style={{ fontSize: '0.7rem', color: '#22c55e', marginTop: 5 }}>✓ Passwords match</div>
                )}
              </div>

              <button className="submit-btn" onClick={handleResetPassword} disabled={loading}>
                {loading
                  ? <><div className="spinner"/> Resetting…</>
                  : <>Reset password <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                }
              </button>
            </div>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 'done' && (
            <div className="success-wrap">
              <div className="success-circle">
                <svg width="30" height="30" viewBox="0 0 24 24">
                  <polyline className="check-svg" points="4,13 9,18 20,7" />
                </svg>
              </div>
              <div>
                <div className="success-title">Password reset! 🎉</div>
                <div className="success-body">
                  Your password has been updated.<br />You can now sign in with your new password.
                </div>
              </div>
              <a href="/login" className="go-login">Go to Sign In →</a>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
