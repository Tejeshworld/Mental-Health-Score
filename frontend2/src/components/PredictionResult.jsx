import { useEffect, useRef, useState } from 'react'
import {
  FiRefreshCw, FiCopy, FiCheck, FiDownload,
  FiActivity, FiArrowRight, FiCalendar, FiClock,
  FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiInfo
} from 'react-icons/fi'
import { LuBrain, LuSparkles } from 'react-icons/lu'
import { MdOutlineHealthAndSafety } from 'react-icons/md'
import { generateAndDownloadReport } from '../utils/generatePdfReport'
import { getSignalClassification } from '../utils/signalClassification'

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
  const dash = `conic-gradient(from -90deg, #36D6A0 ${pct * 3.6}deg, rgba(54, 214, 160, 0.12) 0deg)`
  const numRef = useCounter(numericScore)

  return (
    <div style={{
      width: 148, height: 148,
      borderRadius: '50%',
      background: dash,
      padding: 6,
      boxShadow: '0 0 35px rgba(54, 214, 160, 0.25)',
      flexShrink: 0,
    }}>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: '50%',
        background: '#0B1D17',
        border: '1px solid rgba(130, 210, 175, 0.20)',
        display: 'grid', placeItems: 'center',
        textAlign: 'center',
      }}>
        <div>
          <div ref={numRef} style={{
            font: "700 32px 'Space Grotesk'",
            lineHeight: 1,
            color: '#F4F8F5',
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
        background: 'rgba(54, 214, 160, 0.12)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 99,
          background: 'linear-gradient(90deg, #1DB87A, #36D6A0)',
          boxShadow: '0 0 14px rgba(54, 214, 160, 0.4)',
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
      background: '#10271F',
      border: '1px solid rgba(130, 210, 175, 0.16)',
    }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ font: "600 14px 'Space Grotesk'", color: '#F4F8F5' }}>{value}</div>
    </div>
  )
}

function SignalCard({ score }) {
  const signal = getSignalClassification(score)

  const StatusIcon = signal.status === 'STRONG'
    ? FiCheckCircle
    : signal.status === 'MEDIUM'
      ? FiAlertTriangle
      : FiAlertCircle

  return (
    <div
      style={{
        marginTop: 18,
        padding: '16px 20px',
        borderRadius: 14,
        background: signal.bg,
        border: `1px solid ${signal.border}`,
        boxShadow: signal.glow,
        transition: 'all .25s ease',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            display: 'grid',
            placeItems: 'center',
            background: `${signal.color}22`,
            color: signal.color,
            fontSize: 20,
            boxShadow: `0 0 14px ${signal.color}35`,
            flexShrink: 0,
          }}>
            <StatusIcon />
          </div>
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}>
              SIGNAL Evaluation
            </div>
            <div style={{
              font: "700 clamp(16px, 2.5vw, 19px) 'Space Grotesk'",
              color: signal.color,
              letterSpacing: '-0.3px',
            }}>
              {signal.label}
            </div>
          </div>
        </div>

        <span style={{
          fontSize: 11,
          fontWeight: 700,
          padding: '5px 12px',
          borderRadius: 999,
          background: `${signal.color}15`,
          border: `1px solid ${signal.border}`,
          color: signal.color,
          letterSpacing: '0.4px',
        }}>
          {signal.tag}
        </span>
      </div>

      <p style={{
        margin: '0 0 12px',
        fontSize: 13.5,
        lineHeight: 1.65,
        color: '#F4F8F5',
      }}>
        {signal.description}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 7,
        fontSize: 11,
        color: 'var(--muted)',
        paddingTop: 10,
        borderTop: '1px solid rgba(130, 210, 175, 0.12)',
        lineHeight: 1.5,
      }}>
        <FiInfo size={14} style={{ color: signal.color, marginTop: 1, flexShrink: 0 }} />
        <span>
          Preliminary educational indicator based on predicted score thresholds (&lt;5.0 Weak, 5.0–6.99 Medium, &ge;7.0 Strong). Not a clinical or psychiatric diagnosis.
        </span>
      </div>
    </div>
  )
}

