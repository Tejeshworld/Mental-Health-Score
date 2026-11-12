import { useState } from 'react'
import {
  FiMail, FiKey, FiLock, FiEye, FiEyeOff,
  FiArrowRight, FiAlertCircle, FiCheck, FiInfo, FiArrowLeft
} from 'react-icons/fi'
import { LuBrain } from 'react-icons/lu'
import API_URL from '../apiConfig.js'

export default function ForgotPassword({ onNavigate }) {
  const [step, setStep] = useState(1) // 1: Request token, 2: Reset with token
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [devNote, setDevNote] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const handleRequestToken = async (e) => {
    e.preventDefault()
    setError(null)
    setDevNote(null)

    if (!email.trim()) {
      setError('Please provide your registered email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Could not generate reset request.')
      }

      if (data.reset_token) {
        setResetToken(data.reset_token)
        setDevNote(data.note || 'Development Mode: Secure reset token generated below. In production, configure an SMTP service (e.g., SendGrid, Postmark) to dispatch this link directly to the student’s inbox.')
        setStep(2)
      } else {
        setDevNote('If an account is associated with this email address, reset instructions have been recorded.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError(null)

    if (!resetToken.trim()) {
      setError('Please provide the reset token.')
      return
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetToken.trim(),
          new_password: newPassword,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to reset password.')
      }

      setSuccessMsg('Your password has been successfully updated. Redirecting to Sign In…')
      setTimeout(() => {
        onNavigate('signin')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px 12px 38px',
    borderRadius: 11,
    border: '1px solid rgba(130, 210, 175, 0.16)',
    background: '#081511',
    color: '#F4F8F5',
    fontSize: 14,
    outline: 'none',
  }

  return (
    <section className="bg-campus" style={{
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px clamp(12px, 4vw, 5%) 60px',
      position: 'relative',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(54, 214, 160, .02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(54, 214, 160, .02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div className="glass-bright" style={{
        width: '100%',
        maxWidth: 480,
        padding: 'clamp(24px, 5vw, 38px) clamp(16px, 4vw, 32px)',
        position: 'relative',
        zIndex: 1,
        background: '#0B1D17',
        border: '1px solid rgba(130, 210, 175, 0.16)',
        boxShadow: '0 20px 60px rgba(0,0,0,.60)',
        animation: 'fadeSlideUp .35s ease both',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #28A77B, #36D6A0)',
            boxShadow: '0 0 24px rgba(54, 214, 160, 0.35)',
            display: 'grid', placeItems: 'center',
            color: '#050B09', fontSize: 24,
            margin: '0 auto 14px',
          }}>
            <LuBrain />
          </div>
          <h2 style={{
            font: "700 24px 'Space Grotesk'",
            color: '#F4F8F5',
            marginBottom: 6,
          }}>
            Password Recovery
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>
            {step === 1
              ? 'Enter your registered email to request password reset instructions.'
              : 'Enter your verification token and choose a new password.'}
          </p>
        </div>

        {/* Development Note */}
        {devNote && (
          <div style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: 'rgba(54, 214, 160, 0.08)',
            border: '1px solid rgba(54, 214, 160, 0.20)',
            color: '#C8DBD2',
            fontSize: 12,
            lineHeight: 1.6,
            display: 'flex',
            gap: 8,
            marginBottom: 18,
          }}>
            <FiInfo size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--mint)' }} />
            <span>{devNote}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            padding: '11px 14px',
            borderRadius: 10,
            background: 'rgba(244,117,106,.12)',
            border: '1px solid rgba(244,117,106,.35)',
            color: '#F4A49E',
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 18,
          }}>
            <FiAlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: 'rgba(54, 214, 160, 0.10)',
            border: '1px solid rgba(54, 214, 160, 0.25)',
            color: '#65E6BB',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 18,
          }}>
            <FiCheck size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 6 }}>
                Registered Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', top: 14, left: 13, color: 'var(--muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 6, padding: '13px' }}
            >
              {loading ? <><span className="spinner-sm" /> Processing…</> : <>Generate Reset Token <FiArrowRight size={15} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 6 }}>
                Reset Token
              </label>
              <div style={{ position: 'relative' }}>
                <FiKey style={{ position: 'absolute', top: 14, left: 13, color: 'var(--muted)' }} />
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste or verify token"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 6 }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', top: 14, left: 13, color: 'var(--muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', top: 13, right: 12,
                    color: 'var(--muted)', background: 'none',
                    border: 'none', cursor: 'pointer',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 6 }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', top: 14, left: 13, color: 'var(--muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 6, padding: '13px' }}
            >
              {loading ? <><span className="spinner-sm" /> Updating…</> : <>Save New Password <FiCheck size={15} /></>}
            </button>
          </form>
        )}

        {/* Back to Sign In */}
        <div style={{
          textAlign: 'center',
          marginTop: 22,
          paddingTop: 16,
          borderTop: '1px solid rgba(130, 210, 175, 0.10)',
        }}>
          <button
            onClick={() => onNavigate('signin')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--mint)',
              fontSize: 13,
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <FiArrowLeft size={14} /> Back to Sign In
          </button>
        </div>
      </div>
    </section>
  )
}

