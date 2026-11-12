import { useState } from 'react'
import {
  FiUser, FiSmartphone, FiActivity,
  FiArrowRight, FiAlertCircle, FiCheckCircle,
  FiChevronLeft, FiShield,
} from 'react-icons/fi'
import { LuBrain } from 'react-icons/lu'

/* ── Constants ──────────────────────────────────────────── */
const COUNTRIES = [
  'India','USA','Canada','Australia','UK','Germany',
  'Mexico','Turkey','France','Brazil','Japan','South Korea',
  'China','Russia','Italy','Spain','Netherlands','Sweden',
  'Singapore','UAE','Other',
]
const PLATFORMS = [
  'Instagram','YouTube','TikTok','WhatsApp','Facebook',
  'Snapchat','Twitter','LinkedIn','WeChat','LINE','KakaoTalk','VKontakte',
]
const PURPOSES  = ['Education','Entertainment','Networking','News']
const GENDERS   = ['Male','Female']
const ACADEMICS = ['Undergraduate','Graduate','High School']
const STRESSES  = ['Low','Medium','High','Very High']

const DEFAULT = {
  age: '20', gender: '', country: '', academic_level: '',
  most_used_platform: '', purpose_of_use: '',
  avg_daily_usage_hours: '4', daily_unlocks: '30',
  study_hours: '5', physical_activity_hours: '1',
  sleep_hours_per_night: '7', stress_level: '',
}

/* ── Shared input style ─────────────────────────────────── */
const BASE_INPUT = {
  width: '100%',
  border: '1px solid rgba(130, 210, 175, 0.16)',
  borderRadius: 10,
  padding: '12px 14px',
  background: '#0B1D17',
  color: '#F4F8F5',
  outline: 'none',
  transition: 'border .2s, box-shadow .2s',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontSize: 14,
  minHeight: 44,
}

const FOCUS_IN  = (e) => {
  e.target.style.borderColor = '#36D6A0'
  e.target.style.boxShadow   = '0 0 0 3px rgba(54, 214, 160, 0.12)'
}
const FOCUS_OUT = (e) => {
  e.target.style.borderColor = 'rgba(130, 210, 175, 0.16)'
  e.target.style.boxShadow   = 'none'
}

/* ── Sub-components ─────────────────────────────────────── */
function FieldLabel({ label, hint }) {
  return (
    <label style={{
      display: 'flex', justifyContent: 'space-between', gap: 8,
      fontSize: 12, fontWeight: 600, color: '#C8DBD2', marginBottom: 8,
    }}>
      <span>{label}</span>
      {hint && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>{hint}</span>}
    </label>
  )
}

function ErrMsg({ msg }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#F4756A', marginTop:5 }}>
      <FiAlertCircle size={12} /> {msg}
    </div>
  )
}

function TextField({ label, hint, name, value, min, max, onChange }) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <input
        type="number" name={name} value={value} min={min} max={max}
        onChange={onChange} placeholder={`${min} – ${max}`}
        style={BASE_INPUT} onFocus={FOCUS_IN} onBlur={FOCUS_OUT}
      />
    </div>
  )
}

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%239AAFA5' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E")`

function SelectField({ label, hint, name, value, options, onChange }) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <select
        name={name} value={value} onChange={onChange}
        style={{
          ...BASE_INPUT,
          backgroundImage: CHEVRON_SVG,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 13px center',
          backgroundSize: '17px',
          paddingRight: 38,
          cursor: 'pointer',
        }}
        onFocus={FOCUS_IN} onBlur={FOCUS_OUT}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o} style={{ background:'#0B1D17', color:'#F4F8F5' }}>{o}</option>)}
      </select>
    </div>
  )
}

function SliderField({ label, hint, name, value, min, max, step = 0.5, unit, onChange }) {
  const pct = ((+value - min) / (max - min)) * 100
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:4 }}>
        <div style={{ flex:1, position:'relative' }}>
          <input
            type="range" name={name} min={min} max={max} step={step}
            value={value} onChange={onChange}
            style={{ width:'100%', accentColor:'#36D6A0', cursor:'pointer', height:5, borderRadius:3 }}
          />
          <div style={{
            position:'absolute', top:'50%', left:0,
            transform:'translateY(-50%)',
            height:5, width:`${pct}%`, borderRadius:3,
            background:'linear-gradient(90deg, #1DB87A, #36D6A0)',
            pointerEvents:'none',
          }} />
        </div>
        <span style={{
          minWidth:54, textAlign:'center',
          padding:'5px 10px', borderRadius:8,
          background:'rgba(54, 214, 160, 0.08)',
          border:'1px solid rgba(130, 210, 175, 0.20)',
          color:'#65E6BB', fontSize:12, fontWeight:700,
        }}>
          {value}{unit}
        </span>
      </div>
    </div>
  )
}

