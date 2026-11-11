import { useState, useEffect } from 'react'
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiBookOpen,
  FiEdit2, FiCheck, FiX, FiLogOut, FiActivity,
  FiClock, FiTrendingUp, FiArrowRight, FiAlertCircle,
  FiLock, FiChevronDown
} from 'react-icons/fi'
import { LuBrain, LuGraduationCap } from 'react-icons/lu'
import { ACADEMIC_CLASSES } from './SignUp.jsx'
import API_URL from '../apiConfig.js'

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

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'ST'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px 10px 36px',
    borderRadius: 9,
    border: '1px solid rgba(112,225,181,.28)',
    background: 'rgba(9,44,36,.85)',
    color: '#F5FFF9',
    fontSize: 13.5,
    outline: 'none',
  }

  const iconStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: 11,
    color: 'var(--muted)',
    fontSize: 14,
    pointerEvents: 'none',
  }

  return (
    <section className="bg-campus" style={{
      minHeight: 'calc(100vh - 140px)',
      padding: '40px 5% 70px',
      maxWidth: 1200,
      margin: '0 auto',
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Header: Title, Subtitle & Sign Out */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 30,
        }}>
          <div>
            <div className="section-eyebrow" style={{ marginBottom: 6 }}>
              <FiUser size={13} />
              Student Portal
            </div>
            <h1 style={{
              font: "700 clamp(24px,3vw,34px) 'Space Grotesk'",
              color: '#F5FFF9',
              margin: '0 0 6px',
            }}>
              My Student Profile
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
              Manage your personal details and student information.
            </p>
          </div>

          <button
            onClick={onSignOut}
            className="btn-secondary"
            style={{
              padding: '10px 18px',
              fontSize: 13,
              borderColor: 'rgba(244,117,106,.3)',
              color: '#F4A49E',
            }}
          >
            <FiLogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Success message banner */}
        {successMsg && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(112,225,181,.12)',
            border: '1px solid rgba(112,225,181,.35)',
            color: '#B7F5D8',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
            animation: 'fadeIn .3s ease',
          }}>
            <FiCheck size={16} /> {successMsg}
          </div>
        )}

        {/* Error message banner */}
        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(244,117,106,.12)',
            border: '1px solid rgba(244,117,106,.35)',
            color: '#F4A49E',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
          }}>
            <FiAlertCircle size={16} /> {error}
          </div>
        )}

        {/* Two-column layout: Left = Profile Details, Right = Activity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)',
          gap: 24,
          alignItems: 'start',
        }}>
          {/* ── Left: Student Identity Card ────────────────────── */}
          <div className="glass-bright" style={{ padding: 28, position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              <span style={{
                fontSize: 11,
                letterSpacing: '1.5px',
                color: 'var(--mint)',
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
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--mint)',
                    background: 'rgba(112,225,181,.08)',
                    border: '1px solid rgba(112,225,181,.25)',
                    padding: '6px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(112,225,181,.16)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(112,225,181,.08)'}
                >
                  <FiEdit2 size={13} /> Edit Profile
                </button>
              )}
            </div>

            {/* Avatar & Display Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1DB87A, #70E1B5)',
                boxShadow: '0 0 24px rgba(112,225,181,.40)',
                display: 'grid', placeItems: 'center',
                color: '#082820',
                fontSize: 22,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {getInitials(profile?.student_name || profile?.full_name)}
              </div>

              <div>
                <h3 style={{
                  font: "700 20px 'Space Grotesk'",
                  color: '#F5FFF9',
                  margin: '0 0 4px',
                }}>
                  {profile?.student_name || profile?.full_name || 'Student Member'}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {profile?.email}
                </div>
              </div>
            </div>

            {/* Profile fields: View mode or Edit mode */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {/* Student Name */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#cce8de', marginBottom: 4 }}>
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

                {/* Student Age & Class in 2-col */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#cce8de', marginBottom: 4 }}>
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
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#cce8de', marginBottom: 4 }}>
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
                          <option key={cls} value={cls} style={{ background: '#0A3328', color: '#F5FFF9' }}>
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
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#cce8de', marginBottom: 4 }}>
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
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#cce8de', marginBottom: 4 }}>
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
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#cce8de' }}>
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
                        borderColor: 'rgba(255,255,255,.12)',
                        background: 'rgba(0,0,0,.25)'
                      }}
                    />
                  </div>
                </div>

                {/* Action buttons: Save Changes & Cancel */}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button
                    type="submit"
                    className="btn-emerald"
                    disabled={saveLoading}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      padding: '10px 14px',
                      fontSize: 13.5,
                      fontWeight: 700,
                      borderRadius: 9,
                    }}
                  >
                    {saveLoading ? 'Saving...' : <><FiCheck size={14} /> Save Changes</>}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={cancelEdit}
                    style={{ padding: '10px 14px', fontSize: 13, borderRadius: 9 }}
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
                  background: 'rgba(9,44,36,.5)',
                  border: '1px solid rgba(112,225,181,.10)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Student Name</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F5FFF9' }}>
                    {profile?.student_name || profile?.full_name || 'Not provided'}
                  </div>
                </div>

                {/* 2-col: Student Age & Class / Academic Year */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 10 }}>
                  <div style={{
                    padding: '11px 14px',
                    borderRadius: 10,
                    background: 'rgba(9,44,36,.5)',
                    border: '1px solid rgba(112,225,181,.10)',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Student Age</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F5FFF9' }}>
                      {profile?.student_age ? `${profile.student_age} years` : 'Not specified'}
                    </div>
                  </div>

                  <div style={{
                    padding: '11px 14px',
                    borderRadius: 10,
                    background: 'rgba(9,44,36,.5)',
                    border: '1px solid rgba(112,225,181,.10)',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Class / Year</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--mint)' }}>
                      {profile?.academic_class || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* School / College Name */}
                <div style={{
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'rgba(9,44,36,.5)',
                  border: '1px solid rgba(112,225,181,.10)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>School / College Name</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F5FFF9' }}>
                    {profile?.college_name || profile?.college || 'Not provided'}
                  </div>
                </div>

                {/* Phone Number */}
                <div style={{
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'rgba(9,44,36,.5)',
                  border: '1px solid rgba(112,225,181,.10)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Phone Number</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F5FFF9' }}>
                    {profile?.phone_number || 'Not provided'}
                  </div>
                </div>

                {/* Email ID */}
                <div style={{
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'rgba(9,44,36,.5)',
                  border: '1px solid rgba(112,225,181,.10)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Email ID</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#F5FFF9' }}>
                    {profile?.email}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: My Wellbeing Activity ───────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* 3 Metric Summary Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
            }}>
              <div className="glass" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--mint)', marginBottom: 8 }}>
                  <FiActivity size={16} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Completed
                  </span>
                </div>
                <div style={{ font: "700 24px 'Space Grotesk'", color: '#F5FFF9' }}>
                  {activity?.completed_assessments || 0}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  Total assessments
                </div>
              </div>

              <div className="glass" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#B7F5D8', marginBottom: 8 }}>
                  <FiTrendingUp size={16} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Latest Score
                  </span>
                </div>
                <div style={{ font: "700 24px 'Space Grotesk'", color: 'var(--mint)' }}>
                  {activity?.latest_predicted_score !== null && activity?.latest_predicted_score !== undefined
                    ? `${Number(activity.latest_predicted_score).toFixed(2)}`
                    : '– –'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  Scale: 1.0 – 10.0
                </div>
              </div>

              <div className="glass" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--muted)', marginBottom: 8 }}>
                  <FiClock size={16} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Last Active
                  </span>
                </div>
                <div style={{ font: "600 13px 'Space Grotesk'", color: '#F5FFF9', paddingTop: 6 }}>
                  {activity?.latest_assessment_date
                    ? new Date(activity.latest_assessment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'No records'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  Assessment date
                </div>
              </div>
            </div>

            {/* Assessment History Section */}
            <div className="glass-bright" style={{ padding: 26 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 18,
              }}>
                <h3 style={{
                  font: "600 17px 'Space Grotesk'",
                  color: '#F5FFF9',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <LuBrain size={18} style={{ color: 'var(--mint)' }} />
                  My Wellbeing Activity
                </h3>

                <button
                  onClick={onStartAssessment}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: 12 }}
                >
                  Start Assessment <FiArrowRight size={13} />
                </button>
              </div>

              {activity?.history && activity.history.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 12.5,
                    textAlign: 'left',
                  }}>
                    <thead>
                      <tr style={{
                        borderBottom: '1px solid rgba(112,225,181,.16)',
                        color: 'var(--mint)',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        <th style={{ padding: '10px 8px' }}>Date</th>
                        <th style={{ padding: '10px 8px' }}>Platform</th>
                        <th style={{ padding: '10px 8px' }}>Screen Time</th>
                        <th style={{ padding: '10px 8px' }}>Stress</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right' }}>Predicted Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.history.map((item, idx) => (
                        <tr
                          key={item.id || idx}
                          style={{
                            borderBottom: '1px solid rgba(112,225,181,.07)',
                            color: '#F5FFF9',
                          }}
                        >
                          <td style={{ padding: '12px 8px', color: 'var(--muted)' }}>
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
                              background: 'rgba(112,225,181,.10)',
                              border: '1px solid rgba(112,225,181,.20)',
                              color: 'var(--mint)',
                            }}>
                              {item.stress_level}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, color: 'var(--mint)' }}>
                            {Number(item.predicted_score).toFixed(2)}
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
                  background: 'rgba(9,44,36,.4)',
                  borderRadius: 14,
                  border: '1px dashed rgba(112,225,181,.22)',
                }}>
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: 12,
                    background: 'rgba(112,225,181,.10)',
                    color: 'var(--mint)',
                    display: 'grid', placeItems: 'center',
                    fontSize: 20, margin: '0 auto 12px',
                  }}>
                    <FiActivity />
                  </div>
                  <h4 style={{ font: "600 15px 'Space Grotesk'", color: '#F5FFF9', margin: '0 0 6px' }}>
                    You haven't completed an assessment yet.
                  </h4>
                  <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 380, margin: '0 auto 18px' }}>
                    Take your first AI student wellbeing assessment to evaluate your digital habits and generate your personal score.
                  </p>
                  <button
                    onClick={onStartAssessment}
                    className="btn-primary"
                    style={{ margin: '0 auto', fontSize: 13, padding: '10px 20px' }}
                  >
                    Start Assessment <FiArrowRight size={14} />
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
