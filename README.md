# InterviewAI — AI Interview Preparation System

**InterviewAI** is a premium, SaaS-quality mock interview preparation platform built using a **React + Vite** frontend, a **Python Flask REST API** backend, and a **SQLite** database, integrated with the **Google Gemini API**. 

Designed as a college NTCC major project, the application includes a robust, deterministic **Mock AI Fallback Engine** to allow testing all user flows (multi-question setup, grading, strengths breakdown, and daily study planning) fully offline or without an API key.

---

## 🚀 Key Features

1. **Customized Setup**: Configure target job role, experience level, difficulty (Beginner, Intermediate, Advanced), question count (5, 10, 15), and optionally paste a resume/job description to align prompts.
2. **Interactive Mock Interface**: Circular question indicators, circular timer, native **Text-to-Speech** (reads questions aloud), and **Speech-to-Text** mic dictation with animated sound wave bars.
3. **Faceted AI Scoring**: Grades answers on four critical criteria: Correctness, Relevance, Clarity, and Completeness.
4. **Detail Analysis Dashboard**: AI identifies specific strengths, weaknesses, and drafts a custom **7-day daily study roadmap**.
5. **chronological History & Analytics**: Tracks and plots score trends over time (using **Recharts** line graphs) and charts practice distributions.
6. **Robust Security Boundaries**: Implements password hashing (`werkzeug.security`) and JWT validation. Users can only access their own sessions.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite SPA), Tailwind CSS v3 (glassmorphism/custom scrollbars), Lucide Icons, Recharts, Canvas-Confetti.
- **Backend**: Python Flask, Flask-CORS, PyJWT, SQLAlchemy.
- **Database**: SQLite (scalable configuration structure).
- **AI Integration**: Google Gemini Client (`google-genai` SDK) utilizing interactions.

---

## 📂 Project Structure

```text
NTCC/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py          # Register, Login, Profile updates
│   │   │   ├── interviews.py    # Mock setup, answers submissions, complete reports
│   │   │   └── analytics.py     # Statistics and Recharts aggregations
│   │   ├── services/
│   │   │   └── ai_service.py    # Live Gemini API interactions + Mock AI Fallback
│   │   ├── config.py            # SQLite path, JWT key, AI model variables
│   │   └── models.py            # SQLAlchemy database tables
│   ├── main.py                  # Server bootstrap & CORS configuration
│   ├── test_app.py              # Automated integration tests
│   └── instance/
│       └── database.db          # Auto-generated SQLite file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Header & Theme toggles
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Hero and timeline preview
│   │   │   ├── Auth.jsx         # Sign Up / Sign In
│   │   │   ├── Dashboard.jsx    # Analytics dashboard
│   │   │   ├── InterviewSetup.jsx
│   │   │   ├── MockInterview.jsx
│   │   │   ├── InterviewResult.jsx
│   │   │   ├── PerformanceAnalytics.jsx
│   │   │   ├── InterviewHistory.jsx
│   │   │   └── ProfileSettings.jsx
│   │   ├── services/
│   │   │   └── api.js           # API request wrappers
│   │   ├── App.jsx              # Hash Router & Theme listener
│   │   ├── main.jsx
│   │   └── index.css            # Custom CSS & pulse animations
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── index.html
├── .env.example                 # Configuration template
├── .gitignore
├── requirements.txt             # Backend dependencies
└── README.md                    # Setup documentation
```

---

## ⚙️ Installation & Setup

Follow these steps sequentially to run the project locally.

### 1. Configure Environment Variables
Copy `.env.example` in the root folder to a new file named `.env`:
```bash
# In the root NTCC directory
copy .env.example .env
```
Open `.env` and configure:
```env
DEMO_MODE=true # Set to false to use live Gemini API
SECRET_KEY=change-this-to-a-secure-random-key
AI_API_KEY=YOUR_GEMINI_API_KEY
AI_MODEL=gemini-3.6-flash
AI_BASE_URL=
DATABASE_URL=sqlite:///instance/database.db
```

### 2. Backend Setup
1. Navigate to the `backend` directory and create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   ```
2. Activate the virtual environment:
   - **Windows (PowerShell)**: `venv\Scripts\Activate.ps1`
   - **Windows (CMD)**: `venv\Scripts\activate.bat`
   - **macOS/Linux**: `source venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python main.py
   ```
   The API will start running at `http://localhost:5000`. Database tables will automatically initialize in `instance/database.db` on boot.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   # On Windows (if PowerShell policy blocks script, use npm.cmd):
   npm.cmd install
   # Or standard:
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm.cmd run dev
   # Or standard:
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🧪 Running Automated Tests

To verify backend endpoints and database schemas, run:
```bash
cd backend
python -m unittest test_app.py
```

---

## 💡 Demo Mode credentials
If you wish to log in directly to a fresh account without setting up a new email, register any account on the register page. Email verification is mocked; simply typing a valid email format works instantly.

---

## 🎓 College Presentation Talking Points

During your NTCC major project review, you can showcase these critical **Generative AI** concepts implemented in the codebase:

1. **What is Generative AI & Structured Output?**
   - Show how the backend requests Gemini to structure evaluations specifically as strict JSON, allowing the Flask API to parse, log, and render details without messy text matching.
2. **Context-Aware Prompts (Prompt Engineering)**:
   - Walk through `ai_service.py` to showcase the system instructions and structured prompts used to build custom, non-repetitive questions based on candidate resume keywords and job descriptions.
3. **Granular Evaluation Metrics**:
   - Explain how the AI acts as a constructivist reviewer, analyzing four distinct categories to avoid biased scoring.
4. **Actionable Roadmap Generation**:
   - Highlight the 7-day study plan, showing how the AI aggregates overall weaknesses and designs a targeted topic study schedule.
5. **Speech Integration**:
   - Demonstrate the native browser **Web Speech API** for speech-to-text dictation and text-to-speech voice playback.

---

## 🔮 Future Scope

- **Video Stream Analysis**: Using client-side camera captures for eye tracking and micro-expression assessment.
- **Dynamic IDE / Coding Console**: Integrating a real-time editor where candidates can execute syntax directly against test suites.
- **Company-Specific Benchmarking**: Accessing specific historical banks matching companies like Google, Microsoft, or Amazon.
- **Multi-language Mocking**: Simulating interviews in native regional dialects.
