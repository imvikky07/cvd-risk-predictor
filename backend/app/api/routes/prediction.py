from fastapi import APIRouter, HTTPException, status
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.ml.model_loader import model_loader
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

_MESSAGES = {
    "Low": (
        "Your results suggest a low probability of cardiovascular disease. "
        "Maintain your healthy habits, stay active, and schedule regular checkups."
    ),
    "Medium": (
        "Your results indicate a moderate cardiovascular risk. "
        "Lifestyle changes (diet, exercise, stress management) are strongly recommended. "
        "Please consult your doctor for a full evaluation."
    ),
    "High": (
        "Your results indicate a high probability of cardiovascular disease. "
        "Please seek medical attention promptly. A cardiologist evaluation is advised."
    ),
}


@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="CVD Risk Prediction",
)
async def predict(request: PredictionRequest):
    try:
        if not model_loader.is_loaded:
            model_loader.load()

        raw = request.model_dump()
        prediction, probability, risk_level = model_loader.predict(raw)

        risk_label = "Heart Disease Detected" if prediction == 1 else "No Heart Disease Detected"
        message    = _MESSAGES[risk_level]

        return PredictionResponse(
            prediction      = prediction,
            probability     = probability,
            risk_percentage = round(probability * 100, 2),
            risk_level      = risk_level,
            risk_label      = risk_label,
            message         = message,
            input_summary   = request,
        )
    except RuntimeError as e:
        logger.error(f"Model unavailable: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed. Please try again.")
