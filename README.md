# 🧠 MindSpace AI – Mental Health & Wellbeing

An AI-powered mental wellbeing platform designed to support students through machine learning-based mental health prediction and personalized wellbeing insights.

## 🚀 Project Overview

MindSpace AI is a mental wellbeing application that integrates a machine learning model with a FastAPI backend to provide mental health-related predictions based on user-provided information.

The backend handles API requests, validates input data, processes user information, and generates predictions using a trained machine learning model.

## ✨ Features

- AI-powered mental health prediction.
- Machine Learning model integration.
- FastAPI REST API.
- Input validation using Pydantic.
- CORS support for React frontend integration.
- Interactive API documentation using Swagger UI.
- Cloud deployment using Render.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API development |
| Scikit-learn | Machine learning |
| Pandas | Data processing |
| NumPy | Numerical computation |
| Joblib | Model loading |
| Pydantic | Input validation |
| Uvicorn | ASGI server |
| Render | Cloud deployment |

## 📁 Project Structure

```text
Machine Learning/
│
├── main.py
├── requirements.txt
├── .python-version
├── Mental_Health_Model.pkl
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd "Machine Learning"
```

### 3. Create a Virtual Environment

```bash
python3.11 -m venv .venv
```

### 4. Activate the Virtual Environment

For macOS/Linux:

```bash
source .venv/bin/activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Run the FastAPI Application

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## 🌐 API Documentation

Once the application is running, access the following endpoints:

| Resource | URL |
|---|---|
| API Home | http://127.0.0.1:8000 |
| Swagger UI | http://127.0.0.1:8000/docs |
| ReDoc | http://127.0.0.1:8000/redoc |

Use Swagger UI to explore and test the available API endpoints.

## 🤖 Machine Learning Model

The project uses a pre-trained machine learning model stored in:

`Mental_Health_Model.pkl`

The model is loaded using Joblib and used by the FastAPI application to generate predictions.

**Important:** The deployed environment should use compatible package versions with the environment in which the model was trained.

Current model compatibility target:

- Python: 3.11.11
- Scikit-learn: 1.6.1

## ☁️ Deployment on Render

The backend is configured for deployment using Render.

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

After deployment, access the API using your Render service URL:

`https://mental-health-score-tejesh-kanta.onrender.com/`

## 🔗 Frontend Integration

The backend is designed to integrate with the MindSpace React frontend.

Configure the frontend API base URL to point to the deployed FastAPI service.

Example:

```javascript
const API_URL = "https://mental-health-score-tejesh-kanta.onrender.com/";
```

Ensure that the frontend origin is allowed in the FastAPI CORS configuration.

## 🔒 Security and Privacy

- Validate all incoming API requests.
- Avoid exposing confidential information.
- Store passwords securely using appropriate password hashing if authentication is implemented.
- Protect sensitive student information.
- Do not commit credentials, environment secrets, or private student records to GitHub.

## 🎯 Project Objective

The primary objective of MindSpace AI is to combine artificial intelligence and digital technology to promote mental wellbeing awareness and provide accessible AI-assisted mental health insights for students.

**Disclaimer:** This application is intended for educational and wellbeing-support purposes. Its predictions are not medical diagnoses and should not replace professional mental health assessment.

## 👨‍💻 Developer

**Project:** MindSpace AI – Mental Health & Wellbeing

**Backend:** Python, FastAPI and Machine Learning

**Deployment:** Render

---


