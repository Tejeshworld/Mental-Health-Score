import { useState, useEffect } from 'react'
import {
  FiMenu, FiX, FiUser, FiHome, FiInfo,
  FiLogIn, FiUserPlus, FiLogOut, FiClipboard, FiBarChart2, FiActivity
} from 'react-icons/fi'
import { LuBrain } from 'react-icons/lu'

export default function Navbar({ onNavigate, currentUser, activeView, onSignOut }) {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleNavClick = (path) => {
    onNavigate(path)
    setOpen(false)
  }

  // Get student initials
  const getInitials = (name) => {
    if (!name) return 'ST'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const navBg = scrolled
    ? 'rgba(5, 11, 9, 0.96)'
    : 'rgba(5, 11, 9, 0.85)'

  return (
    <>
      <nav style={{
        position:   'fixed',
        top: 0, left: 0, right: 0,
        zIndex:     999,
        height:     70,
        padding:    '0 clamp(12px, 4vw, 5%)',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: navBg,
        borderBottom: '1px solid rgba(130, 210, 175, 0.13)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'background .3s ease, box-shadow .3s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,.6)' : 'none',
      }}>

        {/* ── Left: Logo & Branding ─────────────────────────── */}
        <button
          onClick={() => handleNavClick('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          aria-label="MindSpace home"
        >
          {/* Logo icon */}
          <span style={{
            width: 42, height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #1DB87A, #36D6A0)',
            boxShadow: '0 0 20px rgba(54, 214, 160, 0.35)',
            display: 'grid', placeItems: 'center',
            color: '#050B09',
            fontSize: 22,
            flexShrink: 0,
          }}>
            <LuBrain />
          </span>

          {/* Brand text */}
          <span style={{ lineHeight: 1 }}>
            <div style={{
              font: "700 clamp(18px, 4vw, 21px) 'Space Grotesk'",
              letterSpacing: '-0.4px',
              color: '#F4F8F5',
            }}>
              MindSpace
            </div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '2.2px',
              textTransform: 'uppercase',
              color: 'var(--mint)',
              marginTop: 3,
            }}>
              AI Wellbeing
            </div>
          </span>
        </button>

        {/* ── Center: Navigation Links (Desktop) ───────────── */}
        <ul className="desktop-center-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}>
          <li>
            <button
              onClick={() => handleNavClick('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: activeView === 'home' ? 700 : 500,
                color: activeView === 'home' ? '#F4F8F5' : 'var(--muted)',
                background: activeView === 'home' ? 'rgba(54, 214, 160, 0.12)' : 'transparent',
                border: activeView === 'home' ? '1px solid rgba(130, 210, 175, 0.25)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={e => {
                if (activeView !== 'home') {
                  e.currentTarget.style.color = '#F4F8F5'
                  e.currentTarget.style.background = 'rgba(54, 214, 160, 0.08)'
                }
              }}
              onMouseLeave={e => {
                if (activeView !== 'home') {
                  e.currentTarget.style.color = 'var(--muted)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <FiHome size={15} style={{ color: activeView === 'home' ? 'var(--mint)' : undefined }} />
              Home
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('/about')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: activeView === 'about' ? 700 : 500,
                color: activeView === 'about' ? '#F4F8F5' : 'var(--muted)',
                background: activeView === 'about' ? 'rgba(54, 214, 160, 0.12)' : 'transparent',
                border: activeView === 'about' ? '1px solid rgba(130, 210, 175, 0.25)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={e => {
                if (activeView !== 'about') {
                  e.currentTarget.style.color = '#F4F8F5'
                  e.currentTarget.style.background = 'rgba(54, 214, 160, 0.08)'
                }
              }}
              onMouseLeave={e => {
                if (activeView !== 'about') {
                  e.currentTarget.style.color = 'var(--muted)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <FiInfo size={15} style={{ color: activeView === 'about' ? 'var(--mint)' : undefined }} />
              About
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('/#assess')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--muted)',
                background: 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#F4F8F5'
                e.currentTarget.style.background = 'rgba(54, 214, 160, 0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--muted)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <FiClipboard size={15} />
              Assessment
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('/#insights')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--muted)',
                background: 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#F4F8F5'
                e.currentTarget.style.background = 'rgba(54, 214, 160, 0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--muted)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <FiBarChart2 size={15} />
              Insights
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('/#recommendations')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--muted)',
                background: 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#F4F8F5'
                e.currentTarget.style.background = 'rgba(54, 214, 160, 0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--muted)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <FiActivity size={15} />
              Recommendations
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavClick('/dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: activeView === 'dashboard' ? 700 : 500,
                color: activeView === 'dashboard' ? '#F4F8F5' : 'var(--muted)',
                background: activeView === 'dashboard' ? 'rgba(54, 214, 160, 0.12)' : 'transparent',
                border: activeView === 'dashboard' ? '1px solid rgba(130, 210, 175, 0.25)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={e => {
                if (activeView !== 'dashboard') {
                  e.currentTarget.style.color = '#F4F8F5'
                  e.currentTarget.style.background = 'rgba(54, 214, 160, 0.08)'
                }
              }}
              onMouseLeave={e => {
                if (activeView !== 'dashboard') {
                  e.currentTarget.style.color = 'var(--muted)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <FiUser size={15} style={{ color: activeView === 'dashboard' ? 'var(--mint)' : undefined }} />
              Dashboard
            </button>
          </li>
        </ul>

        {/* ── Right side: Sign In / Sign Up or Profile & Logout ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {currentUser ? (
            /* Logged In: Dashboard badge & Logout */
            <div className="desktop-auth-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => handleNavClick('/dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px 5px 6px',
                  borderRadius: 999,
                  border: activeView === 'dashboard'
                    ? '1px solid var(--mint)'
                    : '1px solid rgba(130, 210, 175, 0.25)',
                  background: activeView === 'dashboard' ? 'rgba(54, 214, 160, 0.18)' : 'rgba(54, 214, 160, 0.08)',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(54, 214, 160, 0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = activeView === 'dashboard' ? 'rgba(54, 214, 160, 0.18)' : 'rgba(54, 214, 160, 0.08)'}
                title="Student Dashboard & Profile"
              >
                <span style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1DB87A, #36D6A0)',
                  color: '#050B09',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'grid', placeItems: 'center',
                }}>
                  {getInitials(currentUser.student_name || currentUser.full_name)}
                </span>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#F4F8F5',
                  maxWidth: 120,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {(currentUser.student_name || currentUser.full_name)?.split(' ')[0] || 'Profile'}
                </span>
              </button>

              <button
                onClick={onSignOut}
                aria-label="Sign Out"
                title="Sign Out"
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  border: '1px solid rgba(244,117,106,.25)',
                  background: 'rgba(244,117,106,.08)',
                  display: 'grid', placeItems: 'center',
                  color: '#F4A49E', fontSize: 16,
                  transition: 'all .2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(244,117,106,.18)'
                  e.currentTarget.style.borderColor = '#F4756A'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(244,117,106,.08)'
                  e.currentTarget.style.borderColor = 'rgba(244,117,106,.25)'
                }}
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            /* Logged Out: Sign In & Sign Up buttons */
            <div className="desktop-auth-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => handleNavClick('/signin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: activeView === 'signin' ? '#F4F8F5' : 'var(--mint)',
                  border: activeView === 'signin' ? '1px solid var(--mint)' : '1px solid rgba(130, 210, 175, 0.24)',
                  background: activeView === 'signin' ? 'rgba(54, 214, 160, 0.16)' : 'rgba(54, 214, 160, 0.06)',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(54, 214, 160, 0.16)'
                  e.currentTarget.style.color = '#F4F8F5'
                }}
                onMouseLeave={e => {
                  if (activeView !== 'signin') {
                    e.currentTarget.style.background = 'rgba(54, 214, 160, 0.06)'
                    e.currentTarget.style.color = 'var(--mint)'
                  }
                }}
              >
                <FiLogIn size={15} /> Sign In
              </button>

              <button
                onClick={() => handleNavClick('/signup')}
                className="btn-emerald"
                style={{
                  padding: '9px 18px',
                  fontSize: 13.5,
                  fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(54, 214, 160, 0.25)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                <FiUserPlus size={15} /> Sign Up
              </button>
            </div>
          )}

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen(o => !o)}
            className="hamburger-btn"
            style={{
              width: 40, height: 40, borderRadius: 10,
              border: '1px solid rgba(130, 210, 175, 0.25)',
              background: 'rgba(54, 214, 160, 0.08)',
              display: 'none',
              placeItems: 'center',
              color: '#F4F8F5',
              fontSize: 21,
              transition: 'all .2s',
              cursor: 'pointer',
            }}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Navigation Drawer ───────────────────────── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 998,
            background: 'rgba(5, 20, 16, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: 'fadeIn .2s ease',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 70, left: 0, right: 0,
              background: '#081511',
              borderBottom: '1px solid rgba(130, 210, 175, 0.16)',
              boxShadow: '0 20px 40px rgba(0,0,0,.7)',
              padding: '20px 6% 26px',
              animation: 'fadeSlideUp .25s ease',
              maxHeight: 'calc(100vh - 70px)',
              overflowY: 'auto',
            }}
          >
            {/* Drawer Header with Close Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 14,
              marginBottom: 12,
              borderBottom: '1px solid rgba(130, 210, 175, 0.12)',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--mint)' }}>
                MindSpace Navigation
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'rgba(54, 214, 160, 0.08)',
                  border: '1px solid rgba(130, 210, 175, 0.2)',
                  color: '#F4F8F5',
                  width: 32, height: 32,
                  borderRadius: 8,
                  display: 'grid', placeItems: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Close menu"
              >
                <FiX size={17} />
              </button>
            </div>

            {/* Nav list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Home */}
              <button
                onClick={() => handleNavClick('/')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', textAlign: 'left',
                  padding: '12px 14px',
                  fontSize: 15, fontWeight: activeView === 'home' ? 700 : 500,
                  color: activeView === 'home' ? 'var(--mint)' : '#F4F8F5',
                  background: activeView === 'home' ? 'rgba(54, 214, 160, 0.12)' : 'transparent',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FiHome size={18} style={{ color: 'var(--mint)' }} />
                Home
              </button>

              {/* About */}
              <button
                onClick={() => handleNavClick('/about')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', textAlign: 'left',
                  padding: '12px 14px',
                  fontSize: 15, fontWeight: activeView === 'about' ? 700 : 500,
                  color: activeView === 'about' ? 'var(--mint)' : '#F4F8F5',
                  background: activeView === 'about' ? 'rgba(54, 214, 160, 0.12)' : 'transparent',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FiInfo size={18} style={{ color: 'var(--mint)' }} />
                About
              </button>

              {/* Assessment */}
              <button
                onClick={() => handleNavClick('/#assess')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', textAlign: 'left',
                  padding: '12px 14px',
                  fontSize: 15, fontWeight: 500,
                  color: '#F4F8F5',
                  background: 'transparent',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FiClipboard size={18} style={{ color: 'var(--mint)' }} />
                Assessment
              </button>

              {/* Recommendations */}
              <button
                onClick={() => handleNavClick('/#recommendations')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', textAlign: 'left',
                  padding: '12px 14px',
                  fontSize: 15, fontWeight: 500,
                  color: '#F4F8F5',
                  background: 'transparent',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FiActivity size={18} style={{ color: 'var(--mint)' }} />
                Recommendations
              </button>

              {/* Insights */}
              <button
                onClick={() => handleNavClick('/#insights')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', textAlign: 'left',
                  padding: '12px 14px',
                  fontSize: 15, fontWeight: 500,
                  color: '#F4F8F5',
                  background: 'transparent',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FiBarChart2 size={18} style={{ color: 'var(--mint)' }} />
                Insights
              </button>

              {/* Student Dashboard */}
              <button
                onClick={() => handleNavClick('/dashboard')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', textAlign: 'left',
                  padding: '12px 14px',
                  fontSize: 15, fontWeight: activeView === 'dashboard' ? 700 : 500,
                  color: activeView === 'dashboard' ? 'var(--mint)' : '#F4F8F5',
                  background: activeView === 'dashboard' ? 'rgba(54, 214, 160, 0.12)' : 'transparent',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FiUser size={18} style={{ color: 'var(--mint)' }} />
                Student Dashboard {currentUser ? `(${currentUser.student_name?.split(' ')[0] || 'Profile'})` : ''}
              </button>

              {/* Logged in vs Logged out actions */}
              {currentUser ? (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(130, 210, 175, 0.12)' }}>
                  <button
                    onClick={() => { onSignOut(); setOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', textAlign: 'left',
                      padding: '12px 14px',
                      fontSize: 15, fontWeight: 600,
                      color: '#F4A49E',
                      background: 'rgba(244,117,106,.08)',
                      borderRadius: 10,
                      border: '1px solid rgba(244,117,106,.2)',
                      cursor: 'pointer',
                    }}
                  >
                    <FiLogOut size={17} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div style={{
                  marginTop: 10,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(130, 210, 175, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}>
                  {/* Sign In */}
                  <button
                    onClick={() => handleNavClick('/signin')}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: 15, fontWeight: 600,
                      color: 'var(--mint)',
                      background: 'rgba(54, 214, 160, 0.08)',
                      border: '1px solid rgba(130, 210, 175, 0.24)',
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                  >
                    <FiLogIn size={17} />
                    Sign In
                  </button>

                  {/* Sign Up */}
                  <button
                    onClick={() => handleNavClick('/signup')}
                    className="btn-emerald"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      width: '100%',
                      padding: '13px 16px',
                      fontSize: 15, fontWeight: 700,
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                  >
                    <FiUserPlus size={17} />
                    Sign Up / Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: 70 }} />

      <style>{`
        @media (max-width: 820px) {
          .desktop-center-nav  { display: none !important; }
          .desktop-auth-actions { display: none !important; }
          .hamburger-btn        { display: grid !important; }
        }
      `}</style>
    </>
  )
}
