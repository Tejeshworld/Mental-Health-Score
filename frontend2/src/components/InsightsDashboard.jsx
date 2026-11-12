import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  FiSmartphone, FiBookOpen, FiMoon, FiActivity,
  FiBarChart2, FiPieChart, FiInfo, FiArrowRight,
} from 'react-icons/fi'
import { LuBrain, LuSparkles } from 'react-icons/lu'

/* Refined studio palette for charts */
const MINT = '#36D6A0'
const EMERALD = '#28A77B'
const LIGHT_GREEN = '#65E6BB'
const SAGE = '#4BAB84'
const AMBER = '#F5C842'

/* Stress mapping for Radar */
const stressMap = { Low: 25, Medium: 50, High: 75, 'Very High': 100 }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0B1D17',
      border: '1px solid rgba(130, 210, 175, 0.25)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 12,
      boxShadow: '0 8px 30px rgba(0,0,0,.55)',
      color: '#F4F8F5',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ color: 'var(--muted)', marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--mint)', fontSize: 14 }}>
        {payload[0].value} {payload[0].unit || 'hrs'}
      </div>
    </div>
  )
}

function InsightCard({ Icon, label, value, unit, max, color, description }) {
  const pct = max ? Math.min((+value / max) * 100, 100) : null
  return (
    <div className="glass" style={{
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      border: `1px solid ${color}26`,
      transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 14px 38px ${color}22`
        e.currentTarget.style.borderColor = `${color}55`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = `${color}26`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          width: 42, height: 42,
          borderRadius: 12,
          display: 'grid', placeItems: 'center',
          background: `${color}18`,
          color: color,
          fontSize: 19,
          boxShadow: `0 0 16px ${color}26`,
        }}>
          <Icon />
        </div>
        <div style={{
          font: "700 21px 'Space Grotesk'",
          color: color,
          display: 'flex',
          alignItems: 'baseline',
          gap: 3,
        }}>
          {value}
          {unit && <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{unit}</span>}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#F5FFF9', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
          {description}
        </div>
      </div>

      {pct != null && (
        <div style={{
          height: 5,
          borderRadius: 99,
          background: 'rgba(112,225,181,.09)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}55`,
            transition: 'width 1.2s cubic-bezier(.22,.61,.36,1)',
          }} />
        </div>
      )}
    </div>
  )
}

