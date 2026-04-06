from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import prediction, health
from app.core.config import settings
from app.ml.model_loader import model_loader
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title       = settings.APP_NAME,
    description = "Cardiovascular Disease Risk Prediction — Voting Ensemble (RF + GBM + LR) · UCI Heart Disease Dataset",
    version     = settings.VERSION,
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins     = settings.ALLOWED_ORIGINS,
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])


@app.on_event("startup")
async def startup():
    logger.info("Loading ML model on startup…")
    try:
        model_loader.load()
        logger.info("Model ready.")
    except Exception as e:
        logger.error(f"Model failed to load on startup: {e}")


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "docs":    "/docs",
        "health":  "/health",
    }
