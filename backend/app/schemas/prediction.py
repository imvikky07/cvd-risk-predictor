from pydantic import BaseModel, Field
from typing import Optional
from enum import IntEnum


class ChestPainType(IntEnum):
    typical_angina   = 1
    atypical_angina  = 2
    non_anginal_pain = 3
    asymptomatic     = 4


class RestECG(IntEnum):
    normal            = 0
    st_t_abnormality  = 1
    lv_hypertrophy    = 2


class Slope(IntEnum):
    upsloping   = 1
    flat        = 2
    downsloping = 3


class Thal(IntEnum):
    normal         = 3
    fixed_defect   = 6
    reversable     = 7


class PredictionRequest(BaseModel):
    # Core required fields (present in all 4 datasets)
    age:      int   = Field(..., ge=18,  le=100,  description="Age in years")
    sex:      int   = Field(..., ge=0,   le=1,    description="Sex: 1=Male, 0=Female")
    cp:       int   = Field(..., ge=1,   le=4,    description="Chest pain type (1–4)")
    trestbps: float = Field(..., ge=80,  le=220,  description="Resting blood pressure (mmHg)")
    chol:     float = Field(..., ge=100, le=600,  description="Serum cholesterol (mg/dl)")
    fbs:      int   = Field(..., ge=0,   le=1,    description="Fasting blood sugar > 120 mg/dl")
    restecg:  int   = Field(..., ge=0,   le=2,    description="Resting ECG results (0–2)")
    thalach:  float = Field(..., ge=60,  le=220,  description="Maximum heart rate achieved")
    exang:    int   = Field(..., ge=0,   le=1,    description="Exercise induced angina: 1=Yes")
    oldpeak:  float = Field(..., ge=0.0, le=10.0, description="ST depression (exercise vs rest)")

    # Optional — imputed if missing (high missing rate in dataset)
    slope: Optional[int]   = Field(None, ge=1, le=3, description="Slope of peak ST segment")
    ca:    Optional[int]   = Field(None, ge=0, le=3, description="Major vessels by fluoroscopy")
    thal:  Optional[int]   = Field(None, description="Thal: 3=Normal, 6=Fixed, 7=Reversable")

    model_config = {
        "json_schema_extra": {
            "example": {
                "age": 57, "sex": 1, "cp": 4, "trestbps": 140,
                "chol": 241, "fbs": 0, "restecg": 1, "thalach": 123,
                "exang": 1, "oldpeak": 0.2, "slope": 2, "ca": 0, "thal": 7,
            }
        }
    }


class RiskLevel(str):
    pass


class PredictionResponse(BaseModel):
    prediction:       int   = Field(..., description="0 = No Disease, 1 = Disease")
    probability:      float = Field(..., description="Probability of heart disease (0–1)")
    risk_percentage:  float = Field(..., description="Risk as percentage")
    risk_level:       str   = Field(..., description="Low / Medium / High")
    risk_label:       str   = Field(..., description="Human-readable outcome")
    message:          str   = Field(..., description="Contextual advice")
    input_summary:    PredictionRequest


class HealthResponse(BaseModel):
    status:       str
    model_loaded: bool
    model_type:   str
    version:      str
    service:      str
