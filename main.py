import joblib
import pandas as pd
from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Literal, Optional
from fastapi.middleware.cors import CORSMiddleware
import os
import database as db

model = joblib.load('Mental_Health_Model.pkl')
top_countries = ['Other','India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'Mexico', 'Turkey', 'France']

app = FastAPI(title="MindSpace API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pydantic Models ────────────────────────────────────────────────────────────

class StudentData(BaseModel):
    age                     : int   = Field(..., ge=10, le=100)
    gender                  : Literal['Male', 'Female']
    country                 : str
    academic_level          : Literal['Undergraduate', 'Graduate', 'High School']
    most_used_platform      : Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter',
                                      'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte',
                                      'WhatsApp', 'WeChat']
    purpose_of_use          : Literal['Networking', 'Education', 'Entertainment', 'News']
    avg_daily_usage_hours   : float = Field(..., ge=0, le=24)
    daily_unlocks           : int   = Field(..., ge=0)
    study_hours             : float = Field(..., ge=0, le=24)
    physical_activity_hours : float = Field(..., ge=0, le=24)
    sleep_hours_per_night   : float = Field(..., ge=0, le=24)
    stress_level            : Literal['Medium', 'Low', 'Very High', 'High']


class PredictionResponse(BaseModel):
    predicted_mental_health_score: float


# ── Auth Pydantic Models ───────────────────────────────────────────────────────

class SignUpRequest(BaseModel):
    student_name   : str
    student_age    : int
    college_name   : str
    academic_class : str
    phone_number   : str
    email          : str
    password       : str


class SignInRequest(BaseModel):
    email       : str
    password    : str
    remember_me : Optional[bool] = False


class ProfileUpdateRequest(BaseModel):
    student_name   : str
    student_age    : int
    college_name   : str
    academic_class : str
    phone_number   : str


class ForgotPasswordRequest(BaseModel):
    email       : str


class ResetPasswordRequest(BaseModel):
    token       : str
    new_password: str


# ── Auth Helper Functions ──────────────────────────────────────────────────────

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ", 1)[1].strip()
    return db.get_user_by_token(token)


def require_current_user(request: Request):
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required. Please sign in.")
    return user


# ── Auth Endpoints ─────────────────────────────────────────────────────────────

@app.post('/auth/signup')
def signup(data: SignUpRequest):
    try:
        user = db.create_user(
            student_name=data.student_name,
            student_age=data.student_age,
            college_name=data.college_name,
            academic_class=data.academic_class,
            phone_number=data.phone_number,
            email=data.email,
            password=data.password
        )
        token = db.create_session(user['id'], days_valid=30)
        return {
            "token": token,
            "user": user,
            "message": "Account created successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post('/auth/signin')
def signin(data: SignInRequest):
    user = db.authenticate_user(data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email address or password.")

    days = 60 if data.remember_me else 14
    token = db.create_session(user['id'], days_valid=days)
    user_info = db.get_user_by_id(user['id'])

    return {
        "token": token,
        "user": user_info,
        "message": "Signed in successfully"
    }


@app.get('/auth/profile')
def get_profile(request: Request):
    user = require_current_user(request)
    activity = db.get_user_wellbeing_activity(user['id'])
    return {
        "user": user,
        "activity": activity
    }


@app.put('/auth/profile')
def update_profile(data: ProfileUpdateRequest, request: Request):
    user = require_current_user(request)
    try:
        updated = db.update_profile(
            user_id=user['id'],
            student_name=data.student_name,
            student_age=data.student_age,
            college_name=data.college_name,
            academic_class=data.academic_class,
            phone_number=data.phone_number
        )
        activity = db.get_user_wellbeing_activity(user['id'])
        return {
            "user": updated,
            "activity": activity,
            "message": "Profile updated successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post('/auth/logout')
def logout(request: Request):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        db.revoke_token(token)
    return {"message": "Signed out successfully"}


@app.post('/auth/forgot-password')
def forgot_password(data: ForgotPasswordRequest):
    token = db.create_password_reset(data.email)
    if not token:
        # Avoid user enumeration in production; for safety acknowledge receipt
        return {
            "message": "If an account exists with this email, password reset instructions have been generated.",
            "reset_token": None,
            "note": "Production requires an SMTP service (e.g. Amazon SES, SendGrid) to deliver emails."
        }

    return {
        "message": "Password reset token generated successfully.",
        "reset_token": token,
        "note": "Development Mode: Token provided directly. In production, configure SMTP credentials to send via email."
    }


@app.post('/auth/reset-password')
def reset_password(data: ResetPasswordRequest):
    try:
        db.reset_password_with_token(data.token, data.new_password)
        return {"message": "Password has been successfully updated. Please sign in with your new password."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Core & Prediction Routes ───────────────────────────────────────────────────

@app.get('/api/health')
def health():
    return {'status': 'ok', 'model': 'Mental_Health_Model.pkl'}


@app.get('/')
def root_endpoint(request: Request):
    accept = request.headers.get("accept", "")
    index = os.path.join(STATIC_DIR, "index.html")
    if "application/json" in accept and "text/html" not in accept:
        return {'message': 'Welcome to MindSpace API – visit /docs for the API reference.'}
    if os.path.isfile(index):
        return FileResponse(index, media_type="text/html")
    return {'message': 'Welcome to MindSpace API – visit /docs for the API reference.'}


@app.post('/predict', response_model=PredictionResponse)
def predict(data: StudentData, request: Request):
    country_group = data.country if data.country in top_countries else "Other"
    input_row = pd.DataFrame([{
        'Age':                    data.age,
        'Gender':                 data.gender,
        'Country':                data.country,
        'Academic_Level':         data.academic_level,
        'Most_Used_Platform':     data.most_used_platform,
        'Purpose_Of_Use':         data.purpose_of_use,
        'Avg_Daily_Usage_Hours':  data.avg_daily_usage_hours,
        'Daily_Unlocks':          data.daily_unlocks,
        'Study_Hours':            data.study_hours,
        'Physical_Activity_Hours':data.physical_activity_hours,
        'Sleep_Hours_Per_Night':  data.sleep_hours_per_night,
        'Stress_Level':           data.stress_level,
        'Grouped_country':        country_group,
    }])

    prediction = model.predict(input_row)[0]
    score = round(float(prediction), 2)

    # If the student is authenticated, record their prediction into their private history
    user = get_current_user(request)
    if user:
        db.save_assessment(user['id'], data.dict(), score)

    return PredictionResponse(predicted_mental_health_score=score)


# ── Serve React Frontend ───────────────────────────────────────────────────────
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/favicon.svg", include_in_schema=False)
    def favicon():
        return FileResponse(os.path.join(STATIC_DIR, "favicon.svg"))

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa(full_path: str):
        index = os.path.join(STATIC_DIR, "index.html")
        if os.path.isfile(index):
            return FileResponse(index, media_type="text/html")
        return {"error": "Frontend not built. Run: cd frontend2 && npm run build"}
