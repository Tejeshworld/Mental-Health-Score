import {
  FiActivity, FiSmartphone, FiMoon, FiShield,
  FiTrendingUp, FiCheckCircle, FiArrowRight, FiBookOpen,
  FiUsers, FiLock, FiCpu, FiAward
} from 'react-icons/fi'
import { LuBrain, LuGraduationCap } from 'react-icons/lu'

export default function HomeFeatures({ onStart, onSignUp, currentUser }) {
  const FEATURES = [
    {
      Icon: LuBrain,
      title: 'AI-Powered Wellbeing Prediction',
      desc: 'Trained Random Forest Regression model evaluating 12 digital, lifestyle, and academic markers to estimate an objective wellbeing score.',
      tag: 'Machine Learning',
    },
    {
      Icon: FiSmartphone,
      title: 'Digital Behaviour Analysis',
      desc: 'Examines average daily screen time, social app concentration, and phone unlock frequencies to detect notification overload.',
      tag: 'Telemetry',
    },
    {
      Icon: FiMoon,
      title: 'Lifestyle Pattern Analysis',
      desc: 'Correlates sleep hours, physical movement, and study workloads against reported stress levels for systemic balance.',
      tag: 'Equilibrium',
    },
    {
      Icon: FiActivity,
      title: 'Personalized Recommendations',
      desc: 'Provides evidence-based, actionable habits for sleep regularity, focus blocks, and stress relief tailored to your schedule.',
      tag: 'Self-Care',
    },
    {
      Icon: FiTrendingUp,
      title: 'Student Progress Tracking',
      desc: 'Maintains an authenticated timeline of previous assessments so you can visualize improvements over academic terms.',
      tag: 'History',
    },
    {
      Icon: FiShield,
      title: 'Secure Student Profiles',
      desc: 'Private student data separation, isolated sessions, and local inference ensuring your academic lifestyle stays confidential.',
      tag: 'Privacy',
    },
  ]

  const STEPS = [
    {
      num: '01',
      title: 'Enter Personal Information',
      desc: 'Provide your basic demographic and academic background to contextualize your student lifestyle baseline.',
      Icon: LuGraduationCap,
    },
    {
      num: '02',
      title: 'Complete Behaviour & Lifestyle Assessment',
      desc: 'Report your average social media hours, daily unlocks, study workload, sleep duration, and perceived academic stress.',
      Icon: FiSmartphone,
    },
    {
      num: '03',
      title: 'Receive AI-Powered Wellbeing Insights',
      desc: 'Instantly view your predicted score, radar balance chart, tailored guidance, and exportable PDF assessment report.',
      Icon: LuBrain,
    },
  ]

  const BENEFITS = [
    {
      title: 'Engineered for Academic Demands',
      desc: 'Designed around university and high school realities — coursework deadlines, exam periods, and digital study fatigue.',
      Icon: FiBookOpen,
    },
    {
      title: 'Zero Judgment, Proactive Awareness',
      desc: 'A non-clinical educational companion that identifies burnout risks early without stigma or medicalization.',
      Icon: FiCheckCircle,
    },
    {
      title: 'Data Privacy as a Default',
      desc: 'Your inputs are evaluated strictly against verified algorithms. No third-party data broker sharing or advertising tracking.',
      Icon: FiLock,
    },
  ]

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(12px, 4vw, 5%)' }}>

      {/* ── 1. Features Section ────────────────────────────────────────── */}
      <section id="features" style={{ padding: '60px 0 70px' }}>
        <div style={{ textAlign: 'center', marginBottom: 46 }}>
          <div className="editorial-badge" style={{ marginBottom: 14 }}>
            <FiCpu size={13} /> Platform Architecture
          </div>
          <h2 style={{
            font: "700 clamp(28px, 4vw, 44px)/1.15 'Space Grotesk'",
            letterSpacing: '-1.5px',
            color: '#F4F8F5',
            margin: '0 0 14px',
          }}>
            Engineered for <span className="gradient-text">Student Wellbeing</span>
          </h2>
          <p style={{
            color: 'var(--muted)',
            fontSize: 'clamp(14.5px, 1.4vw, 16px)',
            maxWidth: 620,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Combining predictive machine learning with digital habit analysis to help learners cultivate balanced, sustainable academic routines.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((item, idx) => {
            const { Icon, title, desc, tag } = item
            return (
              <div
                key={title}
                className="glass"
                style={{
                  padding: 'clamp(22px, 3.5vw, 28px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 14,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(130, 210, 175, 0.35)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--line)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 11,
                      background: 'rgba(54, 214, 160, 0.08)',
                      border: '1px solid rgba(130, 210, 175, 0.20)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--mint)',
                      fontSize: 20,
                    }}>
                      <Icon />
                    </div>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '4px 9px',
                      borderRadius: 999,
                      border: '1px solid rgba(130, 210, 175, 0.10)',
                    }}>
                      {tag}
                    </span>
                  </div>

                  <h3 style={{
                    font: "700 18px 'Space Grotesk'",
                    color: '#F4F8F5',
                    margin: '0 0 10px',
                    letterSpacing: '-0.3px',
                  }}>
                    {title}
                  </h3>

                  <p style={{
                    color: 'var(--muted)',
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 2. How It Works Section ────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '60px 0 70px', borderTop: '1px solid var(--line)' }}>
        <div style={{ textAlign: 'center', marginBottom: 46 }}>
          <div className="editorial-badge" style={{ marginBottom: 14 }}>
            <FiActivity size={13} /> Clear Workflow
          </div>
          <h2 style={{
            font: "700 clamp(28px, 4vw, 42px)/1.15 'Space Grotesk'",
            letterSpacing: '-1.5px',
            color: '#F4F8F5',
            margin: '0 0 14px',
          }}>
            How <span className="gradient-text">MindSpace Works</span>
          </h2>
          <p style={{
            color: 'var(--muted)',
            fontSize: 'clamp(14.5px, 1.4vw, 16px)',
            maxWidth: 560,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Three simple, private steps connecting your everyday habits to evidence-based insights.
          </p>
        </div>

        <div className="steps-grid">
          {STEPS.map((s, idx) => {
            const { num, title, desc, Icon } = s
            return (
              <div
                key={num}
                className="glass-bright"
                style={{
                  padding: 'clamp(24px, 3.5vw, 32px)',
                  borderRadius: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}>
                    <span style={{
                      font: "700 24px 'Space Grotesk'",
                      color: 'var(--mint)',
                      letterSpacing: '-0.5px',
                    }}>
                      {num}
                    </span>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: 'rgba(54, 214, 160, 0.08)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--mint)',
                      fontSize: 17,
                    }}>
                      <Icon />
                    </div>
                  </div>

                  <h3 style={{
                    font: "700 18px 'Space Grotesk'",
                    color: '#F4F8F5',
                    margin: '0 0 10px',
                    letterSpacing: '-0.3px',
                  }}>
                    {title}
                  </h3>

                  <p style={{
                    color: 'var(--muted)',
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 3. Why MindSpace / Benefits ────────────────────────────────── */}
      <section style={{ padding: '60px 0 70px', borderTop: '1px solid var(--line)' }}>
        <div style={{ textAlign: 'center', marginBottom: 46 }}>
          <div className="editorial-badge" style={{ marginBottom: 14 }}>
            <FiAward size={13} /> Purpose &amp; Impact
          </div>
          <h2 style={{
            font: "700 clamp(28px, 4vw, 42px)/1.15 'Space Grotesk'",
            letterSpacing: '-1.5px',
            color: '#F4F8F5',
            margin: '0 0 14px',
          }}>
            Why Students Rely On <span className="gradient-text">MindSpace</span>
          </h2>
          <p style={{
            color: 'var(--muted)',
            fontSize: 'clamp(14.5px, 1.4vw, 16px)',
            maxWidth: 580,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Constructed to foster sustainable academic health through transparent algorithms and student privacy.
          </p>
        </div>

        <div className="benefits-grid">
          {BENEFITS.map((b) => {
            const { title, desc, Icon } = b
            return (
              <div
                key={title}
                className="glass"
                style={{
                  padding: 'clamp(24px, 3.5vw, 30px)',
                  borderRadius: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: 'rgba(54, 214, 160, 0.08)',
                  border: '1px solid rgba(130, 210, 175, 0.18)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--mint)',
                  fontSize: 19,
                }}>
                  <Icon />
                </div>
                <h3 style={{
                  font: "700 17px 'Space Grotesk'",
                  color: '#F4F8F5',
                  margin: 0,
                  letterSpacing: '-0.3px',
                }}>
                  {title}
                </h3>
                <p style={{
                  color: 'var(--muted)',
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 4. Call to Action Banner ───────────────────────────────────── */}
      <section style={{ padding: '40px 0 70px' }}>
        <div
          className="glass-bright"
          style={{
            padding: 'clamp(32px, 5vw, 48px) clamp(20px, 4vw, 44px)',
            borderRadius: 18,
            border: '1px solid rgba(130, 210, 175, 0.28)',
            textAlign: 'center',
            background: 'linear-gradient(145deg, #0B1D17 0%, #10271F 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.55)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle glow */}
          <div style={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 380,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(54, 214, 160, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <h2 style={{
            font: "700 clamp(24px, 3.5vw, 36px)/1.2 'Space Grotesk'",
            color: '#F4F8F5',
            letterSpacing: '-1px',
            marginBottom: 12,
            position: 'relative',
            zIndex: 1,
          }}>
            Ready to Discover Your <span className="gradient-text">Wellbeing Score?</span>
          </h2>

          <p style={{
            color: 'var(--muted)',
            fontSize: 'clamp(14px, 1.3vw, 16px)',
            maxWidth: 580,
            margin: '0 auto 28px',
            lineHeight: 1.7,
            position: 'relative',
            zIndex: 1,
          }}>
            Take the 3-minute student assessment to evaluate screen time, sleep sufficiency, and academic stress balance.
          </p>

          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1,
          }}>
            <button
              className="btn-primary"
              onClick={onStart}
              style={{ fontSize: 14.5, padding: '13px 26px' }}
            >
              Start Your Assessment <FiArrowRight size={15} />
            </button>

            {!currentUser && (
              <button
                className="btn-secondary"
                onClick={onSignUp}
                style={{ fontSize: 14.5, padding: '13px 22px' }}
              >
                Create Free Account
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}

