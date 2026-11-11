MINDSPACE – AI-Powered Student Mental Wellbeing Dashboard
==========================================================
Theme: Emerald Green & Mint Glassmorphism (Campus Wellbeing Edition)
Author Credit: Designed & Developed by TEJESH K

QUICK START
-----------
1. Install Python dependencies (in your terminal/virtualenv):
   pip install fastapi uvicorn pandas joblib scikit-learn

2. Make sure your trained model file is in this folder:
   Mental_Health_Model.pkl

3. Start the FastAPI server:
   uvicorn main:app --reload --host 127.0.0.1 --port 8000

4. Open your browser:
   http://127.0.0.1:8000

FastAPI automatically serves the built React frontend at http://127.0.0.1:8000.
All API endpoints (GET /, POST /predict, GET /api/health, GET /docs) remain
fully functional and intact.

──────────────────────────────────────────────────────────────
AUTHENTICATION SYSTEM (NEW)
──────────────────────────────────────────────────────────────
- Persistent SQLite Database (`mindspace.db`):
  * Tables: `users`, `tokens` (active sessions), `assessments`, `password_resets`.
  * Secure PBKDF2-HMAC-SHA256 password hashing with 100,000 iterations & random salts.
  * Password hashes are NEVER returned to the client.

- Authentication API Endpoints:
  * POST /auth/signup        → Register new student account
  * POST /auth/signin        → Authenticate student and issue token
  * GET  /auth/profile       → Fetch authenticated student profile & wellbeing activity
  * PUT  /auth/profile       → Update Full Name, Student ID, and College
  * POST /auth/logout        → Revoke active session token
  * POST /auth/forgot-password → Safe token-based password recovery
  * POST /auth/reset-password  → Save new password with verified reset token

- Frontend Auth Pages & Flow:
  * Sign Up Page:
    - Full Name, Email, Student ID (optional), College (optional), Password, Confirm Password.
    - Show/hide password toggles, real-time password strength meter.
    - Direct link to Sign In.
  * Sign In Page:
    - Email, Password, Show/Hide password toggle.
    - Remember Me option.
    - Forgot Password recovery link.
    - Direct link to Sign Up.
  * Student Profile Page:
    - Initials avatar badge, Full Name, Email (read-only), Student ID, College, Joined Date.
    - "Edit Profile" mode to update Name, Student ID, and College with live backend sync.
    - "My Wellbeing Activity" section:
      * Completed assessments count.
      * Latest assessment date and latest predicted score.
      * Full assessment history table with real records from SQLite database.
    - Prominent Sign Out button.
  * Forgot Password Flow:
    - Token generation with clear explanation of production SMTP requirements.
    - Token verification and new password creation.

- Protected Routing:
  * Unauthenticated students are guided to sign in when accessing protected sections.
  * Authenticated students have seamless access to Assessment, Insights, and Profile.
  * Assessment submissions by logged-in students are automatically linked to their
    private history in the database.

──────────────────────────────────────────────────────────────
WELLBEING SCORE & PDF ASSESSMENT REPORT
──────────────────────────────────────────────────────────────
- Live Wellbeing Score Display:
  * Wellbeing Score card updates immediately upon prediction with the
    actual ML model output (scale 1.0 – 10.0).
  * Placeholder "--" is replaced dynamically with the predicted score.
  * Verified model scale: 1.0 to 10.0 based on the training dataset
    (5,000 student records, observed range 3.6 to 9.4, mean 6.23).

- Dedicated Results Section:
  * Heading: "Predicted Mental Health Score and Assessment Summary"
  * Large, readable score display with calibrated circular progress ring.
  * Horizontal score bar with 1.0 (Lower) to 10.0 (Higher) range.
  * Assessment completion date & time timestamp.
  * Clear clinical note: ML estimate, not a medical diagnosis.

- Download Assessment Report (PDF):
  * "Download Assessment Report (PDF)" button with FiDownload icon.
  * Generates and downloads "MindSpace_Assessment_Report.pdf" (ISO 32000-1 / PDF 1.4 compliant).
  * Contains all 12 submitted fields, prediction result, assessment summary, and
    6 evidence-based student suggestions.

──────────────────────────────────────────────────────────────
DESIGN & FOOTER
──────────────────────────────────────────────────────────────
- Colour Palette: Deep Forest Green (#092C24) and Dark Emerald (#104638) with Mint (#70E1B5).
- Glassmorphism: Frosted emerald panels with backdrop-filter: blur(20px).
- React Icons only (react-icons/fi, react-icons/lu, react-icons/md). Zero emojis.
- Footer Credit on every page:
  **Designed & Developed by TEJESH K**

──────────────────────────────────────────────────────────────
FRONTEND DEVELOPMENT (optional – to edit the UI)
──────────────────────────────────────────────────────────────
  cd frontend2
  npm run dev          # hot-reload dev server on port 5173

API calls are proxied to http://127.0.0.1:8000 automatically.
When you are happy with changes, rebuild for production:
  npm run build        # compiles bundle into ../static/

──────────────────────────────────────────────────────────────
PROJECT STRUCTURE
──────────────────────────────────────────────────────────────
Machine Learning/
├── main.py                        ← FastAPI backend (Auth + ML prediction + Static server)
├── database.py                    ← SQLite persistent auth & assessment history module
├── mindspace.db                   ← SQLite database file (auto-created)
├── Mental_Health_Model.pkl        ← Trained Joblib model
├── static/                        ← Production bundle served by FastAPI
│   ├── index.html
│   └── assets/
└── frontend2/                     ← React source (Vite + React 19)
    ├── vite.config.js             ← Vite proxy & build config
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx                ← State, view routing, auth session, prediction
        ├── index.css              ← Emerald green glassmorphism tokens & animations
        ├── utils/
        │   └── generatePdfReport.js ← Professional PDF report generator
        └── components/
            ├── Navbar.jsx         ← Adaptive navigation, auth state badges, mobile drawer
            ├── Hero.jsx           ← Live Wellbeing Score card, emerald headline
            ├── AssessmentForm.jsx ← 3-step questionnaire with all 12 backend fields
            ├── PredictionResult.jsx ← Dedicated results section & Download PDF button
            ├── InsightsDashboard.jsx ← Recharts bar & radar charts + empty state
            ├── WellnessTips.jsx   ← 6 student wellness guidance cards
            ├── SignIn.jsx         ← Student sign in page
            ├── SignUp.jsx         ← Student registration page with strength meter
            ├── StudentProfile.jsx ← Dedicated profile page with editable info & history
            ├── ForgotPassword.jsx ← Safe password recovery flow
            └── Footer.jsx         ← Credit: Designed & Developed by TEJESH K

──────────────────────────────────────────────────────────────
DISCLAIMER
──────────────────────────────────────────────────────────────
MindSpace is an educational tool. The AI score is a regression
estimate and not a clinical diagnosis. Always consult a licensed
mental health professional for personal advice.
