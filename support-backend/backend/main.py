from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import Base, engine
from core.config import settings

# Import all models so they register with SQLAlchemy
from models import user, ticket, message  # noqa

# Import routers
from routers import auth, tickets, kb, ai, analytics

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered customer support backend with FastAPI + PostgreSQL",
    version="1.0.0",
)

# CORS — allow the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(kb.router)
app.include_router(ai.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {"status": "ok", "app": settings.APP_NAME, "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy"}