/* ── Steps ───────────────────────────────────────────────── */
const STEPS = [
  { key:'personal',  label:'Personal Info',      Icon:FiUser },
  { key:'digital',   label:'Digital Behaviour',  Icon:FiSmartphone },
  { key:'lifestyle', label:'Lifestyle & Health', Icon:FiActivity },
]

/* ── Main component ─────────────────────────────────────── */
export default function AssessmentForm({ onSubmit, loading, apiError }) {
  const [form,   setForm]   = useState(DEFAULT)
  const [step,   setStep]   = useState(0)
  const [errors, setErrors] = useState({})

  const change = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(er => ({ ...er, [name]: null }))
  }

  const validateStep = (s) => {
    const errs = {}
    if (s === 0) {
      if (!form.age || +form.age < 10 || +form.age > 100) errs.age = 'Age must be between 10 and 100'
      if (!form.gender)         errs.gender         = 'Please select your gender'
      if (!form.country)        errs.country        = 'Please select your country'
      if (!form.academic_level) errs.academic_level = 'Please select your academic level'
    }
    if (s === 1) {
      if (!form.most_used_platform) errs.most_used_platform = 'Please select a platform'
      if (!form.purpose_of_use)     errs.purpose_of_use     = 'Please select a purpose'
      if (+form.daily_unlocks < 0)  errs.daily_unlocks      = 'Must be 0 or more'
    }
    if (s === 2) {
      if (!form.stress_level) errs.stress_level = 'Please select your stress level'
    }
    return errs
  }

  const nextStep = () => {
    const errs = validateStep(step)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep(s => s + 1)
  }

  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validateStep(2)
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit(form)
  }

  const pct = Math.round(((step + 1) / STEPS.length) * 100)

  return (
    <section className="bg-study" style={{ padding:'20px clamp(12px, 4vw, 5%) 70px', maxWidth:1300, margin:'0 auto', position:'relative' }}>

      {/* Grid overlay */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`
          linear-gradient(rgba(54, 214, 160, .02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(54, 214, 160, .02) 1px, transparent 1px)
        `,
        backgroundSize:'40px 40px',
      }} />

      <div style={{ position:'relative', zIndex:1 }}>

        {/* Section header */}
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div className="section-eyebrow" style={{ justifyContent:'center', marginBottom:14 }}>
            <LuBrain size={13} /> Student Assessment
          </div>
          <h2 style={{ font:"700 clamp(26px,3.5vw,44px)/1.1 'Space Grotesk'", letterSpacing:'-1.5px' }}>
            Tell Us About <span className="gradient-text">Your Lifestyle</span>
          </h2>
          <p style={{ color:'var(--muted)', marginTop:12, fontSize:15, maxWidth:520, margin:'12px auto 0' }}>
            Complete all three steps to receive your personalised AI wellbeing score.
          </p>
        </div>

        {/* Step indicators - Desktop */}
        <div className="stepper-desktop" style={{ maxWidth:680, margin:'0 auto 32px', alignItems:'center', gap:8 }}>
          {STEPS.map(({ key, label, Icon }, i) => (
            <div key={key} style={{ display:'flex', alignItems:'center', gap:8, flex: i < 2 ? 1 : 'none' }}>
              <div style={{
                width:36, height:36, borderRadius:'50%', flexShrink:0,
                display:'grid', placeItems:'center', fontSize:16,
                background: i < step
                  ? 'linear-gradient(135deg, #28A77B, #36D6A0)'
                  : i === step ? 'rgba(54, 214, 160, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                color: i < step ? '#050B09' : i === step ? '#36D6A0' : 'var(--muted)',
                border: i === step ? '2px solid #36D6A0' : i < step ? '2px solid transparent' : '1px solid rgba(130, 210, 175, 0.15)',
                boxShadow: i === step ? '0 0 16px rgba(54, 214, 160, 0.25)' : 'none',
                transition:'all .3s',
              }}>
                {i < step ? <FiCheckCircle size={17} /> : <Icon size={16} />}
              </div>
              <span style={{ fontSize:12, fontWeight:i===step?700:400, color:i===step?'var(--text)':'var(--muted)', whiteSpace:'nowrap' }}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex:1, height:2, borderRadius:2, minWidth:20,
                  background: i < step ? 'linear-gradient(90deg, #28A77B, #36D6A0)' : 'rgba(130, 210, 175, 0.12)',
                  transition:'background .4s',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step indicators - Mobile */}
        <div className="stepper-mobile" style={{
          maxWidth: 460, margin: '0 auto 24px', flexDirection: 'column', gap: 10,
          background: '#0B1D17', border: '1px solid rgba(130, 210, 175, 0.13)',
          borderRadius: 14, padding: '12px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F4F8F5', display: 'flex', alignItems: 'center', gap: 6 }}>
              {(() => {
                const ActiveIcon = STEPS[step].Icon
                return <ActiveIcon size={15} style={{ color: '#36D6A0' }} />
              })()}
              Step {step + 1} of {STEPS.length}: {STEPS[step].label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#36D6A0' }}>{pct}%</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {STEPS.map((s, idx) => (
              <div
                key={s.key}
                style={{
                  flex: 1, height: 6, borderRadius: 99,
                  background: idx <= step ? 'linear-gradient(90deg, #28A77B, #36D6A0)' : 'rgba(130, 210, 175, 0.12)',
                  transition: 'background .3s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Form glass card */}
        <div className="glass-bright" style={{ maxWidth:860, margin:'0 auto', overflow:'hidden' }}>

          {/* Card header */}
          <div style={{
            padding:'20px 28px 16px',
            borderBottom:'1px solid rgba(130, 210, 175, 0.13)',
            display:'flex', justifyContent:'space-between', alignItems:'center',
            background:'rgba(54, 214, 160, 0.03)',
          }}>
            <div>
              <h3 style={{ font:"600 17px 'Space Grotesk'", color:'var(--text)', margin:0 }}>
                {STEPS[step].label}
              </h3>
              <p style={{ margin:'4px 0 0', color:'var(--muted)', fontSize:12 }}>
                Step {step + 1} of {STEPS.length}
              </p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:80, height:5, borderRadius:99, background:'rgba(130, 210, 175, 0.10)', overflow:'hidden' }}>
                <div style={{
                  height:'100%', width:`${pct}%`,
                  background:'linear-gradient(90deg, #28A77B, #36D6A0)',
                  borderRadius:99, transition:'width .4s ease',
                }} />
              </div>
              <span style={{
                padding:'5px 11px', borderRadius:99,
                background:'rgba(54, 214, 160, 0.10)',
                border:'1px solid rgba(54, 214, 160, 0.22)',
                color:'#36D6A0', fontSize:11, fontWeight:700,
              }}>{pct}%</span>
            </div>
          </div>

          {/* Fields */}
          <form onSubmit={handleSubmit}>
            <div style={{ padding:'clamp(16px, 4vw, 28px) clamp(16px, 4vw, 28px) 12px' }}>

              {/* Step 0 – Personal Info */}
              {step === 0 && (
                <div style={{ animation:'fadeSlideUp .3s ease both' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%, 200px), 1fr))', gap:'20px 22px' }}>
                    <div>
                      <TextField label="Age" hint="10 – 100" name="age" value={form.age} min={10} max={100} onChange={change} />
                      {errors.age && <ErrMsg msg={errors.age} />}
                    </div>
                    <div>
                      <SelectField label="Gender" hint="Required" name="gender" value={form.gender} options={GENDERS} onChange={change} />
                      {errors.gender && <ErrMsg msg={errors.gender} />}
                    </div>
                    <div>
                      <SelectField label="Country" hint="Your location" name="country" value={form.country} options={COUNTRIES} onChange={change} />
                      {errors.country && <ErrMsg msg={errors.country} />}
                    </div>
                    <div>
                      <SelectField label="Academic Level" hint="Current level" name="academic_level" value={form.academic_level} options={ACADEMICS} onChange={change} />
                      {errors.academic_level && <ErrMsg msg={errors.academic_level} />}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 – Digital Behaviour */}
              {step === 1 && (
                <div style={{ animation:'fadeSlideUp .3s ease both' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%, 200px), 1fr))', gap:'20px 22px', marginBottom:24 }}>
                    <div>
                      <SelectField label="Most Used Platform" hint="Primary social app" name="most_used_platform" value={form.most_used_platform} options={PLATFORMS} onChange={change} />
                      {errors.most_used_platform && <ErrMsg msg={errors.most_used_platform} />}
                    </div>
                    <div>
                      <SelectField label="Purpose of Use" hint="Main reason" name="purpose_of_use" value={form.purpose_of_use} options={PURPOSES} onChange={change} />
                      {errors.purpose_of_use && <ErrMsg msg={errors.purpose_of_use} />}
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%, 240px), 1fr))', gap:'20px 24px' }}>
                    <div>
                      <SliderField label="Avg Daily Usage Hours" hint="Social media time" name="avg_daily_usage_hours" value={form.avg_daily_usage_hours} min={0} max={12} step={0.5} unit="h" onChange={change} />
                    </div>
                    <div>
                      <FieldLabel label="Daily Unlocks" hint="Times phone is opened" />
                      <input
                        type="number" name="daily_unlocks" value={form.daily_unlocks}
                        min={0} max={500} onChange={change} placeholder="0 – 500"
                        style={BASE_INPUT} onFocus={FOCUS_IN} onBlur={FOCUS_OUT}
                      />
                      {errors.daily_unlocks && <ErrMsg msg={errors.daily_unlocks} />}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 – Lifestyle */}
              {step === 2 && (
                <div style={{ animation:'fadeSlideUp .3s ease both' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%, 240px), 1fr))', gap:'20px 24px' }}>
                    <div>
                      <SliderField label="Study Hours Per Day" hint="Academic study time" name="study_hours" value={form.study_hours} min={0} max={16} step={0.5} unit="h" onChange={change} />
                    </div>
                    <div>
                      <SliderField label="Physical Activity" hint="Exercise / sports" name="physical_activity_hours" value={form.physical_activity_hours} min={0} max={8} step={0.5} unit="h" onChange={change} />
                    </div>
                    <div>
                      <SliderField label="Sleep Hours Per Night" hint="Average nightly sleep" name="sleep_hours_per_night" value={form.sleep_hours_per_night} min={0} max={12} step={0.5} unit="h" onChange={change} />
                    </div>
                    <div>
                      <SelectField label="Stress Level" hint="Current perceived stress" name="stress_level" value={form.stress_level} options={STRESSES} onChange={change} />
                      {errors.stress_level && <ErrMsg msg={errors.stress_level} />}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div style={{
                margin:'0 clamp(16px, 4vw, 28px) 12px', padding:'13px 16px', borderRadius:12,
                background:'rgba(244,117,106,.08)', border:'1px solid rgba(244,117,106,.35)',
                color:'#F4A49E', fontSize:13, display:'flex', alignItems:'flex-start', gap:9,
              }}>
                <FiAlertCircle style={{ marginTop:2, flexShrink:0 }} size={16} />
                <div>
                  <strong>Connection Error</strong><br />
                  {apiError}
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{
              padding:'16px clamp(16px, 4vw, 28px) 24px',
              borderTop:'1px solid rgba(130, 210, 175, 0.10)',
            }}>
              <div className="assessment-nav-group" style={{
                justifyContent: step > 0 ? 'space-between' : 'flex-end',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                {step > 0 && (
                  <button type="button" className="btn-secondary" onClick={prevStep}>
                    <FiChevronLeft size={15} /> Back
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button type="button" className="btn-primary" onClick={nextStep}>
                    Continue <FiArrowRight />
                  </button>
                ) : (
                  <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth:210 }}>
                    {loading
                      ? <><span className="spinner-sm" /> Analysing your data…</>
                      : <><LuBrain size={16} /> Predict My Wellbeing</>
                    }
                  </button>
                )}
              </div>
            </div>

            {step === STEPS.length - 1 && (
              <p style={{
                textAlign:'center', fontSize:11, color:'#70877D', paddingBottom:18,
                display:'flex', alignItems:'center', justifyContent:'center', gap:5,
              }}>
                <FiShield size={11} style={{ color:'#36D6A0' }} />
                Your data is processed securely and protected in accordance with student privacy standards.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
