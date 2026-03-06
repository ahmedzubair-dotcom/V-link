<p align="center">
  <h1 align="center">🔗 V-LINK</h1>
  <p align="center">
    <strong>A privacy-first social platform with AI-powered matching, real-time chat, and built-in safety.</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#api-endpoints">API Endpoints</a> •
    <a href="#license">License</a>
  </p>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **🤖 AI-Powered Matching** | ML service scores potential matches based on shared interests, department, and year |
| **🛡️ GuardianShield** | Real-time content moderation that detects and blocks harmful messages automatically |
| **💬 Real-Time Chat** | Socket.IO-powered instant messaging between matched users |
| **📸 LiveID Verification** | Face detection via OpenCV to verify user identity during onboarding |
| **👤 Anonymous Profiles** | Privacy-first design — users control what information is visible |
| **🔐 JWT Authentication** | Secure token-based auth with bcrypt password hashing |
| **🛑 Admin Dashboard** | Review flagged incidents, manage users, and monitor platform safety |
| **📱 Responsive UI** | Beautiful, animated interface built with Tailwind CSS and Framer Motion |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 7** — Fast dev server and optimized builds
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Smooth animations and transitions
- **Socket.IO Client** — Real-time communication
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client
- **Lucide React** — Icon library

### Backend
- **Node.js** + **Express** — REST API server
- **MongoDB** + **Mongoose** — Database and ODM
- **Socket.IO** — WebSocket server for real-time chat
- **JWT** — Token-based authentication
- **bcryptjs** — Password hashing

### ML Service
- **Python** + **Flask** — Lightweight API for ML endpoints
- **OpenCV** — Face detection and verification
- **NLTK** — Natural language processing for content moderation
- **NumPy** — Numerical computations for match scoring

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.9+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/ahmedzubair-dotcom/V-link.git
cd V-link
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
ML_SERVICE_URL=http://localhost:5001
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. ML Service Setup

```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 5. Run All Services

From the root directory:

```bash
npm install
npm start
```

This starts all three services concurrently:
| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5000` |
| ML Service | `http://localhost:5001` |

---

## 📁 Project Structure

```
V-link/
├── frontend/                # React + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx           # Landing page
│       │   ├── Login.jsx          # User login
│       │   ├── Register.jsx       # User registration
│       │   ├── Onboarding.jsx     # New user onboarding flow
│       │   ├── ProfileSetup.jsx   # Profile configuration
│       │   ├── Chat.jsx           # Real-time messaging
│       │   ├── LiveID.jsx         # Face verification
│       │   └── Admin.jsx          # Admin dashboard
│       └── ...
├── backend/                 # Express API server
│   └── src/
│       ├── routes/
│       │   ├── auth.js            # Login & registration
│       │   ├── users.js           # User profiles
│       │   ├── matches.js         # AI matching
│       │   ├── chat.js            # Chat history
│       │   └── admin.js           # Admin operations
│       ├── models/
│       │   ├── User.js            # User schema
│       │   ├── Match.js           # Match schema
│       │   ├── Message.js         # Chat message schema
│       │   ├── Incident.js        # Flagged incident schema
│       │   └── BannedDevice.js    # Banned device schema
│       └── index.js               # Server entry point
├── ml-service/              # Python ML microservice
│   ├── app.py                     # Flask API server
│   ├── matching.py                # Match scoring algorithm
│   ├── moderation.py              # GuardianShield content moderation
│   ├── verification.py            # Face detection (OpenCV)
│   └── requirements.txt
├── package.json             # Root package (concurrently)
├── render.yaml              # Render deployment config
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Get current user profile |
| `PUT` | `/api/users/profile` | Update user profile |

### Matches
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/matches/potential` | Get AI-scored potential matches |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/chat/:matchId` | Get chat history for a match |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/incidents` | Get all flagged incidents |

### ML Service
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/match` | Score potential matches |
| `POST` | `/api/moderate` | Analyze message for threats |
| `POST` | `/api/verify-face` | Detect face in image |

---

## 🛡️ GuardianShield — How It Works

```
User sends message → Socket.IO → ML Moderation API
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
              Threat Level 0      Threat Level 1     Threat Level 2-3
              (Safe)              (Warning)          (Blocked/Banned)
                    │                   │                   │
              ✅ Delivered        ⚠️ Delivered +      🚫 Hidden +
                                   Warning shown      Incident logged
```

- **Level 0** — Safe message, delivered normally
- **Level 1** — Mild concern, delivered with a warning to the sender
- **Level 2** — Harmful content, message blocked and incident logged
- **Level 3** — Severe threat, user permanently banned

---

## 🌐 Deployment

The project includes deployment configurations for:

- **Render** — `render.yaml` for multi-service deployment
- **Azure** — `azure_kudu_build.bat` for Azure App Service

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/ahmedzubair-dotcom">ahmedzubair-dotcom</a>
</p>
