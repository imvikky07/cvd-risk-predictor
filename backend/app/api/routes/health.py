from fastapi import APIRouter
from app.schemas.prediction import HealthResponse
from app.ml.model_loader import model_loader
from app.core.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health():
    if not model_loader.is_loaded:
        try:
            model_loader.load()
        except Exception:
            pass
    return HealthResponse(
        status       = "healthy" if model_loader.is_loaded else "degraded",
        model_loaded = model_loader.is_loaded,
        model_type   = "Voting Ensemble (RF + GradientBoosting + LR)",
        version      = settings.VERSION,
        service      = settings.APP_NAME,
    )
