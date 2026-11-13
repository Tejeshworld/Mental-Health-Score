import { useState, useEffect } from 'react'
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiBookOpen,
  FiEdit2, FiCheck, FiX, FiLogOut, FiActivity,
  FiClock, FiTrendingUp, FiArrowRight, FiAlertCircle,
  FiLock, FiChevronDown, FiShield, FiAward
} from 'react-icons/fi'
import { LuBrain, LuGraduationCap, LuSparkles } from 'react-icons/lu'
import { ACADEMIC_CLASSES } from './SignUp.jsx'
import API_URL from '../apiConfig.js'
import { getSignalClassification } from '../utils/signalClassification'

export default function StudentProfile({ user, token, onSignOut, onStartAssessment, onUpdateUser }) {
  const [profile, setProfile] = useState(user)
  const [activity, setActivity] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    studentName: user?.student_name || user?.full_name || '',
    studentAge: user?.student_age || '',
    collegeName: user?.college_name || user?.college || '',
    academicClass: user?.academic_class || '1st Year',
    phoneNumber: user?.phone_number || '',
  })
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // Fetch full profile and real activity history from backend
  useEffect(() => {
    let isMounted = true
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!res.ok) {
          throw new Error('Failed to load profile data.')
        }
        const data = await res.json()
        if (isMounted) {
          setProfile(data.user)
          setActivity(data.activity)
          setEditForm({
            studentName: data.user.student_name || data.user.full_name || '',
            studentAge: data.user.student_age || '',
            collegeName: data.user.college_name || data.user.college || '',
            academicClass: data.user.academic_class || '1st Year',
            phoneNumber: data.user.phone_number || '',
          })
          onUpdateUser?.(data.user)
        }
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (token) {
      fetchProfile()
    } else {
      setLoading(false)
    }

    return () => { isMounted = false }
  }, [token])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaveLoading(true)
    setError(null)
    setSuccessMsg(null)

    // Validations
    if (!editForm.studentName.trim()) {
      setError('Student Name cannot be empty.')
      setSaveLoading(false)
      return
    }

    const ageNum = parseInt(editForm.studentAge, 10)
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
      setError('Student Age must be a valid number between 5 and 100.')
      setSaveLoading(false)
      return
    }

    if (!editForm.collegeName.trim()) {
      setError('School / College Name cannot be empty.')
      setSaveLoading(false)
      return
    }

    if (!editForm.academicClass) {
      setError('Please select your Class / Academic Year.')
      setSaveLoading(false)
      return
    }

    const cleanDigits = editForm.phoneNumber.replace(/\D/g, '')
    const phoneRegex = /^\+?[0-9\s\-().]{7,25}$/
    if (!phoneRegex.test(editForm.phoneNumber.trim()) || cleanDigits.length < 7 || cleanDigits.length > 18) {
      setError('Please provide a valid Phone Number (supports international country codes).')
      setSaveLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_name: editForm.studentName.trim(),
          student_age: ageNum,
          college_name: editForm.collegeName.trim(),
          academic_class: editForm.academicClass,
          phone_number: editForm.phoneNumber.trim(),
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Could not update profile.')
      }

      setProfile(data.user)
      if (data.activity) setActivity(data.activity)
      onUpdateUser?.(data.user)
      localStorage.setItem('mindspace_user', JSON.stringify(data.user))
      setIsEditing(false)
      setSuccessMsg('Profile changes saved successfully!')
      setTimeout(() => setSuccessMsg(null), 3500)
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('Cannot connect to the server. Please check your connection or wait a moment for the instance to awaken.')
      } else {
        setError(err.message)
      }
    } finally {
      setSaveLoading(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setError(null)
    setEditForm({
      studentName: profile?.student_name || profile?.full_name || '',
      studentAge: profile?.student_age || '',
      collegeName: profile?.college_name || profile?.college || '',
      academicClass: profile?.academic_class || '1st Year',
      phoneNumber: profile?.phone_number || '',
    })
  }

  const getInitials = (name) => {
    if (!name) return 'ST'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px 11px 38px',
    borderRadius: 10,
    border: '1px solid rgba(130, 210, 175, 0.16)',
    background: '#081511',
    color: '#F4F8F5',
    fontSize: 13.5,
    outline: 'none',
    transition: 'border .2s, box-shadow .2s',
  }

  const iconStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: 13,
    color: 'var(--muted)',
    fontSize: 14,
    pointerEvents: 'none',
  }

  const studentName = profile?.student_name || profile?.full_name || 'Student'
  const latestScore = activity?.latest_predicted_score !== null && activity?.latest_predicted_score !== undefined
    ? Number(activity.latest_predicted_score)
    : null

  return (
    <section className="bg-campus" style={{
      minHeight: 'calc(100vh - 140px)',
      padding: '30px clamp(12px, 4vw, 5%) 70px',
      maxWidth: 1300,
      margin: '0 auto',
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Editorial Welcome Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: '1px solid rgba(130, 210, 175, 0.10)',
        }}>
          <div>
            <div className="section-eyebrow" style={{ marginBottom: 8 }}>
              <FiUser size={13} />
              Student Portal & Wellbeing Telemetry
            </div>
            <h1 style={{
              font: "700 clamp(26px, 3.5vw, 38px) 'Space Grotesk'",
              color: '#F4F8F5',
              margin: '0 0 6px',
              letterSpacing: '-1px',
            }}>
              Welcome back, <span className="gradient-text">{studentName}</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, maxWidth: 600 }}>
              Review your lifestyle telemetry, manage your academic profile, and track your ongoing mental equilibrium.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={onStartAssessment}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: 13 }}
            >
              <LuBrain size={15} /> Take Assessment
            </button>
            <button
              onClick={onSignOut}
              className="btn-secondary"
              style={{
                padding: '10px 18px',
                fontSize: 13,
                borderColor: 'rgba(244, 117, 106, 0.25)',
                color: '#F4A49E',
              }}
            >
              <FiLogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div style={{
            padding: '12px 18px',
            borderRadius: 12,
            background: 'rgba(54, 214, 160, 0.10)',
            border: '1px solid rgba(54, 214, 160, 0.25)',
            color: '#65E6BB',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
            animation: 'fadeIn .3s ease',
          }}>
            <FiCheck size={16} /> {successMsg}
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 18px',
            borderRadius: 12,
            background: 'rgba(244, 117, 106, 0.10)',
            border: '1px solid rgba(244, 117, 106, 0.25)',
            color: '#F4A49E',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}>
            <FiAlertCircle size={16} /> {error}
          </div>
        )}

        {/* 4 Stat Overview Cards */}
        <div className="profile-stats-grid" style={{ marginBottom: 30 }}>
          {/* Card 1: Latest Score & SIGNAL */}
          <div className="glass" style={{ padding: 'clamp(14px, 3vw, 20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#36D6A0' }}>
                <FiTrendingUp size={16} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Latest Score
                </span>
              </div>
              {latestScore !== null && (() => {
                const sig = getSignalClassification(latestScore)
                return (
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 700,
                    background: sig.bg,
                    border: `1px solid ${sig.border}`,
                    color: sig.color,
                    letterSpacing: '0.4px',
                  }}>
                    {sig.label}
                  </span>
                )
              })()}
            </div>
            <div style={{ font: "700 clamp(22px, 3vw, 28px) 'Space Grotesk'", color: latestScore !== null ? getSignalClassification(latestScore).color : '#36D6A0' }}>
              {latestScore !== null ? `${latestScore.toFixed(2)}` : '– –'}
              {latestScore !== null && <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}> / 10.0</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              {latestScore !== null ? getSignalClassification(latestScore).description : 'No assessment taken yet'}
            </div>
          </div>

          {/* Card 2: Completed Assessments */}
          <div className="glass" style={{ padding: 'clamp(14px, 3vw, 20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#65E6BB', marginBottom: 8 }}>
              <FiActivity size={16} />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Completed
              </span>
            </div>
            <div style={{ font: "700 clamp(22px, 3vw, 28px) 'Space Grotesk'", color: '#F4F8F5' }}>
              {activity?.completed_assessments || 0}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              Total recorded runs
            </div>
          </div>

          {/* Card 3: Academic Stage */}
          <div className="glass" style={{ padding: 'clamp(14px, 3vw, 20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#4BAB84', marginBottom: 8 }}>
              <LuGraduationCap size={16} />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Academic Year
              </span>
            </div>
            <div style={{ font: "700 clamp(16px, 2.5vw, 20px) 'Space Grotesk'", color: '#F4F8F5', wordBreak: 'break-word' }}>
              {profile?.academic_class || '1st Year'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              {profile?.student_age ? `${profile.student_age} years old` : 'Active student'}
            </div>
          </div>

          {/* Card 4: Last Activity Date */}
          <div className="glass" style={{ padding: 'clamp(14px, 3vw, 20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--muted)', marginBottom: 8 }}>
              <FiClock size={16} />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Last Activity
              </span>
            </div>
            <div style={{ font: "600 clamp(14px, 2vw, 16px) 'Space Grotesk'", color: '#F4F8F5', paddingTop: 4 }}>
              {activity?.latest_assessment_date
                ? new Date(activity.latest_assessment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'No prior records'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              Most recent telemetry
            </div>
          </div>
        </div>

        {/* Two-column layout: Left = Profile Details, Right = Activity History */}
        <div className="profile-layout-grid">
          {/* ── Left: Student Identity Card ────────────────────── */}
          <div className="glass-bright" style={{ padding: 'clamp(18px, 3.5vw, 28px)', position: 'relative', width: '100%' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 20,
            }}>
              <span style={{
                fontSize: 11,
                letterSpacing: '1.5px',
                color: '#36D6A0',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}>
                Student Information
              </span>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#36D6A0',
                    background: 'rgba(54, 214, 160, 0.08)',
                    border: '1px solid rgba(130, 210, 175, 0.22)',
                    padding: '7px 14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(54, 214, 160, 0.16)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(54, 214, 160, 0.08)'}
                >
                  <FiEdit2 size={13} /> Edit Profile
                </button>
              )}
            </div>

            {/* Avatar & Display Name */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: 62, height: 62,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #28A77B, #36D6A0)',
                boxShadow: '0 0 24px rgba(54, 214, 160, 0.35)',
                display: 'grid', placeItems: 'center',
                color: '#050B09',
                fontSize: 22,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {getInitials(profile?.student_name || profile?.full_name)}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{
                  font: "700 clamp(18px, 2.5vw, 22px) 'Space Grotesk'",
                  color: '#F4F8F5',
                  margin: '0 0 4px',
                  wordBreak: 'break-word',
                }}>
                  {profile?.student_name || profile?.full_name || 'Student Member'}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--muted)', wordBreak: 'break-all' }}>
                  {profile?.email}
                </div>
              </div>
            </div>

            {/* Profile fields: View mode or Edit mode */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {/* Student Name */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#C8DBD2', marginBottom: 4 }}>
                    Student Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiUser style={iconStyle} />
                    <input
                      type="text"
                      name="studentName"
                      value={editForm.studentName}
                      onChange={handleEditChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Student Age & Class in responsive grid */}
                <div className="profile-details-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#C8DBD2', marginBottom: 4 }}>
                      Student Age
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FiCalendar style={iconStyle} />
                      <input
                        type="number"
                        name="studentAge"
                        min="5"
                        max="100"
                        value={editForm.studentAge}
                        onChange={handleEditChange}
                        required
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#C8DBD2', marginBottom: 4 }}>
                      Class / Academic Year
                    </label>
                    <div style={{ position: 'relative' }}>
                      <LuGraduationCap style={iconStyle} />
                      <select
                        name="academicClass"
                        value={editForm.academicClass}
                        onChange={handleEditChange}
                        required
                        style={{
                          ...inputStyle,
                          paddingRight: 28,
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {ACADEMIC_CLASSES.map(cls => (
                          <option key={cls} value={cls} style={{ background: '#0B1D17', color: '#F4F8F5' }}>
                            {cls}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: 10,
                        color: 'var(--muted)',
                        pointerEvents: 'none',
                      }} />
                    </div>
                  </div>
                </div>

                {/* School / College Name */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#C8DBD2', marginBottom: 4 }}>
                    School / College Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiBookOpen style={iconStyle} />
                    <input
                      type="text"
                      name="collegeName"
                      value={editForm.collegeName}
                      onChange={handleEditChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#C8DBD2', marginBottom: 4 }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiPhone style={iconStyle} />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editForm.phoneNumber}
                      onChange={handleEditChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Email ID (Read-only) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#C8DBD2' }}>
                      Email ID
                    </label>
                    <span style={{
                      fontSize: 10,
                      color: 'var(--muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <FiLock size={10} /> Read-Only
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <FiMail style={iconStyle} />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      style={{
                        ...inputStyle,
                        opacity: 0.65,
                        cursor: 'not-allowed',
                        borderColor: 'rgba(130, 210, 175, 0.10)',
                        background: 'rgba(0,0,0,.35)'
                      }}
                    />
                  </div>
                </div>

                {/* Action buttons: Save Changes & Cancel */}
                <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    className="btn-emerald"
                    disabled={saveLoading}
                    style={{
                      flex: 1,
                      minWidth: 140,
                      justifyContent: 'center',
                      padding: '11px 16px',
                      fontSize: 13.5,
                      fontWeight: 700,
                      borderRadius: 10,
                    }}
                  >
                    {saveLoading ? 'Saving...' : <><FiCheck size={14} /> Save Changes</>}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={cancelEdit}
                    style={{ padding: '11px 16px', fontSize: 13, borderRadius: 10 }}
                  >
                    <FiX size={14} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode - List of all details */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Student Name */}
                <div style={{
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'rgba(11, 29, 23, 0.7)',
                  border: '1px solid rgba(130, 210, 175, 0.10)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Student Name</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F4F8F5', wordBreak: 'break-word' }}>
                    {profile?.student_name || profile?.full_name || 'Not provided'}
                  </div>
                </div>

                {/* Responsive grid: Student Age & Class */}
                <div className="profile-details-grid">
                  <div style={{
                    padding: '11px 14px',
                    borderRadius: 10,
                    background: 'rgba(11, 29, 23, 0.7)',
                    border: '1px solid rgba(130, 210, 175, 0.10)',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Student Age</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F4F8F5' }}>
                      {profile?.student_age ? `${profile.student_age} years` : 'Not specified'}
                    </div>
                  </div>

                  <div style={{
                    padding: '11px 14px',
                    borderRadius: 10,
                    background: 'rgba(11, 29, 23, 0.7)',
                    border: '1px solid rgba(130, 210, 175, 0.10)',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Class / Year</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#36D6A0', wordBreak: 'break-word' }}>
                      {profile?.academic_class || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* School / College Name */}
                <div style={{
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'rgba(11, 29, 23, 0.7)',
                  border: '1px solid rgba(130, 210, 175, 0.10)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>School / College Name</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F4F8F5', wordBreak: 'break-word' }}>
                    {profile?.college_name || profile?.college || 'Not provided'}
                  </div>
                </div>

                {/* Phone Number */}
                <div style={{
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'rgba(11, 29, 23, 0.7)',
                  border: '1px solid rgba(130, 210, 175, 0.10)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Phone Number</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F4F8F5', wordBreak: 'break-all' }}>
                    {profile?.phone_number || 'Not provided'}
                  </div>
                </div>

                {/* Email ID */}
                <div style={{
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'rgba(11, 29, 23, 0.7)',
                  border: '1px solid rgba(130, 210, 175, 0.10)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Email ID</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F4F8F5', wordBreak: 'break-all' }}>
                    {profile?.email}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: My Wellbeing Activity ───────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minWidth: 0 }}>
            {/* Assessment History Section */}
            <div className="glass-bright" style={{ padding: 'clamp(18px, 3.5vw, 26px)', width: '100%', minWidth: 0 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 20,
              }}>
                <div>
                  <h3 style={{
                    font: "600 clamp(16px, 2.5vw, 19px) 'Space Grotesk'",
                    color: '#F4F8F5',
                    margin: '0 0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <LuBrain size={19} style={{ color: '#36D6A0' }} />
                    Wellbeing Assessment Telemetry
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
                    Historical log of evaluated routine parameters and predicted equilibrium.
                  </p>
                </div>

                <button
                  onClick={onStartAssessment}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: 12 }}
                >
                  New Assessment <FiArrowRight size={13} />
                </button>
              </div>

              {activity?.history && activity.history.length > 0 ? (
                <div className="table-scroll-container">
                  <table style={{
                    width: '100%',
                    minWidth: 480,
                    borderCollapse: 'collapse',
                    fontSize: 12.5,
                    textAlign: 'left',
                  }}>
                    <thead>
                      <tr style={{
                        borderBottom: '1px solid rgba(130, 210, 175, 0.16)',
                        color: '#36D6A0',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        <th style={{ padding: '10px 8px' }}>Date</th>
                        <th style={{ padding: '10px 8px' }}>Platform</th>
                        <th style={{ padding: '10px 8px' }}>Screen Time</th>
                        <th style={{ padding: '10px 8px' }}>Stress</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right' }}>Score</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right' }}>Signal Evaluation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.history.map((item, idx) => (
                        <tr
                          key={item.id || idx}
                          style={{
                            borderBottom: '1px solid rgba(130, 210, 175, 0.08)',
                            color: '#F4F8F5',
                          }}
                        >
                          <td style={{ padding: '12px 8px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                            {new Date(item.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </td>
                          <td style={{ padding: '12px 8px', fontWeight: 600 }}>
                            {item.most_used_platform}
                          </td>
                          <td style={{ padding: '12px 8px', color: 'var(--muted)' }}>
                            {item.avg_daily_usage_hours} hrs/day
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              background: 'rgba(54, 214, 160, 0.10)',
                              border: '1px solid rgba(54, 214, 160, 0.20)',
                              color: '#36D6A0',
                              whiteSpace: 'nowrap',
                            }}>
                              {item.stress_level}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, color: '#36D6A0' }}>
                            {Number(item.predicted_score).toFixed(2)}
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                            {(() => {
                              const sig = getSignalClassification(item.predicted_score)
                              return (
                                <span style={{
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  background: sig.bg,
                                  border: `1px solid ${sig.border}`,
                                  color: sig.color,
                                  whiteSpace: 'nowrap',
                                  letterSpacing: '0.4px',
                                  boxShadow: sig.glow,
                                }}>
                                  {sig.label}
                                </span>
                              )
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: '#0B1D17',
                  borderRadius: 14,
                  border: '1px dashed rgba(130, 210, 175, 0.20)',
                }}>
                  <div style={{
                    width: 46, height: 46,
                    borderRadius: 14,
                    background: 'rgba(54, 214, 160, 0.10)',
                    color: '#36D6A0',
                    display: 'grid', placeItems: 'center',
                    fontSize: 22, margin: '0 auto 14px',
                  }}>
                    <FiActivity />
                  </div>
                  <h4 style={{ font: "600 16px 'Space Grotesk'", color: '#F4F8F5', margin: '0 0 6px' }}>
                    No Assessment Telemetry Yet
                  </h4>
                  <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 400, margin: '0 auto 20px', lineHeight: 1.6 }}>
                    Complete your first 3-step student wellbeing questionnaire to generate your real-time routine distribution and AI prediction score.
                  </p>
                  <button
                    onClick={onStartAssessment}
                    className="btn-primary"
                    style={{ margin: '0 auto', fontSize: 13, padding: '10px 20px' }}
                  >
                    Start Student Assessment <FiArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