export default function InsightsDashboard({ formData, score, onStartAssessment }) {
  /* Empty state if assessment hasn't been submitted yet */
  if (!formData) {
    return (
      <section className="bg-campus" style={{
        padding: '20px clamp(12px, 4vw, 5%) 70px',
        maxWidth: 1300,
        margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 12 }}>
            <FiBarChart2 size={13} />
            Student Wellbeing Overview
          </div>
          <h2 style={{
            font: "700 clamp(26px,3.5vw,42px)/1.1 'Space Grotesk'",
            letterSpacing: '-1.5px',
          }}>
            Lifestyle Patterns & <span className="gradient-text">Insights</span>
          </h2>
        </div>

        <div className="glass-bright" style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '44px 32px',
          textAlign: 'center',
          border: '1px solid rgba(130, 210, 175, 0.16)',
          background: '#0B1D17',
          position: 'relative',
        }}>
          <div style={{
            width: 58,
            height: 58,
            borderRadius: 16,
            background: 'rgba(54, 214, 160, 0.10)',
            border: '1px solid rgba(54, 214, 160, 0.22)',
            color: '#36D6A0',
            display: 'grid',
            placeItems: 'center',
            fontSize: 26,
            margin: '0 auto 20px',
            boxShadow: '0 0 24px rgba(54, 214, 160, 0.18)',
          }}>
            <FiBarChart2 />
          </div>

          <h3 style={{
            font: "700 22px 'Space Grotesk'",
            color: '#F4F8F5',
            marginBottom: 10,
          }}>
            No Assessment Data Submitted Yet
          </h3>
          <p style={{
            color: 'var(--muted)',
            fontSize: 14,
            lineHeight: 1.7,
            maxWidth: 500,
            margin: '0 auto 26px',
          }}>
            Complete the 3-step student wellbeing questionnaire above to generate your real-time daily routine distribution, balance radar, and AI prediction score.
          </p>

          <button
            className="btn-primary"
            onClick={onStartAssessment}
            style={{ margin: '0 auto' }}
          >
            Start Student Assessment <FiArrowRight size={14} />
          </button>
        </div>
      </section>
    )
  }

  /* Bar chart data with exact student values */
  const barData = [
    { name: 'Screen Time', value: +formData.avg_daily_usage_hours, fill: MINT },
    { name: 'Study Hours', value: +formData.study_hours, fill: EMERALD },
    { name: 'Sleep', value: +formData.sleep_hours_per_night, fill: LIGHT_GREEN },
    { name: 'Activity', value: +formData.physical_activity_hours, fill: SAGE },
  ]

  /* Radar chart benchmarked metrics */
  const radarData = [
    { subject: 'Sleep Rest', A: Math.min(Math.round((+formData.sleep_hours_per_night / 8) * 100), 100) },
    { subject: 'Movement', A: Math.min(Math.round((+formData.physical_activity_hours / 2.5) * 100), 100) },
    { subject: 'Study Focus', A: Math.min(Math.round((+formData.study_hours / 8) * 100), 100) },
    { subject: 'Screen Control', A: Math.max(Math.round(100 - (+formData.avg_daily_usage_hours / 10) * 100), 10) },
    { subject: 'Model Wellbeing', A: Math.min(Math.max(Math.round(((Number(score) || 6.2) / 10) * 100), 0), 100) },
    { subject: 'Calmness', A: Math.round(100 - (stressMap[formData.stress_level] ?? 50)) },
  ]

  return (
    <section className="bg-campus" style={{
      padding: '20px clamp(12px, 4vw, 5%) 70px',
      maxWidth: 1300,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Grid background */}
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
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 12 }}>
            <FiBarChart2 size={13} />
            Student Wellbeing Overview
          </div>
          <h2 style={{
            font: "700 clamp(26px,3.5vw,42px)/1.1 'Space Grotesk'",
            letterSpacing: '-1.5px',
          }}>
            Lifestyle Patterns & <span className="gradient-text">Insights</span>
          </h2>
          <p style={{
            color: 'var(--muted)',
            marginTop: 10,
            fontSize: 15,
            maxWidth: 580,
            margin: '10px auto 0',
          }}>
            Visualizing your reported daily schedule, activity levels, and psychological equilibrium without assumptions.
          </p>
        </div>

        {/* 5 Metric cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
          gap: 16,
          marginBottom: 30,
        }}>
          <InsightCard
            Icon={FiSmartphone}
            label="Digital Usage"
            value={formData.avg_daily_usage_hours}
            unit="hrs/day"
            max={12}
            color={MINT}
            description="Average social and entertainment screen time"
          />
          <InsightCard
            Icon={FiBookOpen}
            label="Academic Lifestyle"
            value={formData.study_hours}
            unit="hrs/day"
            max={16}
            color={EMERALD}
            description="Dedicated study and academic preparation"
          />
          <InsightCard
            Icon={FiMoon}
            label="Sleep Sufficiency"
            value={formData.sleep_hours_per_night}
            unit="hrs/night"
            max={10}
            color={LIGHT_GREEN}
            description="Nightly restorative rest duration"
          />
          <InsightCard
            Icon={FiActivity}
            label="Physical Activity"
            value={formData.physical_activity_hours}
            unit="hrs/day"
            max={4}
            color={SAGE}
            description="Sports, gym, walking, and movement"
          />
          <InsightCard
            Icon={LuBrain}
            label="Stress Level"
            value={formData.stress_level}
            color={AMBER}
            description="Perceived academic and daily pressure"
          />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid" style={{ marginBottom: 24 }}>
          {/* Daily Time Distribution Bar Chart */}
          <div className="glass-bright" style={{ padding: 'clamp(14px, 3vw, 24px)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              gap: 8,
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ color: 'var(--mint)', fontSize: 18 }}><FiBarChart2 /></span>
                <span style={{ font: "600 15px 'Space Grotesk'", color: 'var(--text)' }}>
                  Daily Time Distribution (Hours)
                </span>
              </div>
              <span style={{
                fontSize: 11,
                color: 'var(--muted)',
                background: 'rgba(112,225,181,.08)',
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid rgba(112,225,181,.16)',
              }}>
                Reported
              </span>
            </div>

            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} barCategoryGap="32%" margin={{ top: 10, right: 12, bottom: 5, left: -16 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9AAFA5', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 'dataMax+1']}
                  tick={{ fill: '#9AAFA5', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(54, 214, 160, 0.05)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lifestyle Balance Radar Chart */}
          <div className="glass-bright" style={{ padding: 'clamp(14px, 3vw, 24px)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              gap: 8,
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ color: 'var(--mint)', fontSize: 18 }}><FiPieChart /></span>
                <span style={{ font: "600 15px 'Space Grotesk'", color: 'var(--text)' }}>
                  Student Lifestyle Balance Radar
                </span>
              </div>
              <span style={{
                fontSize: 11,
                color: 'var(--muted)',
                background: 'rgba(130, 210, 175, 0.08)',
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid rgba(130, 210, 175, 0.16)',
              }}>
                Benchmark %
              </span>
            </div>

            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radarData} margin={{ top: 0, right: 15, bottom: 0, left: 15 }}>
                <PolarGrid stroke="rgba(130, 210, 175, 0.13)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9AAFA5', fontSize: 10 }} />
                <Radar
                  name="Student Routine"
                  dataKey="A"
                  stroke={MINT}
                  fill={EMERALD}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dashboard verification banner */}
        <div className="glass" style={{
          padding: '16px 20px',
          border: '1px solid rgba(130, 210, 175, 0.13)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <FiInfo size={18} style={{ color: 'var(--mint)', marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: '#F4F8F5' }}>Data Integrity Notice:</strong> These visualizations display solely the values you entered in your assessment form. No fabricated population metrics, hypothetical trends, or clinical extrapolations are presented.
          </p>
        </div>
      </div>
    </section>
  )
}
