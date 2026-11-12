import {
  FiArrowLeft, FiShield, FiHeart, FiActivity,
  FiLock, FiCpu, FiUsers, FiCheckCircle, FiInfo
} from 'react-icons/fi'
import { LuBrain, LuGraduationCap } from 'react-icons/lu'

export default function About({ onNavigate }) {
  return (
    <section className="bg-campus" style={{
      minHeight: 'calc(100vh - 140px)',
      padding: '40px clamp(12px, 4vw, 5%) 80px',
      maxWidth: 1200,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Background Grid */}
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
        {/* Back to Home Button */}
        <div style={{ marginBottom: 30 }}>
          <button
            onClick={() => onNavigate('/')}
            className="btn-secondary"
            style={{
              padding: '9px 18px',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 10,
            }}
          >
            <FiArrowLeft size={15} /> Back to Home
          </button>
        </div>

        {/* Hero Banner */}
        <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto 50px' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 14 }}>
            <LuBrain size={14} /> About MindSpace
          </div>
          <h1 style={{
            font: "700 clamp(30px,4.5vw,52px)/1.1 'Space Grotesk'",
            color: '#F5FFF9',
            letterSpacing: '-1.5px',
            marginBottom: 18,
          }}>
            Empowering Students Through <span className="gradient-text">AI Wellbeing Insights</span>
          </h1>
          <p style={{
            color: 'var(--muted)',
            fontSize: 'clamp(15px,1.4vw,17px)',
            lineHeight: 1.8,
            maxWidth: 700,
            margin: '0 auto',
          }}>
            MindSpace is an AI-powered student mental wellbeing platform designed to help learners
            understand their digital habits, study routines, and lifestyle balance for academic and personal flourishing.
          </p>
        </div>

        {/* 1. Purpose & Awareness Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 24,
          marginBottom: 40,
        }}>
          {/* Purpose of the Platform */}
          <div className="glass-bright" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: 16 }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #28A77B, #36D6A0)',
              display: 'grid', placeItems: 'center',
              color: '#050B09', fontSize: 24,
              marginBottom: 18,
            }}>
              <FiHeart />
            </div>
            <h2 style={{ font: "700 20px 'Space Grotesk'", color: '#F4F8F5', marginBottom: 12 }}>
              Purpose of MindSpace
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Higher education and school curricula demand immense focus, leading students to navigate digital distractions,
              erratic sleep patterns, and elevated academic stress. MindSpace bridges the gap between daily lifestyle habits
              and mental wellness by providing students with private, objective, and actionable insights.
            </p>
          </div>

          {/* Mental Wellbeing Awareness */}
          <div className="glass-bright" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: 16 }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #28A77B, #36D6A0)',
              display: 'grid', placeItems: 'center',
              color: '#050B09', fontSize: 24,
              marginBottom: 18,
            }}>
              <FiActivity />
            </div>
            <h2 style={{ font: "700 20px 'Space Grotesk'", color: '#F4F8F5', marginBottom: 12 }}>
              Mental Wellbeing Awareness
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Mental health is not a binary state; it is a spectrum influenced by screen time, physical exercise, sleep
              consistency, and social connectivity. By raising self-awareness, MindSpace encourages proactive healthy habits
              before stress develops into burnout or academic distress.
            </p>
          </div>
        </div>

        {/* 2. Platform Features & Services */}
        <div style={{ marginBottom: 50 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 10 }}>
              <FiCheckCircle size={13} /> Capabilities
            </div>
            <h2 style={{ font: "700 clamp(24px,3vw,36px) 'Space Grotesk'", color: '#F5FFF9' }}>
              Features &amp; Services
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {[
              {
                Icon: LuBrain,
                title: 'Machine Learning Scoring',
                desc: 'Trained regression model analyzing 12 multidimensional lifestyle and academic variables to compute a continuous wellbeing score.'
              },
              {
                Icon: LuGraduationCap,
                title: 'Student Profile Portal',
                desc: 'Dedicated student identity profile with academic year tracking, personal metrics, and persistent assessment history records.'
              },
              {
                Icon: FiActivity,
                title: 'Interactive Visual Analytics',
                desc: 'Real-time radar charts, metric comparisons, and categorized stress breakdowns built with Recharts.'
              },
              {
                Icon: FiShield,
                title: 'Assessment PDF Reports',
                desc: 'Two-page downloadable assessment report complete with timestamp, student details, lifestyle metrics, and tailored recommendations.'
              }
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="glass" style={{ padding: 24, borderRadius: 14 }}>
                <div style={{
                  color: 'var(--mint)',
                  fontSize: 22,
                  marginBottom: 14,
                  display: 'flex',
                }}>
                  <Icon />
                </div>
                <h3 style={{ font: "600 16px 'Space Grotesk'", color: '#F5FFF9', marginBottom: 8 }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. How the AI-Powered Wellbeing Platform Works */}
        <div className="glass-bright" style={{ padding: 'clamp(24px, 4vw, 36px) clamp(16px, 4vw, 32px)', borderRadius: 18, marginBottom: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 10 }}>
              <FiCpu size={13} /> Architecture
            </div>
            <h2 style={{ font: "700 clamp(22px,2.8vw,32px) 'Space Grotesk'", color: '#F5FFF9' }}>
              How the AI-Powered Platform Works
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 640, margin: '8px auto 0' }}>
              From student input to machine learning inference and tailored guidance.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            position: 'relative',
          }}>
            {[
              {
                step: '01',
                title: 'Student Input',
                desc: 'Enter digital habits, screen time, phone unlocks, sleep, study hours, physical activity, and perceived stress.'
              },
              {
                step: '02',
                title: 'FastAPI REST Pipeline',
                desc: 'Data is validated strictly against Pydantic schemas and formatted into normalized feature matrices.'
              },
              {
                step: '03',
                title: 'ML Model Inference',
                desc: 'Scikit-learn model evaluates complex correlations between habits and mental wellbeing to predict an exact score.'
              },
              {
                step: '04',
                title: 'Actionable Guidance',
                desc: 'Instant visual score breakdown, personalized wellness tips, and downloadable PDF report for reflective self-care.'
              }
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                style={{
                  padding: '22px 18px',
                  borderRadius: 12,
                  background: '#0B1D17',
                  border: '1px solid rgba(130, 210, 175, 0.13)',
                }}
              >
                <div style={{
                  font: "700 28px 'Space Grotesk'",
                  color: '#36D6A0',
                  opacity: 0.9,
                  marginBottom: 8,
                }}>
                  {step}
                </div>
                <h4 style={{ font: "600 15px 'Space Grotesk'", color: '#F4F8F5', marginBottom: 6 }}>
                  {title}
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Privacy & Data Protection */}
        <div className="glass" style={{
          padding: '32px 30px',
          borderRadius: 16,
          border: '1px solid rgba(130, 210, 175, 0.16)',
          background: '#0B1D17',
          marginBottom: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 14,
              background: 'rgba(54, 214, 160, 0.10)',
              border: '1px solid rgba(54, 214, 160, 0.25)',
              color: '#36D6A0',
              fontSize: 24,
              display: 'grid', placeItems: 'center',
              flexShrink: 0,
            }}>
              <FiLock />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3 style={{ font: "700 19px 'Space Grotesk'", color: '#F4F8F5', margin: '0 0 8px' }}>
                Privacy and Data Protection
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '0 0 12px' }}>
                We believe mental wellbeing information is deeply personal. MindSpace adheres to strict privacy standards:
              </p>
              <ul style={{
                color: '#C8DBD2',
                fontSize: 13,
                lineHeight: 1.8,
                paddingLeft: 20,
                margin: 0,
              }}>
                <li>All passwords are encrypted with military-grade PBKDF2-HMAC-SHA256 (100,000 iterations).</li>
                <li>Assessments are linked strictly to your authenticated student profile and are never shared publicly.</li>
                <li>MindSpace is an educational and self-reflection dashboard; data is not sold or used for commercial profiling.</li>
                <li>The system does not replace clinical medical diagnosis; it promotes mindfulness and digital balance.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <h3 style={{ font: "700 22px 'Space Grotesk'", color: '#F5FFF9', marginBottom: 14 }}>
            Ready to Explore Your Wellbeing?
          </h3>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('/signup')}
              className="btn-primary"
              style={{ padding: '12px 26px', fontSize: 14 }}
            >
              Create Student Account
            </button>
            <button
              onClick={() => onNavigate('/signin')}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: 14 }}
            >
              Sign In to MindSpace
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

