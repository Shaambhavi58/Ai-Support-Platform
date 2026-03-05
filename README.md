# AIINTEL — AI Customer Support Intelligence Platform

A full-stack AI-powered customer support platform built with React, FastAPI, PostgreSQL, and Groq AI (Llama 3.3 70B — free). Features ticket management, live AI chat, auto-generated knowledge base, AI reply suggestions, and real-time analytics — all in one dark-themed dashboard.

---

## 🚀 Quick Links

| Link | Description |
|------|-------------|
| [Live Demo](https://ai-support-platform.vercel.app) | Live production app |
| [Getting Started](#-getting-started-local-setup) | Run the app on your machine |
| [Architecture](#-architecture-at-a-glance) | System design and data flow |
| [Project Structure](#-project-structure) | Codebase overview |
| [API Reference](#-api-reference) | Backend endpoints |
| [Deployment](#-deployment) | Deploy to Vercel + Railway + Supabase |

---

## 🌐 Production URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://ai-support-platform.vercel.app |
| **Backend API** | https://ai-support-platform-production.up.railway.app |
| **API Docs** | https://ai-support-platform-production.up.railway.app/docs |

---

## 🏗️ Architecture at a Glance

```
User (Browser)
    │
    ▼
[React Frontend — Vite]         → Vercel
    │
    │  REST API calls
    ▼
[FastAPI Backend — Python]      → Railway
    ├── /auth      → JWT Authentication
    ├── /tickets   → Ticket CRUD
    ├── /ai        → Groq AI Integration
    ├── /knowledge-base → Knowledge Base
    └── /analytics → Dashboard Stats
    │
    ▼
[PostgreSQL Database]           → Supabase
    ├── users
    ├── tickets
    ├── messages
    ├── kb_articles
    └── chat_sessions
    │
    ▼
[Groq API — Llama 3.3 70B]     → api.groq.com (Free)
```

---

## 📁 Project Structure

```
ai-support-platform/                  # Frontend (React + Vite)
│
├── src/
│   ├── App.jsx                       # Main app — Dashboard, Tickets, Chat, KB, AI Studio
│   ├── AuthPage.jsx                  # Login & register page
│   ├── AppRoot.jsx                   # Auth wrapper — handles token & session
│   ├── main.jsx                      # React entry point
│   └── api.js                        # API service layer (all backend calls)
│
├── index.html
├── vite.config.js
└── package.json


support-backend/backend/              # Backend (FastAPI + Python)
│
├── main.py                           # FastAPI app entry point, CORS, router registration
│
├── routers/
│   ├── auth.py                       # Register, login, JWT token, get current user
│   ├── tickets.py                    # Ticket CRUD, messages, status updates
│   ├── ai.py                         # Groq AI — chat, suggest reply, generate article
│   ├── kb.py                         # Knowledge base CRUD and search
│   └── analytics.py                  # Dashboard metrics and weekly trends
│
├── models/
│   ├── user.py                       # User model
│   ├── ticket.py                     # Ticket model
│   ├── message.py                    # Message + ChatSession models
│   └── kb_article.py                 # KBArticle model
│
├── schemas/
│   └── schemas.py                    # Pydantic schemas for request/response validation
│
├── core/
│   ├── config.py                     # Settings — loads .env variables
│   ├── security.py                   # JWT creation, bcrypt hashing, auth dependency
│   └── database.py                   # SQLAlchemy engine and session
│
├── db/
│   └── database.py                   # DB session and Base for table creation
│
├── Dockerfile                        # Docker config for Railway deployment
├── requirements.txt                  # Python dependencies
└── .env                              # Environment variables (never commit this!)
```

---

## 💻 New System Setup (From Scratch)

### Step 1 — Install Node.js
Download **Node.js v18+** from https://nodejs.org

### Step 2 — Install Python
Download **Python 3.11** from https://python.org

### Step 3 — Install PostgreSQL
Download **PostgreSQL 17** from https://postgresql.org/download/windows

### Step 4 — Create the Database
```sql
CREATE DATABASE ai_support_db;
```

### Step 5 — Get a Free Groq API Key
1. Go to https://console.groq.com
2. Sign up for free
3. Click **API Keys** → **Create API Key**

---

## 🛠️ Getting Started (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/Shaambhavi58/Ai-Support-Platform.git
cd Ai-Support-Platform
```

### 2. Setup the Backend
```bash
cd support-backend/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create `.env` in `support-backend/backend/`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_support_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GROQ_API_KEY=gsk_your_groq_key_here
APP_NAME=AI Support Platform
```

### 4. Start the Backend
```bash
uvicorn main:app --reload --port 8000
```

### 5. Setup & Start the Frontend
```bash
cd ai-support-platform
npm install
npm run dev
```

### 6. Open the App
Go to **http://localhost:5173**

---

## 🔧 Operational Commands

### Test API Endpoints
```
http://localhost:8000/docs
```

### Reset Database
```bash
python -c "from db.database import Base, engine; Base.metadata.drop_all(engine); Base.metadata.create_all(engine); print('DB reset!')"
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create new account |
| `POST` | `/auth/login` | Login and get JWT token |
| `GET`  | `/auth/me` | Get current user info |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/tickets` | List all tickets |
| `POST`   | `/tickets` | Create new ticket |
| `GET`    | `/tickets/{id}` | Get ticket with messages |
| `PUT`    | `/tickets/{id}` | Update ticket status/priority |
| `POST`   | `/tickets/{id}/messages` | Add message to ticket |
| `POST`   | `/tickets/{id}/suggest-reply` | AI reply suggestion |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ai/chat` | Live chat with Llama 3.3 AI |
| `POST` | `/ai/generate` | AI Studio content generation |

### Knowledge Base
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/knowledge-base` | List articles |
| `POST` | `/knowledge-base` | Create new article |
| `POST` | `/knowledge-base/generate` | AI-generate article |
| `POST` | `/knowledge-base/ai-search` | AI-powered search |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/analytics/dashboard` | Dashboard metrics |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based login/register with bcrypt password hashing |
| 🎫 **Ticket Management** | Create, filter, update, escalate, and close support tickets |
| 🤖 **AI Reply Suggestions** | One-click AI-generated replies for any ticket |
| 💬 **Live Chat** | Real-time AI chat powered by Llama 3.3 70B |
| 📚 **Knowledge Base** | AI-generated help articles saved to database |
| 🎨 **AI Studio** | Response Generator, Ticket Summarizer, Macro Creator, Escalation Analyzer |
| 📊 **Dashboard** | Real-time metrics — tickets, CSAT score, AI assists, weekly trends |
| 👤 **Profile Management** | Edit profile, account settings, notifications, API keys |

---

## 🚀 Deployment

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Vercel** | Frontend hosting | Unlimited |
| **Railway** | Backend hosting | 500 hrs/month |
| **Supabase** | PostgreSQL database | 500 MB |
| **Groq** | AI API | Free forever |

### Frontend (Vercel)
1. Push to GitHub
2. Go to https://vercel.com → **New Project**
3. Import `Shaambhavi58/Ai-Support-Platform`
4. Deploy

### Backend (Railway)
1. Go to https://railway.app → **New Project**
2. Deploy from GitHub, set root to `support-backend/backend`
3. Add environment variables
4. Railway uses Dockerfile for Python 3.11

### Database (Supabase)
1. Go to https://supabase.com → **New Project**
2. Use **Session Pooler** connection string (IPv4 compatible)
3. Update `DATABASE_URL` in Railway

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | CSS-in-JS |
| Backend | FastAPI + Python 3.11 |
| ORM | SQLAlchemy 2.x |
| Database | PostgreSQL (Supabase) |
| Authentication | JWT + bcrypt |
| AI Model | Llama 3.3 70B via Groq (Free) |
| Deployment | Vercel + Railway + Supabase |

---

## 📜 License

MIT License — feel free to use this project for learning, portfolios, and interviews.
