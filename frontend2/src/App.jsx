import { useState, useRef, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import HomeFeatures from './components/HomeFeatures.jsx'
import About from './components/About.jsx'
import AssessmentForm from './components/AssessmentForm.jsx'
import PredictionResult from './components/PredictionResult.jsx'
import InsightsDashboard from './components/InsightsDashboard.jsx'
import WellnessTips from './components/WellnessTips.jsx'
import Footer from './components/Footer.jsx'
import SignIn from './components/SignIn.jsx'
import SignUp from './components/SignUp.jsx'
import StudentProfile from './components/StudentProfile.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import API_URL from './apiConfig.js'

const API_BASE = API_URL

function getRouteFromPath(pathname) {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/'
  if (clean === '/about') return 'about'
  if (clean === '/signin' || clean === '/login') return 'signin'
  if (clean === '/signup' || clean === '/register') return 'signup'
  if (clean === '/dashboard' || clean === '/profile') return 'dashboard'
  if (clean === '/forgot-password') return 'forgot-password'
  return 'home'
}

export default function App() {
  // ── Authentication State ───────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mindspace_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [authToken, setAuthToken] = useState(() => {
    try {
      return localStorage.getItem('mindspace_auth_token') || null
    } catch {
      return null
    }
  })

  // ── View Routing State ─────────────────────────────────────────────────────
  // 'home' | 'about' | 'signin' | 'signup' | 'dashboard' | 'forgot-password'
  const [activeView, setActiveView] = useState(() => getRouteFromPath(window.location.pathname))
  const [authNotice, setAuthNotice] = useState(null)
  const [prefilledEmail, setPrefilledEmail] = useState('')

  // ── Prediction State ───────────────────────────────────────────────────────
  const [prediction, setPrediction] = useState(null)   // { score, formData, timestamp }
  const [loading,    setLoading]    = useState(false)
  const [apiError,   setApiError]   = useState(null)

  // ── Section Refs for in-page anchors ───────────────────────────────────────
  const homeRef     = useRef(null)
  const featuresRef = useRef(null)
  const assessRef   = useRef(null)
  const resultRef   = useRef(null)
  const insightsRef = useRef(null)
  const aboutRef    = useRef(null)

  const scrollTo = (ref) => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Validate session with backend on initial load ──────────────────────────
  useEffect(() => {
    if (!authToken) return
    let isMounted = true

    fetch(`${API_BASE}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Session expired')
        return res.json()
      })
      .then(data => {
        if (isMounted && data.user) {
          setCurrentUser(data.user)
          localStorage.setItem('mindspace_user', JSON.stringify(data.user))
        }
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem('mindspace_auth_token')
          localStorage.removeItem('mindspace_user')
          setCurrentUser(null)
          setAuthToken(null)
        }
      })

    return () => { isMounted = false }
  }, [authToken])

  // ── Sync with browser history (back/forward buttons) ───────────────────────
  useEffect(() => {
    const onPopState = () => {
      const route = getRouteFromPath(window.location.pathname)
      if (route === 'dashboard' && !currentUser) {
        setActiveView('signin')
        setAuthNotice('Please sign in to access your student dashboard.')
      } else {
        setActiveView(route)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [currentUser])

  // ── Handle initial hash anchors on load ────────────────────────────────────
  useEffect(() => {
    if (window.location.hash === '#assess') {
      setTimeout(() => assessRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    } else if (window.location.hash === '#insights') {
      setTimeout(() => insightsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    }
  }, [])

  // ── Universal Navigation Handler ───────────────────────────────────────────
  const handleNavigate = (target, extraState = {}) => {
    setAuthNotice(null)
    if (extraState?.registeredEmail) {
      setPrefilledEmail(extraState.registeredEmail)
    }

    let view = target
    let hash = ''

    if (target === '/' || target === 'home') {
      view = 'home'
    } else if (target === '/about' || target === 'about') {
      view = 'about'
    } else if (target === '/signin' || target === 'signin') {
      view = 'signin'
    } else if (target === '/signup' || target === '/register' || target === 'signup' || target === 'register') {
      view = 'signup'
    } else if (target === '/dashboard' || target === '/profile' || target === 'dashboard' || target === 'profile') {
      view = 'dashboard'
    } else if (target === '/forgot-password' || target === 'forgot-password') {
      view = 'forgot-password'
    } else if (target === 'assess' || target === '/#assess') {
      view = 'home'
      hash = '#assess'
    } else if (target === 'insights' || target === '/#insights') {
      view = 'home'
      hash = '#insights'
    }

    // Protection check for dashboard
    if (view === 'dashboard' && !currentUser) {
      setAuthNotice('Please sign in to access your student dashboard.')
      view = 'signin'
    }

    // Synchronize browser address bar with pushState
    let url = '/'
    if (view === 'about') url = '/about'
    else if (view === 'signin') url = '/signin'
    else if (view === 'signup') url = '/signup'
    else if (view === 'dashboard') url = '/dashboard'
    else if (view === 'forgot-password') url = '/forgot-password'
    if (hash) url += hash

    if (window.location.pathname + window.location.hash !== url) {
      window.history.pushState({}, '', url)
    }

    setActiveView(view)

    // Handle scroll positions
    if (hash === '#assess') {
      setTimeout(() => assessRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } else if (hash === '#insights') {
      setTimeout(() => insightsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ── Auth Success Handler (Sign In / Sign Up) ───────────────────────────────
  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user)
    setAuthToken(token)
    setAuthNotice(null)
  }

  // ── Sign Out Handler ───────────────────────────────────────────────────────
  const handleSignOut = async () => {
    try {
      if (authToken) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
        }).catch(() => {})
      }
    } finally {
      localStorage.removeItem('mindspace_auth_token')
      localStorage.removeItem('mindspace_user')
      setCurrentUser(null)
      setAuthToken(null)
      handleNavigate('/')
    }
  }

  // ── ML Prediction Handler ──────────────────────────────────────────────────
  const handlePredict = async (formData) => {
    setLoading(true)
    setApiError(null)

    // Build payload with validated types matching FastAPI StudentData schema
    const payload = {
      age:                     parseInt(formData.age, 10),
      gender:                  formData.gender,
      country:                 formData.country,
      academic_level:          formData.academic_level,
      most_used_platform:      formData.most_used_platform,
      purpose_of_use:          formData.purpose_of_use,
      avg_daily_usage_hours:   parseFloat(formData.avg_daily_usage_hours),
      daily_unlocks:           parseInt(formData.daily_unlocks, 10),
      study_hours:             parseFloat(formData.study_hours),
      physical_activity_hours: parseFloat(formData.physical_activity_hours),
      sleep_hours_per_night:   parseFloat(formData.sleep_hours_per_night),
      stress_level:            formData.stress_level,
    }

    try {
      const headers = { 'Content-Type': 'application/json' }
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const res = await fetch(`${API_BASE}/predict`, {
        method:  'POST',
        headers,
        body:    JSON.stringify(payload),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        const detail  = errBody?.detail
        if (Array.isArray(detail)) {
          throw new Error(detail.map(d => `${d.loc?.slice(-1)[0] || 'field'}: ${d.msg}`).join(' | '))
        }
        throw new Error(errBody?.message || `Server error (HTTP ${res.status})`)
      }

      const json = await res.json()
      const timestamp = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })

      setPrediction({
        score: json.predicted_mental_health_score,
        formData,
        timestamp,
      })

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    } catch (err) {
      if (err.name === 'TypeError') {
        setApiError('Unable to connect to the MindSpace API. If the server was sleeping, please wait a moment for the instance to awaken and click Predict again.')
      } else {
        setApiError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPrediction(null)
    setApiError(null)
    setTimeout(() => assessRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navigation Bar */}
      <Navbar
        onNavigate={handleNavigate}
        currentUser={currentUser}
        activeView={activeView}
        onSignOut={handleSignOut}
      />

      {/* Auth notice banner when an unauthenticated student attempts to access a protected action */}
      {authNotice && (activeView === 'signin' || activeView === 'signup') && (
        <div style={{
          background: '#10271F',
          borderBottom: '1px solid rgba(130, 210, 175, 0.25)',
          padding: '10px 5%',
          textAlign: 'center',
          fontSize: 13,
          color: '#65E6BB',
          position: 'sticky',
          top: 70,
          zIndex: 990,
          backdropFilter: 'blur(16px)',
        }}>
          {authNotice}
        </div>
      )}

      {/* ── View Router ────────────────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        {activeView === 'signin' && (
          <SignIn
            onNavigate={handleNavigate}
            onAuthSuccess={handleAuthSuccess}
            initialEmail={prefilledEmail}
          />
        )}

        {activeView === 'signup' && (
          <SignUp
            onNavigate={handleNavigate}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {activeView === 'about' && (
          <About
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'forgot-password' && (
          <ForgotPassword
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'dashboard' && (
          <StudentProfile
            user={currentUser}
            token={authToken}
            onSignOut={handleSignOut}
            onStartAssessment={() => handleNavigate('/#assess')}
            onUpdateUser={setCurrentUser}
          />
        )}

        {activeView === 'home' && (
          <>
            <div ref={homeRef}>
              <Hero
                onStart={() => scrollTo(assessRef)}
                onInsights={() => scrollTo(featuresRef)}
                score={prediction ? prediction.score : null}
                hasPrediction={prediction !== null && prediction !== undefined}
                onResultClick={() => scrollTo(resultRef)}
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            </div>

            <div ref={featuresRef}>
              <HomeFeatures
                onStart={() => scrollTo(assessRef)}
                onSignUp={() => handleNavigate('/signup')}
                currentUser={currentUser}
              />
            </div>

            <div id="assess" ref={assessRef} style={{ paddingTop: 20 }}>
              <AssessmentForm
                onSubmit={handlePredict}
                loading={loading}
                apiError={apiError}
              />
            </div>

            {prediction && (
              <div id="results" ref={resultRef} style={{ paddingTop: 20 }}>
                <PredictionResult
                  score={prediction.score}
                  formData={prediction.formData}
                  timestamp={prediction.timestamp}
                  onReset={handleReset}
                  onNavigate={handleNavigate}
                />
              </div>
            )}

            <div id="insights" ref={insightsRef} style={{ paddingTop: 20 }}>
              <InsightsDashboard
                formData={prediction?.formData}
                score={prediction?.score}
                onStartAssessment={() => scrollTo(assessRef)}
              />
            </div>

            <div id="recommendations" ref={aboutRef} style={{ paddingTop: 20 }}>
              <WellnessTips />
            </div>
          </>
        )}
      </main>

      {/* Global Footer with Required Credit */}
      <Footer
        onNavigate={handleNavigate}
      />
    </div>
  )
}
