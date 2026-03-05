from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from models.message import KBArticle
from models.user import User
from schemas.schemas import KBArticleCreate, KBArticleOut
from core.security import get_current_user

router = APIRouter(prefix="/api/kb", tags=["knowledge-base"])

@router.get("", response_model=list[KBArticleOut])
def list_articles(
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(KBArticle).filter(KBArticle.is_published == True)
    if search:
        q = q.filter(KBArticle.title.ilike(f"%{search}%") | KBArticle.content.ilike(f"%{search}%"))
    if category:
        q = q.filter(KBArticle.category == category)
    return q.order_by(KBArticle.views.desc()).all()

@router.post("", response_model=KBArticleOut, status_code=201)
def create_article(data: KBArticleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    article = KBArticle(**data.model_dump(), created_by=current_user.id)
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

@router.get("/{article_id}", response_model=KBArticleOut)
def get_article(article_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    article = db.query(KBArticle).filter(KBArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article.views += 1
    db.commit()
    db.refresh(article)
    return article

@router.put("/{article_id}", response_model=KBArticleOut)
def update_article(article_id: int, data: KBArticleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    article = db.query(KBArticle).filter(KBArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    for field, val in data.model_dump().items():
        setattr(article, field, val)
    db.commit()
    db.refresh(article)
    return article

@router.delete("/{article_id}", status_code=204)
def delete_article(article_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    article = db.query(KBArticle).filter(KBArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(article)
    db.commit()
