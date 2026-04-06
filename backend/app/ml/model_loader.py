import joblib
import numpy as np
import pandas as pd
import logging
from typing import Dict, Any, Tuple
from app.core.config import settings

logger = logging.getLogger(__name__)


def _engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Apply the exact same feature engineering used during training."""
    df = df.copy()
    df['age_group']       = pd.cut(df['age'], bins=[0,40,50,60,70,100],
                                   labels=[0,1,2,3,4]).astype(float)
    df['hr_reserve']      = df['thalach'] / (220 - df['age'])
    df['bp_high']         = (df['trestbps'] > 140).astype(float)
    df['cp_asymptomatic'] = (df['cp'] == 4).astype(float)
    df['age_sex']         = df['age'] * df['sex']
    df['oldpeak_severity']= pd.cut(
        df['oldpeak'].fillna(0), bins=[-0.1, 0, 1, 2, 10], labels=[0,1,2,3]
    ).astype(float)
    return df


class ModelLoader:
    _instance = None
    _model    = None
    _imputer  = None
    _feat_cols= None
    _loaded   = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def load(self) -> None:
        if self._loaded:
            return
        try:
            self._model     = joblib.load(settings.MODEL_PATH)
            self._imputer   = joblib.load(settings.IMPUTER_PATH)
            self._feat_cols = joblib.load(settings.FEATURE_COLS_PATH)
            self._loaded = True
            logger.info("ML artifacts loaded successfully.")
        except FileNotFoundError as e:
            raise RuntimeError(f"Missing artifact: {e}. Run scripts/train_model.py first.")

    def predict(self, raw: Dict[str, Any]) -> Tuple[int, float, str]:
        if not self._loaded:
            self.load()

        base_df = pd.DataFrame([{
            'age':       raw['age'],
            'sex':       raw['sex'],
            'cp':        raw['cp'],
            'trestbps':  raw['trestbps'],
            'chol':      raw['chol'],
            'fbs':       raw['fbs'],
            'restecg':   raw['restecg'],
            'thalach':   raw['thalach'],
            'exang':     raw['exang'],
            'oldpeak':   raw['oldpeak'],
            'slope':     raw.get('slope', np.nan),
            'ca':        raw.get('ca', np.nan),
            'thal':      raw.get('thal', np.nan),
        }])

        engineered = _engineer_features(base_df)
        # Align columns exactly as training
        engineered = engineered.reindex(columns=self._feat_cols)
        imputed    = pd.DataFrame(
            self._imputer.transform(engineered),
            columns=self._feat_cols
        )

        pred  = int(self._model.predict(imputed)[0])
        prob  = float(self._model.predict_proba(imputed)[0][1])
        risk  = self._risk_label(prob)
        return pred, round(prob, 4), risk

    @staticmethod
    def _risk_label(prob: float) -> str:
        if prob < 0.35:
            return "Low"
        elif prob < 0.65:
            return "Medium"
        return "High"

    @property
    def is_loaded(self) -> bool:
        return self._loaded


model_loader = ModelLoader()
