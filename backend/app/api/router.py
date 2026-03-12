from fastapi import APIRouter
from app.api.auth_routes import router as auth_router
from app.api.chat_routes import router as chat_router
from app.api.admin_routes import router as admin_router
from app.api.history_routes import router as history_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(chat_router, prefix="/chat", tags=["Chat"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])
api_router.include_router(history_router, prefix="/history", tags=["History"])