export default function PredictionResult({ score, formData, timestamp, onReset, onNavigate }) {
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
      padding: '10px clamp(12px, 4vw, 5%) 60px',
      maxWidth: 1300,
      margin: '0 auto',
      position: 'relative',
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Dedicated Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <div className="editorial-badge" style={{ marginBottom: 12 }}>
            <LuSparkles size={14} /> ML Model Results
          </div>
          <h2 style={{
            font: "700 clamp(24px,3.2vw,38px)/1.2 'Space Grotesk'",
            letterSpacing: '-1.2px',
            color: '#F4F8F5',
          }}>
            Predicted Wellbeing Score and <span className="gradient-text">Assessment Summary</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: 10, fontSize: 15, maxWidth: 580, margin: '10px auto 0' }}>
            Direct prediction from the trained Random Forest Regression model evaluated on your submitted digital habits and lifestyle factors.
          </p>
        </div>

        <div className="prediction-grid" style={{
          maxWidth: 1040,
          margin: '0 auto',
        }}>
          {/* Main result studio card */}
          <div className="glass-bright" style={{
            padding: 'clamp(18px, 4vw, 32px)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 16,
            border: '1px solid rgba(130, 210, 175, 0.28)',
            animation: 'fadeSlideUp .4s ease both',
          }}>
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
                background: 'rgba(54, 214, 160, 0.08)',
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid rgba(130, 210, 175, 0.18)',
              }}>
                <FiCalendar size={12} style={{ color: 'var(--mint)' }} />
                <span>{completionDate}</span>
              </div>
            </div>

            <h3 style={{
              font: "700 clamp(20px, 3vw, 24px) 'Space Grotesk'",
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
              This score was generated by a trained Random Forest regression model on student lifestyle telemetry. In the dataset, mental health scores range from <strong>3.6 to 9.4</strong> with an average of <strong>6.23</strong> on a 1.0 to 10.0 scale.
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
              <div style={{ flex: 1, minWidth: 'min(100%, 200px)' }}>
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

                {/* SIGNAL Evaluation Display directly below Model Evaluation */}
                <SignalCard score={numericScore} />

                <p style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  lineHeight: 1.65,
                  marginTop: 14,
                }}>
                  Higher values indicate positive equilibrium across sleep, physical activity, and moderate screen time. Lower values correlate with high unlock counts, sleep deficit, and elevated academic stress.
                </p>
              </div>
            </div>

            {/* Quick stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))',
              gap: 12,
              marginBottom: 26,
            }}>
              <StatChip label="Primary Platform" value={formData.most_used_platform} />
              <StatChip label="Usage Time" value={`${formData.avg_daily_usage_hours} hrs/day`} />
              <StatChip label="Study Schedule" value={`${formData.study_hours} hrs/day`} />
              <StatChip label="Reported Stress" value={formData.stress_level} />
            </div>

            {/* Actions including Download Assessment Report (PDF) & View Dashboard */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                className="btn-primary"
                onClick={handleDownload}
                style={{
                  fontSize: 14,
                  padding: '13px 22px',
                  boxShadow: '0 4px 20px rgba(54, 214, 160, 0.35)',
                }}
              >
                <FiDownload size={16} /> Download Assessment Report (PDF)
              </button>

              {onNavigate && (
                <button
                  className="btn-secondary"
                  onClick={() => onNavigate('/dashboard')}
                >
                  <FiActivity size={14} /> View Dashboard
                </button>
              )}

              <button className="btn-secondary" onClick={handleCopy}>
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                {copied ? 'Score Copied' : 'Copy Score'}
              </button>

              <button className="btn-secondary" onClick={onReset}>
                <FiRefreshCw size={14} /> Take Another Assessment
              </button>
            </div>
          </div>

          {/* Assessment summary sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="glass" style={{
              padding: 'clamp(16px, 3.5vw, 24px)',
              borderRadius: 14,
              border: '1px solid rgba(130, 210, 175, 0.16)',
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
                  borderBottom: '1px solid rgba(130, 210, 175, 0.08)',
                  fontSize: 12,
                }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#F4F8F5' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Medical disclaimer note */}
            <div style={{
              padding: '16px 18px',
              borderRadius: 14,
              border: '1px solid rgba(130, 210, 175, 0.20)',
              background: '#0B1D17',
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
                Student Wellbeing Support Tool – Not a Medical Diagnosis
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
