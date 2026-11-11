import { useState } from 'react'
import {
  FiUser, FiCalendar, FiBookOpen, FiPhone,
  FiMail, FiLock, FiEye, FiEyeOff,
  FiArrowRight, FiAlertCircle, FiCheck, FiChevronDown
} from 'react-icons/fi'
import { LuBrain, LuGraduationCap } from 'react-icons/lu'
import API_URL from '../apiConfig.js'

export const ACADEMIC_CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
  '1st Year', '2nd Year', '3rd Year', '4th Year',
  'MBMS 1st Year', 'MBMS 2nd Year', 'MBMS 3rd Year', 'MBMS 4th Year', 'MBMS 5th Year'
]

export default function SignUp({ onNavigate, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentAge: '',
    collegeName: '',
    academicClass: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', score: 0, color: 'transparent' }
    let score = 0
    if (pwd.length >= 6) score += 1
    if (pwd.length >= 8) score += 1
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1
    if (/\d/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 2) return { label: 'Weak', score: 1, color: '#F4756A' }
    if (score <= 3) return { label: 'Medium', score: 2, color: '#F5C842' }
    return { label: 'Strong', score: 3, color: '#70E1B5' }
  }

  const strength = getPasswordStrength(formData.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    setSuccessMsg(null)

    // Field Validations
    if (!formData.studentName.trim()) {
      setError('Student Name is required.')
      return
    }

    const ageNum = parseInt(formData.studentAge, 10)
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
      setError('Please enter a valid Student Age between 5 and 100.')
      return
    }

    if (!formData.collegeName.trim()) {
      setError('School / College Name is required.')
      return
    }

    if (!formData.academicClass) {
      setError('Please select your Class / Academic Year.')
      return
    }

    // Phone validation supporting country codes
    const cleanDigits = formData.phoneNumber.replace(/\D/g, '')
    const phoneRegex = /^\+?[0-9\s\-().]{7,25}$/
    if (!phoneRegex.test(formData.phoneNumber.trim()) || cleanDigits.length < 7 || cleanDigits.length > 18) {
      setError('Please enter a valid Phone Number (supports international country codes, e.g., +91 98765 43210).')
      return
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please provide a valid Email ID (e.g., student@university.edu).')
      return
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify Confirm Password.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: formData.studentName.trim(),
          student_age: ageNum,
          college_name: formData.collegeName.trim(),
          academic_class: formData.academicClass,
          phone_number: formData.phoneNumber.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed. Please check your inputs.')
      }

      // Display success message and navigate to Sign In page
      setSuccessMsg('Account created successfully! Redirecting to Sign In...')
      setTimeout(() => {
        onNavigate('/signin', { registeredEmail: formData.email.trim() })
      }, 1600)
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('Unable to reach the server. Please check your connection or wait a moment for the instance to awaken.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px 11px 38px',
    borderRadius: 10,
    border: '1px solid rgba(112,225,181,.22)',
    background: 'rgba(9,44,36,.65)',
    color: '#F5FFF9',
    fontSize: 13.5,
    outline: 'none',
    transition: 'border .2s, box-shadow .2s',
  }

  const iconStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: 12,
    color: 'var(--muted)',
    fontSize: 15,
    pointerEvents: 'none',
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
          linear-gradient(rgba(112,225,181,.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(112,225,181,.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div className="glass-bright" style={{
        width: '100%',
        maxWidth: 580,
        padding: 'clamp(24px, 5vw, 36px) clamp(16px, 4vw, 32px)',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(112,225,181,.28)',
        boxShadow: '0 20px 60px rgba(0,0,0,.45)',
        animation: 'fadeSlideUp .35s ease both',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
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
            Create Your MindSpace Account
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>
            Join MindSpace and take the first step towards a healthier student lifestyle.
          </p>
        </div>

        {/* Success Notification */}
        {successMsg && (
          <div style={{
            padding: '14px 16px',
            borderRadius: 11,
            background: 'rgba(112,225,181,.14)',
            border: '1px solid rgba(112,225,181,.40)',
            color: '#B7F5D8',
            fontSize: 13.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            marginBottom: 20,
            animation: 'fadeIn .3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCheck size={18} style={{ color: 'var(--mint)', flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => onNavigate('/signin', { registeredEmail: formData.email.trim() })}
              style={{
                background: 'rgba(112,225,181,.2)',
                border: '1px solid rgba(112,225,181,.3)',
                color: '#F5FFF9',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Sign In Now
            </button>
          </div>
        )}

        {/* Error Notification */}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Section: Student Information */}
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--mint)',
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <FiUser size={12} />
            <span>Personal Information</span>
          </div>

          {/* 1. Student Name */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 5 }}>
              Student Name <span style={{ color: 'var(--mint)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiUser style={iconStyle} />
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* 2. Student Age & 4. Class / Academic Year in a responsive layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: 12 }}>
            {/* 2. Student Age */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 5 }}>
                Student Age <span style={{ color: 'var(--mint)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <FiCalendar style={iconStyle} />
                <input
                  type="number"
                  name="studentAge"
                  min="5"
                  max="100"
                  value={formData.studentAge}
                  onChange={handleChange}
                  placeholder="Age (5–100)"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 4. Class / Academic Year */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 5 }}>
                Class / Academic Year <span style={{ color: 'var(--mint)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <LuGraduationCap style={iconStyle} />
                <select
                  name="academicClass"
                  value={formData.academicClass}
                  onChange={handleChange}
                  required
                  style={{
                    ...inputStyle,
                    paddingRight: 32,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled style={{ background: '#0A3328', color: '#888' }}>
                    Select Class / Year
                  </option>
                  {ACADEMIC_CLASSES.map(cls => (
                    <option key={cls} value={cls} style={{ background: '#0A3328', color: '#F5FFF9' }}>
                      {cls}
                    </option>
                  ))}
                </select>
                <FiChevronDown style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: 12,
                  color: 'var(--muted)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>
          </div>

          {/* 3. School / College Name */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 5 }}>
              School / College Name <span style={{ color: 'var(--mint)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiBookOpen style={iconStyle} />
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="Enter your school, college, or university name"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* 5. Phone Number */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 5 }}>
              Phone Number <span style={{ color: 'var(--mint)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiPhone style={iconStyle} />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210 (with country code)"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* 6. Email ID */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 5 }}>
              Email ID <span style={{ color: 'var(--mint)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail style={iconStyle} />
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

          {/* 7. Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#cce8de' }}>
                Password <span style={{ color: 'var(--mint)' }}>*</span>
              </label>
              {formData.password && (
                <span style={{ fontSize: 11, fontWeight: 600, color: strength.color }}>
                  {strength.label}
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <FiLock style={iconStyle} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                style={{ ...inputStyle, paddingRight: 38 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: 12,
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
            {/* Strength meter bar */}
            {formData.password && (
              <div style={{
                display: 'flex', gap: 4, marginTop: 6, height: 3, borderRadius: 2, overflow: 'hidden'
              }}>
                {[1, 2, 3].map(step => (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      background: strength.score >= step ? strength.color : 'rgba(255,255,255,.1)',
                      transition: 'background .3s ease',
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 8. Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cce8de', marginBottom: 5 }}>
              Confirm Password <span style={{ color: 'var(--mint)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock style={iconStyle} />
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                style={{ ...inputStyle, paddingRight: 38 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(p => !p)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: 12,
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {/* Action Button: Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="btn-emerald"
            style={{
              marginTop: 10,
              width: '100%',
              padding: '13px 20px',
              fontSize: 14.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.75 : 1,
              borderRadius: 11,
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Bottom Link: Already have an account? Sign In */}
        <div style={{
          marginTop: 22,
          paddingTop: 18,
          borderTop: '1px solid rgba(112,225,181,.12)',
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--muted)',
        }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/signin')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--mint)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              fontSize: 13,
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </section>
  )
}
