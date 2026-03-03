<<<<<<< HEAD
# AIINTEL — AI Customer Support Intelligence Platform

Real-time AI-powered customer support platform with ticket management, live chat, knowledge base, and analytics. Built with React, FastAPI, PostgreSQL, and Groq AI (Llama 3.3 70B).

---

## 🚀 Quick Links

| Link | Description |
|------|-------------|
| [Getting Started](#-getting-started-local-setup) | Run the app on your machine |
| [Architecture](#-architecture-at-a-glance) | System design and data flow |
| [Project Structure](#-project-structure) | Codebase overview |
| [API Reference](#-api-reference) | Backend endpoints |
| [Deployment](#-deployment) | Deploy to Vercel + Railway + Supabase |

---

## 🏗️ Architecture at a Glance

```
User (Browser)
    │
    ▼
[React Frontend — Vite]         → localhost:5173
    │
    │  REST API calls
    ▼
[FastAPI Backend — Python]      → localhost:8000
    ├── /api/auth     → JWT Authentication
    ├── /api/tickets  → Ticket CRUD
    ├── /api/ai       → Groq AI Integration
    ├── /api/kb       → Knowledge Base
    └── /api/analytics → Dashboard Stats
    │
    ▼
[PostgreSQL Database]           → localhost:5432
    ├── users
    ├── tickets
    ├── messages
    ├── kb_articles
    └── chat_sessions
    │
    ▼
[Groq API — Llama 3.3 70B]     → api.groq.com (Free)
```

**Frontend** — User interacts via React dashboard (login, tickets, live chat, KB, AI Studio).

**Backend** — FastAPI handles all business logic, authentication, and proxies AI requests.

**Database** — PostgreSQL stores all users, tickets, messages, knowledge base articles, and chat sessions.

**AI** — Groq's free Llama 3.3 70B model powers chat, reply suggestions, article generation, and AI Studio.

---

## 📁 Project Structure

```
ai-support-platform/                  # Frontend (React + Vite)
│
├── src/
│   ├── App.jsx                       # Main app — Dashboard, Tickets, Chat, KB, AI Studio
│   ├── AuthPage.jsx                  # FAANG-style login & register page
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
│   ├── user.py                       # User model (name, email, hashed_password, role)
│   ├── ticket.py                     # Ticket model (subject, status, priority, category)
│   ├── message.py                    # Message + ChatSession models
│   └── kb_article.py                 # KBArticle model (title, content, category, views)
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
├── .env                              # Environment variables (never commit this!)
├── requirements.txt                  # Python dependencies
└── venv/                             # Python virtual environment
```

---

## 💻 New System Setup (From Scratch)

Follow this section when setting up on a **brand new Windows machine**. If tools are already installed, jump to [Getting Started](#-getting-started-local-setup).

### Step 1 — Install Node.js
Download and install **Node.js v18+** from https://nodejs.org

```powershell
# Verify install
node --version
npm --version
```

### Step 2 — Install Python
Download and install **Python 3.10+** from https://python.org

```powershell
# Verify install
python --version
pip --version
```

### Step 3 — Install PostgreSQL
Download and install **PostgreSQL 17** from https://postgresql.org/download/windows

During install:
- Set password for `postgres` user
- Keep default port `5432`
- Install pgAdmin 4 when prompted

```powershell
# Verify install
psql --version
```

### Step 4 — Create the Database
Open **pgAdmin 4** or **psql** and run:

```sql
CREATE DATABASE ai_support_db;
```

### Step 5 — Get a Free Groq API Key
1. Go to https://console.groq.com
2. Sign up for free (no credit card needed)
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)

---

## 🛠️ Getting Started (Local Setup)

If Node.js, Python, and PostgreSQL are already installed, follow these steps.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-support-platform.git
cd ai-support-platform
```

### 2. Setup the Backend

```bash
cd support-backend/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in `support-backend/backend/`:

```env
# ─── DATABASE ─────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_support_db

# ─── SECURITY ─────────────────────────────────────────────────────────────────
SECRET_KEY=your-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# ─── GROQ AI (Free) ───────────────────────────────────────────────────────────
GROQ_API_KEY=gsk_your_groq_key_here

# ─── APP ──────────────────────────────────────────────────────────────────────
APP_NAME=AI Support Platform
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Important:** If your PostgreSQL password contains special characters like `@`, URL-encode them. For example, `ram@12` becomes `ram%4012`.

### 4. Start the Backend

```bash
cd support-backend/backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### 5. Setup the Frontend

```bash
cd ai-support-platform
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

### 7. Open the App

Go to **http://localhost:5173** in your browser.

Register a new account and start using the platform!

---

## 🔧 Operational Commands

### View Backend Logs
```bash
# Backend terminal shows all API requests in real-time
uvicorn main:app --reload --port 8000
```

### Test API Endpoints
Interactive API documentation is available at:
```
http://localhost:8000/docs
```

### Reset Database (Drop & Recreate all tables)
```bash
cd support-backend/backend
python -c "from db.database import Base, engine; Base.metadata.drop_all(engine); Base.metadata.create_all(engine); print('DB reset!')"
```

### Check Backend is Running
```bash
curl http://localhost:8000
# or open in browser: http://localhost:8000
```

### Fix bcrypt Version Issue (if login fails with 500 error)
```bash
pip uninstall bcrypt -y
pip install bcrypt==4.0.1
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `GET`  | `/api/auth/me` | Get current user info |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/api/tickets` | List all tickets (filter by `?status=open`) |
| `POST`   | `/api/tickets` | Create new ticket |
| `GET`    | `/api/tickets/{id}` | Get ticket with messages |
| `PATCH`  | `/api/tickets/{id}` | Update ticket status/priority |
| `POST`   | `/api/tickets/{id}/messages` | Add message to ticket |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/chat` | Live chat with Llama 3.3 AI |
| `POST` | `/api/ai/suggest/{ticket_id}` | Generate reply suggestion for ticket |
| `POST` | `/api/ai/generate` | AI Studio — generate content |
| `POST` | `/api/ai/kb-article` | Generate knowledge base article |

### Knowledge Base
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/kb` | List articles (filter by `?search=query`) |
| `POST` | `/api/kb` | Create new article |
| `GET`  | `/api/kb/{id}` | Get single article |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/analytics` | Dashboard metrics and weekly trends |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based login/register with bcrypt password hashing |
| 🎫 **Ticket Management** | Create, filter, update, escalate, and close support tickets |
| 🤖 **AI Reply Suggestions** | One-click AI-generated replies for any ticket |
| 💬 **Live Chat** | Real-time AI chat powered by Llama 3.3 70B (free) |
| 📚 **Knowledge Base** | AI-generated help articles saved to database |
| 🎨 **AI Studio** | 4 templates — Response Generator, Ticket Summarizer, Macro Creator, Escalation Analyzer |
| 📊 **Dashboard** | Real-time metrics — total tickets, open now, CSAT score, AI assists |
| 👤 **Profile Management** | Edit profile, account settings, notifications, API keys |

---

## 🚀 Deployment

Deploy the full stack for **free** using:

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Vercel** | Frontend hosting | Unlimited |
| **Railway** | Backend hosting | 500 hrs/month |
| **Supabase** | PostgreSQL database | 500 MB |
| **Groq** | AI API | Free forever |

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Go to https://vercel.com → **New Project**
3. Import your repository
4. Set root directory to `ai-support-platform`
5. Click **Deploy**

### Deploy Backend to Railway
1. Go to https://railway.app → **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository, set root to `support-backend/backend`
4. Add all environment variables from your `.env` file
5. Railway auto-detects FastAPI and deploys

### Deploy Database to Supabase
1. Go to https://supabase.com → **New Project**
2. Copy the **Connection String** from Settings → Database
3. Update `DATABASE_URL` in Railway environment variables

---

## 🧹 Teardown

```bash
# Stop frontend
Ctrl + C    # in the npm run dev terminal

# Stop backend
Ctrl + C    # in the uvicorn terminal

# Stop PostgreSQL (if needed)
# Open Services → postgresql-x64-17 → Stop
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite | 18.x |
| Styling | Pure CSS-in-JS | — |
| Backend | FastAPI | 0.100+ |
| ORM | SQLAlchemy | 2.x |
| Database | PostgreSQL | 17 |
| Authentication | JWT + bcrypt | — |
| AI Model | Llama 3.3 70B via Groq | Free |
| HTTP Client | httpx | 0.27+ |
| Validation | Pydantic v2 | 2.x |

---

## 📜 License

MIT License — feel free to use this project for learning, portfolios, and interviews.
=======
# Ai-Support-Platform
A full-stack AI-powered customer support platform built with React, FastAPI, PostgreSQL, and Groq AI (Llama 3.3 70B — free). Features ticket management, live AI chat, auto-generated knowledge base, AI reply suggestions, and real-time analytics — all in one dark-themed dashboard inspired by Intercom and Zendesk.
>>>>>>> f1fe733fb2509588eb24b916dcbb7e8ffc9b3833
