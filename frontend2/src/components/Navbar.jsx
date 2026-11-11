import { useState, useEffect } from 'react'
import {
  FiMenu, FiX, FiUser, FiHome, FiInfo,
  FiLogIn, FiUserPlus, FiLogOut, FiClipboard, FiBarChart2
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
    ? 'linear-gradient(135deg, rgba(9,44,36,.98), rgba(14,61,49,.99))'
    : 'linear-gradient(135deg, rgba(9,44,36,.82), rgba(14,61,49,.75))'

  return (
    <>
      <nav style={{
        position:   'fixed',
        top: 0, left: 0, right: 0,
        zIndex:     999,
        height:     70,
        padding:    '0 5%',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: navBg,
        borderBottom: '1px solid rgba(112,225,181,.14)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'background .3s ease, box-shadow .3s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,.45)' : 'none',
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
            width: 44, height: 44,
            borderRadius: 13,
            background: 'linear-gradient(135deg, #1DB87A, #70E1B5)',
            boxShadow: '0 0 24px rgba(112,225,181,.45)',
            display: 'grid', placeItems: 'center',
            color: '#082820',
            fontSize: 23,
            flexShrink: 0,
          }}>
            <LuBrain />
          </span>

          {/* Brand text */}
          <span style={{ lineHeight: 1 }}>
            <div style={{
              font: "700 21px 'Space Grotesk'",
              letterSpacing: '-0.4px',
              color: '#F5FFF9',
              textShadow: '0 0 20px rgba(112,225,181,.35)',
            }}>
              MindSpace
            </div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '2.2px',
              textTransform: 'uppercase',
              color: '#70E1B5',
              marginTop: 3,
            }}>
              AI Wellbeing
            </div>
          </span>
        </button>

        {/* ── Center: Home and About (Desktop) ─────────────── */}
        <ul className="desktop-center-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
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
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: activeView === 'home' ? 700 : 500,
                color: activeView === 'home' ? '#F5FFF9' : 'var(--muted)',
                background: activeView === 'home' ? 'rgba(112,225,181,.14)' : 'transparent',
                border: activeView === 'home' ? '1px solid rgba(112,225,181,.28)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={e => {
                if (activeView !== 'home') {
                  e.currentTarget.style.color = '#F5FFF9'
                  e.currentTarget.style.background = 'rgba(112,225,181,.08)'
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
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: activeView === 'about' ? 700 : 500,
                color: activeView === 'about' ? '#F5FFF9' : 'var(--muted)',
                background: activeView === 'about' ? 'rgba(112,225,181,.14)' : 'transparent',
                border: activeView === 'about' ? '1px solid rgba(112,225,181,.28)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={e => {
                if (activeView !== 'about') {
                  e.currentTarget.style.color = '#F5FFF9'
                  e.currentTarget.style.background = 'rgba(112,225,181,.08)'
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

          {currentUser && (
            <>
              <li>
                <button
                  onClick={() => handleNavClick('/#assess')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 16px',
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
                    e.currentTarget.style.color = '#F5FFF9'
                    e.currentTarget.style.background = 'rgba(112,225,181,.08)'
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
                    padding: '8px 16px',
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
                    e.currentTarget.style.color = '#F5FFF9'
                    e.currentTarget.style.background = 'rgba(112,225,181,.08)'
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
            </>
          )}
        </ul>

        {/* ── Right side: Sign In and Sign Up (Desktop) ────── */}
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
                    : '1px solid rgba(112,225,181,.28)',
                  background: activeView === 'dashboard' ? 'rgba(112,225,181,.18)' : 'rgba(112,225,181,.10)',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(112,225,181,.20)'}
                onMouseLeave={e => e.currentTarget.style.background = activeView === 'dashboard' ? 'rgba(112,225,181,.18)' : 'rgba(112,225,181,.10)'}
                title="Student Dashboard & Profile"
              >
                <span style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1DB87A, #70E1B5)',
                  color: '#082820',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'grid', placeItems: 'center',
                }}>
                  {getInitials(currentUser.student_name || currentUser.full_name)}
                </span>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#F5FFF9',
                  maxWidth: 120,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {(currentUser.student_name || currentUser.full_name)?.split(' ')[0] || 'Dashboard'}
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
                  color: activeView === 'signin' ? '#F5FFF9' : 'var(--mint)',
                  border: activeView === 'signin' ? '1px solid var(--mint)' : '1px solid rgba(112,225,181,.24)',
                  background: activeView === 'signin' ? 'rgba(112,225,181,.16)' : 'rgba(112,225,181,.06)',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(112,225,181,.16)'
                  e.currentTarget.style.color = '#F5FFF9'
                }}
                onMouseLeave={e => {
                  if (activeView !== 'signin') {
                    e.currentTarget.style.background = 'rgba(112,225,181,.06)'
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
                  boxShadow: '0 4px 18px rgba(29,184,122,.35)',
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
              border: '1px solid rgba(112,225,181,.25)',
              background: 'rgba(112,225,181,.08)',
              display: 'none',
              placeItems: 'center',
              color: '#F5FFF9',
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
              background: 'linear-gradient(180deg, rgba(9,44,36,.98) 0%, rgba(14,61,49,.99) 100%)',
              borderBottom: '1px solid rgba(112,225,181,.20)',
              boxShadow: '0 20px 40px rgba(0,0,0,.6)',
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
              borderBottom: '1px solid rgba(112,225,181,.12)',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--mint)' }}>
                MindSpace Navigation
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'rgba(112,225,181,.08)',
                  border: '1px solid rgba(112,225,181,.2)',
                  color: '#F5FFF9',
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
                  color: activeView === 'home' ? 'var(--mint)' : '#F5FFF9',
                  background: activeView === 'home' ? 'rgba(112,225,181,.12)' : 'transparent',
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
                  color: activeView === 'about' ? 'var(--mint)' : '#F5FFF9',
                  background: activeView === 'about' ? 'rgba(112,225,181,.12)' : 'transparent',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FiInfo size={18} style={{ color: 'var(--mint)' }} />
                About
              </button>

              {/* Logged in vs Logged out actions */}
              {currentUser ? (
                <>
                  <button
                    onClick={() => handleNavClick('/dashboard')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', textAlign: 'left',
                      padding: '12px 14px',
                      fontSize: 15, fontWeight: activeView === 'dashboard' ? 700 : 500,
                      color: activeView === 'dashboard' ? 'var(--mint)' : '#F5FFF9',
                      background: activeView === 'dashboard' ? 'rgba(112,225,181,.12)' : 'transparent',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FiUser size={18} style={{ color: 'var(--mint)' }} />
                    Student Dashboard ({currentUser.student_name?.split(' ')[0] || 'Profile'})
                  </button>

                  <button
                    onClick={() => handleNavClick('/#assess')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', textAlign: 'left',
                      padding: '12px 14px',
                      fontSize: 15, fontWeight: 500,
                      color: '#F5FFF9',
                      background: 'transparent',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FiClipboard size={18} style={{ color: 'var(--mint)' }} />
                    Student Assessment
                  </button>

                  <button
                    onClick={() => handleNavClick('/#insights')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', textAlign: 'left',
                      padding: '12px 14px',
                      fontSize: 15, fontWeight: 500,
                      color: '#F5FFF9',
                      background: 'transparent',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FiBarChart2 size={18} style={{ color: 'var(--mint)' }} />
                    Insights Dashboard
                  </button>

                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(112,225,181,.12)' }}>
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
                </>
              ) : (
                <div style={{
                  marginTop: 10,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(112,225,181,.12)',
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
                      background: 'rgba(112,225,181,.08)',
                      border: '1px solid rgba(112,225,181,.24)',
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
