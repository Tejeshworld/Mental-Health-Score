import {
  FiMoon, FiSmartphone, FiActivity,
  FiBookOpen, FiShield, FiHeart, FiCheck,
} from 'react-icons/fi'
import { LuBrain } from 'react-icons/lu'
import { MdOutlineHealthAndSafety } from 'react-icons/md'

const TIPS = [
  {
    Icon: FiMoon,
    color: '#36D6A0',
    title: 'Healthy Sleep Routine',
    points: [
      'Aim for 7 to 9 hours of uninterrupted rest every night.',
      'Maintain steady sleep and wake times even on weekends.',
      'Dim screens and disengage from feeds 30 minutes prior to bed.',
      'Keep your study desk separate from your sleeping area if possible.',
    ],
  },
  {
    Icon: FiSmartphone,
    color: '#28A77B',
    title: 'Mindful Digital Usage',
    points: [
      'Enable built-in screen time limits on high-scroll social platforms.',
      'Take 5-minute eye and posture relief breaks every hour of screen work.',
      'Use bedtime or focus mode to pause notification triggers.',
      'Establish phone-free focus blocks during lectures and meals.',
    ],
  },
  {
    Icon: FiActivity,
    color: '#65E6BB',
    title: 'Daily Movement & Energy',
    points: [
      'Target 30 minutes of moderate aerobic or brisk walking exercise.',
      'Take short strolls across campus between intense study blocks.',
      'Simple mobility stretches relieve neck and upper-back fatigue.',
      'Regular physical activity boosts cognitive focus and sleep depth.',
    ],
  },
  {
    Icon: FiBookOpen,
    color: '#4BAB84',
    title: 'Academic–Life Balance',
    points: [
      'Structure study with the Pomodoro technique (25 min study, 5 min rest).',
      'Set clear boundaries separating coursework from personal downtime.',
      'Break semester projects into bite-sized milestones to prevent panic.',
      'Consistent daily revision prevents exam-week sleep deprivation.',
    ],
  },
  {
    Icon: LuBrain,
    color: '#F5C842',
    title: 'Stress & Cognitive Recovery',
    points: [
      'Practice slow 4-7-8 diaphragmatic breathing when feeling overwhelmed.',
      'Share academic pressures with friends, peers, or student mentors.',
      'Write down worry lists before bed to clear mental bandwidth.',
      'Recognize early fatigue signs before burnout sets in.',
    ],
  },
  {
    Icon: MdOutlineHealthAndSafety,
    color: '#8FECC8',
    title: 'Campus & Professional Care',
    points: [
      'Your university student health centre provides confidential counselling.',
      'Seeking guidance early is a proactive strength, never a weakness.',
      'Peer support groups and wellness advisers are accessible resources.',
      'Remember: MindSpace is an awareness tool, not a clinical consultation.',
    ],
  },
]

function TipCard({ tip }) {
  const { Icon, color, title, points } = tip
  return (
    <div
      className="glass"
      style={{
        padding: 24,
        border: `1px solid ${color}24`,
        transition: 'transform .22s ease, box-shadow .22s ease, border-color .22s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 16px 45px ${color}20`
        e.currentTarget.style.borderColor = `${color}55`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = `${color}24`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: 12,
          display: 'grid', placeItems: 'center',
          background: `${color}18`,
          color: color,
          fontSize: 22,
          boxShadow: `0 0 18px ${color}26`,
          flexShrink: 0,
        }}>
          <Icon />
        </div>
        <h3 style={{
          font: "600 16px 'Space Grotesk'",
          color: '#F5FFF9',
          margin: 0,
          letterSpacing: '-0.2px',
        }}>
          {title}
        </h3>
      </div>

      <ul style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {points.map((p, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{
              width: 18, height: 18,
              borderRadius: 6,
              background: `${color}16`,
              color: color,
              display: 'grid',
              placeItems: 'center',
              fontSize: 10,
              fontWeight: 700,
              flexShrink: 0,
              marginTop: 2,
            }}>
              {i + 1}
            </span>
            <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              {p}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function WellnessTips() {
  return (
    <section className="bg-study" style={{
      padding: '30px clamp(12px, 4vw, 5%) 70px',
      maxWidth: 1300,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Grid overlay */}
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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 12 }}>
            <FiHeart size={13} />
            Wellness Recommendations
          </div>
          <h2 style={{
            font: "700 clamp(26px,3.5vw,42px)/1.1 'Space Grotesk'",
            letterSpacing: '-1.5px',
          }}>
            Evidence-Based <span className="gradient-text">Student Guidance</span>
          </h2>
          <p style={{
            color: 'var(--muted)',
            marginTop: 10,
            fontSize: 15,
            maxWidth: 580,
            margin: '10px auto 0',
          }}>
            Actionable strategies designed for student routines to encourage sustainable academic and digital balance.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 20,
          marginBottom: 34,
        }}>
          {TIPS.map(tip => <TipCard key={tip.title} tip={tip} />)}
        </div>

        {/* Disclaimer banner */}
        <div className="glass" style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: 'clamp(16px, 3vw, 20px) clamp(14px, 4vw, 24px)',
          borderRadius: 16,
          border: '1px solid rgba(130, 210, 175, 0.16)',
          background: '#0B1D17',
          color: 'var(--muted)',
          fontSize: 13,
          lineHeight: 1.7,
          textAlign: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#36D6A0',
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 6,
          }}>
            <MdOutlineHealthAndSafety size={18} />
            Important Educational Disclaimer
          </div>
          MindSpace generates scores strictly through algorithmic inference on self-reported survey inputs. This web application is an educational wellbeing dashboard and does not provide clinical diagnosis, psychiatric consultation, or medical evaluation. If you or a fellow student are experiencing mental health challenges, please connect directly with your institution’s counselling services or a licensed mental healthcare professional.
        </div>
      </div>
    </section>
  )
}
