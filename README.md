# V-LINK

A social platform I built for connecting people in a safe, privacy-respecting way. It pairs users through an ML-based matching system, lets them chat in real time, and has a moderation layer (GuardianShield) that keeps conversations safe — all without compromising anonymity.

---

## What it does

- **Smart Matching** — A Python ML service scores users based on shared interests, department, and year, so you see the most relevant people first.
- **Real-Time Chat** — Once matched, users can message each other instantly via WebSockets (Socket.IO).
- **Content Moderation (GuardianShield)** — Every message passes through an NLP-based moderation system before delivery. Harmful content gets flagged, blocked, or results in a ban depending on severity.
- **Face Verification (LiveID)** — During onboarding, OpenCV checks that a real person is behind the account.
- **Privacy-First Design** — Users choose what to share. Profiles stay anonymous until both people are comfortable.
- **Admin Panel** — A dashboard to review flagged incidents and manage users.

---

## Tech used

**Frontend:** React 19, Vite 7, Tailwind CSS 4, Framer Motion, Socket.IO Client, React Router, Axios, Lucide icons

**Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT, bcryptjs

**ML Service:** Python, Flask, OpenCV, NLTK, NumPy

---

## How to run it locally

You'll need **Node.js 18+**, **Python 3.9+**, and a **MongoDB** instance (local or [Atlas](https://www.mongodb.com/atlas)).

### 1. Clone & install

```bash
git clone https://github.com/ahmedzubair-dotcom/V-link.git
cd V-link
npm install
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
ML_SERVICE_URL=http://localhost:5001
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

### 4. Set up the ML service

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

### 5. Start everything

From the root folder:

```bash
npm start
```

That boots up all three services:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| ML Service | http://localhost:5001 |

---

## Project layout

```
V-link/
├── frontend/                   # React app
│   └── src/pages/
│       ├── Home.jsx            # Landing page
│       ├── Login.jsx           # Login
│       ├── Register.jsx        # Sign up
│       ├── Onboarding.jsx      # New user flow
│       ├── ProfileSetup.jsx    # Profile config
│       ├── Chat.jsx            # Messaging
│       ├── LiveID.jsx          # Face verification
│       └── Admin.jsx           # Admin dashboard
│
├── backend/                    # Express API
│   └── src/
│       ├── routes/             # auth, users, matches, chat, admin
│       ├── models/             # User, Match, Message, Incident, BannedDevice
│       └── index.js            # Entry point + Socket.IO setup
│
├── ml-service/                 # Flask microservice
│   ├── app.py                  # API server
│   ├── matching.py             # Match scoring
│   ├── moderation.py           # Content moderation
│   └── verification.py         # Face detection
│
├── render.yaml                 # Render deploy config
└── package.json                # Root scripts (runs all 3 services)
```

---

## API overview

**Auth** — `POST /api/auth/register`, `POST /api/auth/login`

**Users** — `GET /api/users/profile`, `PUT /api/users/profile`

**Matches** — `GET /api/matches/potential`

**Chat** — `GET /api/chat/:matchId`

**Admin** — `GET /api/admin/incidents`

**ML endpoints** — `POST /api/match`, `POST /api/moderate`, `POST /api/verify-face`

---

## How GuardianShield works

When a user sends a message, it goes through the ML moderation service before anyone sees it:

- **Level 0 (Safe)** — Message goes through normally.
- **Level 1 (Mild)** — Message goes through, but the sender gets a warning.
- **Level 2 (Harmful)** — Message is blocked. An incident is logged for admin review.
- **Level 3 (Severe)** — Message is blocked and the user is permanently banned.

All of this happens in under a second, so the chat still feels instant.

---

## Deployment

Configs are included for **Render** (`render.yaml`) and **Azure App Service** (`azure_kudu_build.bat`).

---

Built by [ahmedzubair-dotcom](https://github.com/ahmedzubair-dotcom)
