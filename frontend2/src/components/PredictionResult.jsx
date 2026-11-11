import { useEffect, useRef, useState } from 'react'
import {
  FiRefreshCw, FiCopy, FiCheck, FiDownload,
  FiActivity, FiArrowRight, FiCalendar, FiClock
} from 'react-icons/fi'
import { LuBrain, LuSparkles } from 'react-icons/lu'
import { MdOutlineHealthAndSafety } from 'react-icons/md'
import { generateAndDownloadReport } from '../utils/generatePdfReport'

function useCounter(target, duration = 1200) {
  const ref = useRef(null)
  const frame = useRef(null)

  useEffect(() => {
    if (ref.current == null) return
    const numericTarget = Number(target) || 0
    const start = performance.now()
    const run = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const val = +(t * numericTarget).toFixed(2)
      if (ref.current) ref.current.textContent = val.toFixed(2)
      if (t < 1) frame.current = requestAnimationFrame(run)
    }
    frame.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])

  return ref
}

function ScoreRing({ score }) {
  // Model score range is 1.0 to 10.0
  const numericScore = Number(score) || 0
  const pct = Math.min(Math.max((numericScore / 10) * 100, 0), 100)
  const dash = `conic-gradient(from -90deg, #70E1B5 ${pct * 3.6}deg, rgba(112,225,181,.12) 0deg)`
  const numRef = useCounter(numericScore)

  return (
    <div style={{
      width: 148, height: 148,
      borderRadius: '50%',
      background: dash,
      padding: 6,
      boxShadow: '0 0 35px rgba(112,225,181,.35)',
      animation: 'pulse-glow 3s ease-in-out infinite',
      flexShrink: 0,
    }}>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #104638, #092C24)',
        border: '1px solid rgba(112,225,181,.20)',
        display: 'grid', placeItems: 'center',
        textAlign: 'center',
      }}>
        <div>
          <div ref={numRef} style={{
            font: "700 32px 'Space Grotesk'",
            lineHeight: 1,
            color: '#F5FFF9',
            animation: 'countUp .5s ease both',
          }}>
            {numericScore.toFixed(2)}
          </div>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--mint)',
            letterSpacing: '1.6px',
            marginTop: 4,
          }}>
            OUT OF 10.0
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreBar({ score }) {
  const numericScore = Number(score) || 0
  const pct = Math.min(Math.max((numericScore / 10) * 100, 0), 100)
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11, fontWeight: 600,
        color: 'var(--muted)', marginBottom: 8,
      }}>
        <span>1.0 (Lower Wellbeing)</span>
        <span style={{ color: 'var(--mint)', fontWeight: 700 }}>
          Score: {numericScore.toFixed(2)} / 10.0
        </span>
        <span>10.0 (Higher Wellbeing)</span>
      </div>
      <div style={{
        height: 8, borderRadius: 99,
        background: 'rgba(112,225,181,.12)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 99,
          background: 'linear-gradient(90deg, #1DB87A, #70E1B5)',
          boxShadow: '0 0 14px rgba(112,225,181,.6)',
          transition: 'width 1.4s cubic-bezier(.22,.61,.36,1)',
        }} />
      </div>
    </div>
  )
}

function StatChip({ label, value }) {
  return (
    <div style={{
      padding: '11px 14px',
      borderRadius: 12,
      background: 'rgba(16,70,56,.65)',
      border: '1px solid rgba(112,225,181,.16)',
    }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ font: "600 14px 'Space Grotesk'", color: '#F5FFF9' }}>{value}</div>
    </div>
  )
}

