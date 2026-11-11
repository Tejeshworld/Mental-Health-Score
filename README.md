# 🧠 MindSpace AI – Mental Health & Wellbeing

<p align="center">
  <img src="https://img.shields.io/badge/AI-Mental%20Wellbeing-10B981?style=for-the-badge&logo=brain&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployment-Render-7C3AED?style=for-the-badge&logo=render&logoColor=white" />
</p>

<p align="center">
  <i>Empowering students through Artificial Intelligence and Mental Wellbeing Technology.</i>
</p>

---

## 🌱 About MindSpace

MindSpace AI is an AI-powered mental wellbeing platform designed to support students through machine learning-based mental health prediction and personalized wellbeing insights.

The platform integrates a trained machine learning model with a FastAPI backend to process user-provided information, generate predictions, and provide AI-assisted wellbeing insights.

## ✨ Key Features

- 🧠 **AI-Powered Prediction** – Machine learning-based mental health prediction.
- 🤖 **ML Model Integration** – Uses a trained machine learning model.
- ⚡ **FastAPI Backend** – Fast and efficient REST API development.
- 🛡️ **Input Validation** – Request validation using Pydantic.
- 🔗 **Frontend Integration** – CORS support for React applications.
- 📖 **API Documentation** – Interactive Swagger UI and ReDoc.
- ☁️ **Cloud Deployment** – Backend deployment using Render.

## 🛠️ Technology Stack

| Icon | Technology | Purpose |
|---|---|---|
| 🐍 | Python | Backend programming |
| ⚡ | FastAPI | REST API development |
| 🤖 | Scikit-learn | Machine learning |
| 🐼 | Pandas | Data processing |
| 🔢 | NumPy | Numerical computation |
| 📦 | Joblib | Model loading |
| 🛡️ | Pydantic | Input validation |
| 🚀 | Uvicorn | ASGI server |
| ☁️ | Render | Cloud deployment |

## 📂 Project Structure

```text
🧠 Machine Learning/
│
├── 📄 main.py
├── 📄 requirements.txt
├── 📄 .python-version
├── 🤖 Mental_Health_Model.pkl
├── 🚫 .gitignore
└── 📘 README.md
```

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2️⃣ Navigate to the Project Directory

```bash
cd "Machine Learning"
```

### 3️⃣ Create a Virtual Environment

```bash
python3.11 -m venv .venv
```

### 4️⃣ Activate the Virtual Environment

**For macOS/Linux:**

```bash
source .venv/bin/activate
```

### 5️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 6️⃣ Start the FastAPI Server

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

<details>
<summary>💡 Windows virtual environment activation</summary>

```bash
.venv\Scripts\activate
```

</details>

## 🌐 API Documentation

Once the application is running, access the following resources:

| Resource | Link |
|---|---|
| 🏠 API Home | `http://127.0.0.1:8000` |
| 📖 Swagger UI | `http://127.0.0.1:8000/docs` |
| 📚 ReDoc | `http://127.0.0.1:8000/redoc` |

Use Swagger UI to explore, understand, and test the available API endpoints.

## 🤖 Machine Learning Model

The application uses a pre-trained machine learning model stored in:

**`Mental_Health_Model.pkl`**

The model is loaded using Joblib and integrated with FastAPI to generate predictions based on user-provided information.

### ⚙️ Model Compatibility

| Component | Version |
|---|---|
| Python | 3.11.11 |
| Scikit-learn | 1.6.1 |

**Note:** Compatible library versions are important for loading previously trained machine learning models correctly.

## ☁️ Render Deployment

The backend is configured for cloud deployment using Render.

### 🔨 Build Command

```bash
pip install -r requirements.txt
```

### ▶️ Start Command

```bash
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 🌍 Live API

After successful deployment, access the API documentation using:

`https://YOUR-RENDER-SERVICE.onrender.com/docs`

## 🔗 Frontend Integration

MindSpace AI backend is designed to integrate with the React frontend.

Configure the frontend API base URL:

```javascript
const API_URL = "https://YOUR-RENDER-SERVICE.onrender.com";
```

Ensure that the frontend origin is included in the FastAPI CORS configuration.

## 🔐 Security & Privacy

- 🛡️ Validate all incoming API requests.
- 🔒 Never expose confidential information.
- 🔑 Use secure password hashing for authentication.
- 👤 Protect sensitive student information.
- 🚫 Never commit API keys, credentials, or private student records to GitHub.
- 🔏 Restrict access to confidential wellbeing data.

## 🎯 Project Objective

The primary objective of MindSpace AI is to combine Artificial Intelligence and digital technology to promote mental wellbeing awareness and provide accessible AI-assisted mental health insights for students.

Our goal is to encourage a healthier, more mindful, and supportive student community through technology.

## ⚠️ Disclaimer

This application is intended for educational and wellbeing-support purposes. Its predictions are not medical diagnoses and should not replace professional mental health assessment or treatment.

## 👨‍💻 Developer

**Project Name:** MindSpace AI – Mental Health & Wellbeing

**Backend:** Python | FastAPI | Machine Learning

**Deployment:** Render

---

<p align="center">
  🧠 <b>MindSpace AI</b>
  <br/>
  <i>Technology for a Healthier Mind and a Better Tomorrow.</i>
  <br/><br/>
  💚 Built with Innovation, Intelligence & Care.
</p>