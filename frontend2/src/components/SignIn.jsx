import { useState, useEffect } from 'react'
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiArrowRight, FiAlertCircle, FiCheck, FiUserPlus
} from 'react-icons/fi'
import { LuBrain } from 'react-icons/lu'

export default function SignIn({ onNavigate, onAuthSuccess, initialEmail }) {
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    password: '',
    rememberMe: true,
  })

  useEffect(() => {
    if (initialEmail) {
      setFormData(prev => ({ ...prev, email: initialEmail }))
    }
  }, [initialEmail])

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successNotice, setSuccessNotice] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setError(null)

    // Validations
    const cleanEmail = formData.email.trim()
    if (!cleanEmail) {
      setError('Please enter your registered Email ID.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      setError('Please provide a valid Email ID.')
      return
    }

    if (!formData.password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: formData.password,
          remember_me: formData.rememberMe,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid email address or password.')
      }

      // Store auth session
      localStorage.setItem('mindspace_auth_token', data.token)
      localStorage.setItem('mindspace_user', JSON.stringify(data.user))
      setSuccessNotice('Signed in successfully! Opening your dashboard...')

      setTimeout(() => {
        onAuthSuccess(data.user, data.token)
        onNavigate('/dashboard')
      }, 700)
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
    border: '1px solid rgba(112,225,181,.22)',
    background: 'rgba(9,44,36,.65)',
    color: '#F5FFF9',
    fontSize: 14,
    outline: 'none',
    transition: 'border .2s, box-shadow .2s',
  }

  return (
    <section className="bg-campus" style={{
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 5% 60px',
      position: 'relative',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(112,225,181,.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(112,225,181,.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div className="glass-bright" style={{
        width: '100%',
        maxWidth: 460,
        padding: '38px 32px',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(112,225,181,.28)',
        boxShadow: '0 20px 60px rgba(0,0,0,.45)',
        animation: 'fadeSlideUp .35s ease both',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #1DB87A, #70E1B5)',
            boxShadow: '0 0 24px rgba(112,225,181,.40)',
            display: 'grid', placeItems: 'center',
            color: '#082820', fontSize: 24,
            margin: '0 auto 14px',
          }}>
            <LuBrain />
          </div>
          <h2 style={{
            font: "700 24px 'Space Grotesk'",
            color: '#F5FFF9',
            marginBottom: 6,
          }}>
            Welcome Back to MindSpace
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>
            Your student wellbeing journey continues here.
          </p>
        </div>

        {/* Success message */}
        {successNotice && (
          <div style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: 'rgba(112,225,181,.14)',
            border: '1px solid rgba(112,225,181,.40)',
            color: '#B7F5D8',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 18,
          }}>
            <FiCheck size={16} />
            <span>{successNotice}</span>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email ID */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 6 }}>
              Email ID <span style={{ color: 'var(--mint)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', top: 14, left: 13, color: 'var(--muted)' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@university.edu"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#cce8de' }}>
                Password <span style={{ color: 'var(--mint)' }}>*</span>
              </label>
              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                style={{
                  fontSize: 11.5,
                  color: 'var(--mint)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', top: 14, left: 13, color: 'var(--muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              style={{
                accentColor: 'var(--mint)',
                width: 15,
                height: 15,
                cursor: 'pointer',
              }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>
              Remember me on this browser
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-emerald"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: 10,
              padding: '13px',
              fontSize: 14.5,
              fontWeight: 700,
              borderRadius: 11,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Link to Sign Up */}
        <div style={{
          textAlign: 'center',
          marginTop: 22,
          paddingTop: 16,
          borderTop: '1px solid rgba(112,225,181,.12)',
          fontSize: 13,
          color: 'var(--muted)',
        }}>
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('/signup')}
            style={{
              color: 'var(--mint)',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              fontSize: 13,
            }}
          >
            Create Student Account
          </button>
        </div>
      </div>
    </section>
  )
}