export default function PredictionResult({ score, formData, timestamp, onReset }) {
  const [copied, setCopied] = useState(false)
  const numericScore = Number(score) || 0
  const completionDate = timestamp || new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const handleCopy = () => {
    const text = `MindSpace Student Wellbeing Score: ${numericScore.toFixed(2)} / 10.0 (Assessment Date: ${completionDate})`
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  const handleDownload = () => {
    generateAndDownloadReport({
      formData,
      score: numericScore,
      timestamp: completionDate,
    })
  }

  return (
    <section className="bg-nature" style={{
      padding: '10px 5% 60px',
      maxWidth: 1300,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Subtle grid */}
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
        {/* Dedicated Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 12 }}>
            <LuSparkles size={14} />
            ML Model Results
          </div>
          <h2 style={{
            font: "700 clamp(24px,3.2vw,38px)/1.2 'Space Grotesk'",
            letterSpacing: '-1.2px',
          }}>
            Predicted Mental Health Score and <span className="gradient-text">Assessment Summary</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: 10, fontSize: 15, maxWidth: 580, margin: '10px auto 0' }}>
            Direct prediction from the trained Random Forest Regression model evaluated on your submitted digital habits and lifestyle factors.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.9fr) minmax(0,1.1fr)',
          gap: 24,
          maxWidth: 1040,
          margin: '0 auto',
        }}>
          {/* Main result glass card */}
          <div className="glass-bright" style={{
            padding: 32,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(112,225,181,.28)',
            animation: 'fadeSlideUp .4s ease both',
          }}>
            {/* Top ambient glow */}
            <div style={{
              position: 'absolute', top: -70, right: -70,
              width: 240, height: 240,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(112,225,181,.18) 0%, transparent 70%)',
              filter: 'blur(45px)',
              pointerEvents: 'none',
            }} />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 12,
            }}>
              <div style={{
                fontSize: 11,
                letterSpacing: '2px',
                color: 'var(--mint)',
                textTransform: 'uppercase',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <FiActivity size={13} />
                Random Forest Regressor Output
              </div>

              {/* Timestamp badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: 'var(--muted)',
                background: 'rgba(112,225,181,.08)',
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid rgba(112,225,181,.18)',
              }}>
                <FiCalendar size={12} style={{ color: 'var(--mint)' }} />
                <span>{completionDate}</span>
              </div>
            </div>

            <h3 style={{
              font: "700 24px 'Space Grotesk'",
              color: 'var(--text)',
              marginBottom: 8,
            }}>
              Predicted Mental Health Score: <span className="gradient-text">{numericScore.toFixed(2)}</span>
            </h3>
            <p style={{
              color: 'var(--muted)',
              fontSize: 13,
              lineHeight: 1.65,
              marginBottom: 24,
            }}>
              This score was generated by a Random Forest regression model trained on 5,000 student records. In the dataset, mental health scores range from <strong>3.6 to 9.4</strong> with an average of <strong>6.23</strong> on a 1.0 to 10.0 scale.
            </p>

            {/* Score row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              marginBottom: 26,
              flexWrap: 'wrap',
            }}>
              <ScoreRing score={numericScore} />
              <div style={{ flex: 1, minWidth: 210 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                  color: 'var(--mint)',
                  font: "700 16px 'Space Grotesk'",
                }}>
                  <LuBrain size={18} />
                  Model Evaluation: {numericScore.toFixed(2)} / 10.0
                </div>
                <ScoreBar score={numericScore} />
                <p style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  lineHeight: 1.65,
                  marginTop: 12,
                }}>
                  Higher values indicate positive equilibrium across sleep, physical activity, and moderate screen time. Lower values correlate with high unlock counts, sleep deficit, and elevated academic stress.
                </p>
              </div>
            </div>

            {/* Quick stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 12,
              marginBottom: 26,
            }}>
              <StatChip label="Primary Platform" value={formData.most_used_platform} />
              <StatChip label="Usage Time" value={`${formData.avg_daily_usage_hours} hrs/day`} />
              <StatChip label="Study Schedule" value={`${formData.study_hours} hrs/day`} />
              <StatChip label="Reported Stress" value={formData.stress_level} />
            </div>

            {/* Actions including Download Assessment Report (PDF) */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                className="btn-primary"
                onClick={handleDownload}
                style={{
                  fontSize: 14,
                  padding: '13px 22px',
                  boxShadow: '0 8px 28px rgba(29,184,122,.55)',
                }}
              >
                <FiDownload size={16} /> Download Assessment Report (PDF)
              </button>
              <button className="btn-secondary" onClick={handleCopy}>
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                {copied ? 'Score Copied' : 'Copy Score'}
              </button>
              <button className="btn-secondary" onClick={onReset}>
                <FiRefreshCw size={14} /> Assess Again
              </button>
            </div>
          </div>

          {/* Assessment summary sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="glass" style={{
              padding: 24,
              border: '1px solid rgba(112,225,181,.18)',
              animation: 'fadeSlideUp .5s ease both',
            }}>
              <div style={{
                font: "600 15px 'Space Grotesk'",
                marginBottom: 16,
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <LuBrain size={16} style={{ color: 'var(--mint)' }} />
                Submitted Assessment Details
              </div>
              {[
                ['Age', `${formData.age} years`],
                ['Gender', formData.gender],
                ['Country', formData.country],
                ['Academic Level', formData.academic_level],
                ['Sleep Duration', `${formData.sleep_hours_per_night} hrs/night`],
                ['Physical Activity', `${formData.physical_activity_hours} hrs/day`],
                ['Purpose of Use', formData.purpose_of_use],
                ['Daily Phone Unlocks', `${formData.daily_unlocks} /day`],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 0',
                  borderBottom: '1px solid rgba(112,225,181,.08)',
                  fontSize: 12,
                }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#F5FFF9' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Medical disclaimer note */}
            <div style={{
              padding: '16px 18px',
              borderRadius: 14,
              border: '1px solid rgba(112,225,181,.22)',
              background: 'rgba(16,70,56,.55)',
              color: 'var(--muted)',
              fontSize: 12,
              lineHeight: 1.65,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                color: '#F5C842',
                fontWeight: 700,
                marginBottom: 6,
                fontSize: 12,
              }}>
                <MdOutlineHealthAndSafety size={16} />
                ML Estimate – Not a Medical Diagnosis
              </div>
              The predicted score is computed via machine learning regression on self-reported survey inputs. It provides educational awareness and does not replace medical or psychiatric evaluation by a licensed healthcare professional.
            </div>

            <button
              className="btn-primary"
              onClick={handleDownload}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <FiDownload size={15} /> Download Assessment Report (PDF)
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
