import { FiArrowRight, FiBarChart2, FiShield, FiHeart, FiActivity, FiUserPlus, FiLogIn, FiUser } from 'react-icons/fi'
import { LuBrain } from 'react-icons/lu'

const FEATURES = [
  { Icon: LuBrain,     color: 'var(--mint)',    label: 'AI-Powered Analysis',  desc: 'Trained ML model' },
  { Icon: FiHeart,     color: '#F4A261',         label: 'Wellness Scoring',     desc: 'Personalised score' },
  { Icon: FiShield,    color: 'var(--lime)',     label: 'Private & Secure',     desc: 'Local processing' },
  { Icon: FiBarChart2, color: 'var(--emerald)',  label: 'Visual Insights',      desc: 'Interactive charts' },
]

export default function Hero({ onStart, onInsights, score, hasPrediction, onResultClick, currentUser, onNavigate }) {
  return (
    <section className="bg-campus" style={{
      position: 'relative',
      padding: 'clamp(36px, 6vw, 70px) clamp(12px, 4vw, 5%) 60px',
      maxWidth: 1300,
      margin: '0 auto',
      overflow: 'hidden',
    }}>

      {/* Subtle notebook-grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(112,225,181,.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(112,225,181,.035) 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px',
        pointerEvents: 'none',
      }} />

      {/* Glow blobs */}
      <div style={{
        position: 'absolute', top: -120, left: -100,
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,184,122,.18) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, right: -80,
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(112,225,181,.12) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div className="hero-grid" style={{
        position: 'relative', zIndex: 1,
      }}>

        {/* ── Text side ─────────────────────────────────── */}
        <div style={{ animation: 'fadeSlideUp .6s ease both' }}>

          {/* Eyebrow */}
          <div className="section-eyebrow" style={{ marginBottom: 20 }}>
            <LuBrain size={13} />
            AI Student Wellbeing Platform
          </div>

          {/* Headline */}
          <h1 style={{
            font: "700 clamp(34px,5.4vw,66px)/1.08 'Space Grotesk'",
            letterSpacing: '-2px',
            marginBottom: 20,
            maxWidth: 740,
            color: 'var(--text)',
          }}>
            Find Your Balance.
            <br />
            <span className="gradient-text">Understand Your Wellbeing.</span>
          </h1>

          {/* Description */}
          <p style={{
            color: 'var(--muted)',
            fontSize: 'clamp(15px,1.5vw,17px)',
            lineHeight: 1.75,
            maxWidth: 580,
            marginBottom: 34,
          }}>
            An intelligent student wellbeing companion that transforms lifestyle and digital behaviour into meaningful insights. Discover your personalised score using our trained machine learning model.
          </p>

          {/* CTA buttons */}
          <div className="hero-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
            <button
              className="btn-primary"
              onClick={onStart}
              style={{ fontSize: 14.5, padding: '13px 24px' }}
            >
              Start Your Assessment <FiArrowRight size={15} />
            </button>

            <button
              className="btn-secondary"
              onClick={onInsights}
              style={{ fontSize: 14.5, padding: '13px 20px' }}
            >
              <FiBarChart2 size={15} /> Explore MindSpace
            </button>

            {!currentUser ? (
              <>
                <button
                  className="btn-secondary"
                  onClick={() => onNavigate?.('/signup')}
                  style={{
                    fontSize: 14.5,
                    padding: '13px 22px',
                    borderColor: 'rgba(130, 210, 175, 0.25)',
                    color: 'var(--mint)',
                  }}
                >
                  <FiUserPlus size={15} /> Sign Up
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => onNavigate?.('/signin')}
                  style={{ fontSize: 14.5, padding: '13px 20px' }}
                >
                  <FiLogIn size={15} /> Sign In
                </button>
              </>
            ) : (
              <button
                className="btn-secondary"
                onClick={() => onNavigate?.('/dashboard')}
                style={{
                  fontSize: 14.5,
                  padding: '13px 22px',
                  borderColor: 'rgba(130, 210, 175, 0.25)',
                  color: 'var(--mint)',
                }}
              >
                <FiUser size={15} /> Student Dashboard
              </button>
            )}
          </div>

          {/* Feature chips */}
          <div className="hero-chips" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {FEATURES.map(({ Icon, color, label, desc }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 15px',
                borderRadius: 999,
                border: '1px solid rgba(112,225,181,.18)',
                background: 'rgba(112,225,181,.06)',
                fontSize: 12,
                color: 'var(--muted)',
                transition: 'all .2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(112,225,181,.45)'
                  e.currentTarget.style.background = 'rgba(112,225,181,.12)'
                  e.currentTarget.style.color = 'var(--text)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(112,225,181,.18)'
                  e.currentTarget.style.background = 'rgba(112,225,181,.06)'
                  e.currentTarget.style.color = 'var(--muted)'
                }}
              >
                <Icon size={14} style={{ color, flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Orb / illustration side ───────────────────── */}
        <div
          className="hero-orb-wrap"
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 24,
            minWidth: 220,
          }}
        >
          {/* Animated orb */}
          <div style={{ position: 'relative', width: 210, height: 210 }}>
            {/* Core orb */}
            <div style={{
              width: 160, height: 160,
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 35% 30%, rgba(255,255,255,.35), transparent 14%),
                linear-gradient(135deg, #1DB87A, #36D6A0 55%, #65E6BB)
              `,
              animation: 'float 5s ease-in-out infinite, pulse-glow 4s ease-in-out infinite',
              display: 'grid', placeItems: 'center',
              color: '#050B09',
              fontSize: 54,
            }}>
              <LuBrain />
            </div>

            {/* Orbit rings */}
            <div style={{
              position: 'absolute', inset: -20,
              borderRadius: '50%',
              border: '1px solid rgba(130, 210, 175, 0.25)',
              transform: 'rotate(-25deg) scaleY(.42)',
            }} />
            <div style={{
              position: 'absolute', inset: -40,
              borderRadius: '50%',
              border: '1px solid rgba(29, 184, 122, 0.20)',
              transform: 'rotate(40deg) scaleY(.38)',
            }} />

            {/* Orbiting dot 1 */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 12, height: 12,
              marginTop: -6, marginLeft: -6,
              animation: 'orbit1 6s linear infinite',
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: 'var(--mint)',
                boxShadow: '0 0 14px var(--mint)',
              }} />
            </div>

            {/* Orbiting dot 2 */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 9, height: 9,
              marginTop: -4.5, marginLeft: -4.5,
              animation: 'orbit2 4s linear infinite',
            }}>
              <div style={{
                width: 9, height: 9, borderRadius: '50%',
                background: 'var(--teal)',
                boxShadow: '0 0 10px var(--teal)',
              }} />
            </div>
          </div>

          {/* Score preview card */}
          <div
            className="glass"
            onClick={hasPrediction && onResultClick ? onResultClick : undefined}
            style={{
              padding: '16px 24px',
              borderRadius: 14,
              textAlign: 'center',
              minWidth: 170,
              border: hasPrediction ? '1px solid var(--mint)' : '1px solid var(--line)',
              cursor: hasPrediction && onResultClick ? 'pointer' : 'default',
              boxShadow: hasPrediction ? '0 0 24px rgba(54, 214, 160, 0.20)' : undefined,
              transition: 'transform .2s ease, box-shadow .2s ease',
            }}
          >
            <div style={{
              font: "700 11px 'Space Grotesk'",
              color: 'var(--mint)',
              letterSpacing: '1.6px',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Wellbeing Score
            </div>
            <div style={{
              font: "700 34px 'Space Grotesk'",
              lineHeight: 1,
            }} className="gradient-text">
              {hasPrediction && score !== null && score !== undefined
                ? Number(score).toFixed(2)
                : '– –'}
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: hasPrediction ? 600 : 400,
              color: hasPrediction ? '#65E6BB' : 'var(--muted)',
              marginTop: 6,
            }}>
              {hasPrediction && score !== null && score !== undefined
                ? 'Scale: 1.0 – 10.0'
                : 'Complete assessment'}
            </div>
          </div>

          {/* Student label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px',
            borderRadius: 999,
            border: '1px solid rgba(130, 210, 175, 0.16)',
            background: 'rgba(54, 214, 160, 0.06)',
            fontSize: 12, color: 'var(--muted)',
          }}>
            <FiActivity size={13} style={{ color: 'var(--mint)' }} />
            ML-Powered Prediction
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .hero-orb-wrap { display: none !important; }
        }
      `}</style>
    </section>
  )
}
