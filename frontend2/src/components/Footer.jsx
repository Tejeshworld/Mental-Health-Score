import { FiHeart, FiGithub, FiShield } from 'react-icons/fi'
import { LuBrain } from 'react-icons/lu'

export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '1px solid rgba(130, 210, 175, 0.13)',
      padding: '48px clamp(12px, 4vw, 5%) 32px',
      background: '#050B09',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <button
              onClick={() => {
                if (typeof onNavigate === 'function') onNavigate('/')
                else if (onNavigate?.home) onNavigate.home()
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left'
              }}
              aria-label="MindSpace home"
            >
              <span style={{
                width: 42, height: 42,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #28A77B, #36D6A0)',
                boxShadow: '0 0 20px rgba(54, 214, 160, 0.35)',
                display: 'grid', placeItems: 'center',
                color: '#050B09', fontSize: 22,
                flexShrink: 0,
              }}>
                <LuBrain />
              </span>
              <div>
                <span style={{
                  font: "700 18px 'Space Grotesk'",
                  color: '#F4F8F5',
                  letterSpacing: '-0.3px',
                }}>
                  MindSpace
                </span>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--mint)',
                  marginTop: 2,
                }}>
                  AI Wellbeing
                </div>
              </div>
            </button>
            <p style={{
              color: 'var(--muted)',
              fontSize: 12,
              lineHeight: 1.6,
              maxWidth: 240,
            }}>
              AI-driven student lifestyle insights and mental health prediction dashboard.
            </p>
          </div>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            paddingTop: 8,
          }}>
            {[
              { label: 'Home', key: 'home' },
              { label: 'Assessment', key: 'assess' },
              { label: 'Insights', key: 'insights' },
              { label: 'About', key: 'about' },
            ].map(l => (
              <button
                key={l.key}
                onClick={() => {
                  if (typeof onNavigate === 'function') {
                    if (l.key === 'home') onNavigate('/')
                    else if (l.key === 'about') onNavigate('/about')
                    else if (l.key === 'assess') onNavigate('/#assess')
                    else if (l.key === 'insights') onNavigate('/#insights')
                    else onNavigate(l.key)
                  } else if (typeof onNavigate?.[l.key] === 'function') {
                    onNavigate[l.key]()
                  }
                }}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--muted)',
                  transition: 'color .2s ease',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--mint)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Badges Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid rgba(130, 210, 175, 0.16)',
              background: 'rgba(54, 214, 160, 0.06)',
              fontSize: 12,
              color: 'var(--muted)',
            }}>
              <span style={{ color: 'var(--mint)', display: 'flex' }}><FiHeart size={13} /></span>
              <span>Student Focused</span>
              <span style={{ color: 'var(--mint)', display: 'flex', marginLeft: 4 }}><FiShield size={13} /></span>
              <span>Local Privacy</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{
          marginTop: 32,
          paddingTop: 20,
          borderTop: '1px solid rgba(130, 210, 175, 0.10)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 11,
          color: 'var(--muted2)',
        }}>
          <div>
            <span>(c) {year} MindSpace AI Wellbeing. Academic &amp; Educational Use Only.</span>
            <span style={{ margin: '0 8px', color: 'rgba(130, 210, 175, 0.3)' }}>•</span>
            <span style={{ fontWeight: 700, color: '#F4F8F5', letterSpacing: '0.2px' }}>
              Designed &amp; Developed by <span style={{ color: 'var(--mint)' }}>TEJESH K</span>
            </span>
          </div>
          <span>FastAPI REST Backend | React &amp; Recharts | Scikit-Learn Joblib Model</span>
        </div>
      </div>
    </footer>
  )
}
