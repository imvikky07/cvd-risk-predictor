"""
Retrain the CVD Risk model from scratch.
Usage:  python scripts/train_model.py
Must be run from the /backend directory.
"""
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import numpy as np
import pandas as pd
import joblib
import logging
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score, accuracy_score, f1_score, classification_report
import warnings; warnings.filterwarnings('ignore')

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

DATA_FILES = [
    "processed.cleveland.data",
    "processed.hungarian.data",
    "processed.switzerland.data",
    "processed.va.data",
]
DATA_DIR   = os.path.join(os.path.dirname(__file__), '..', 'raw_data')
MODEL_DIR  = os.path.join(os.path.dirname(__file__), '..', 'app', 'ml')
COLS = ['age','sex','cp','trestbps','chol','fbs','restecg',
        'thalach','exang','oldpeak','slope','ca','thal','num']


def load_data() -> pd.DataFrame:
    dfs = []
    for f in DATA_FILES:
        path = os.path.join(DATA_DIR, f)
        if not os.path.exists(path):
            log.warning(f"Data file not found: {path}")
            continue
        dfs.append(pd.read_csv(path, header=None, names=COLS, na_values=['?']))
    if not dfs:
        raise FileNotFoundError(f"No data files found in {DATA_DIR}. Place the 4 processed.*.data files there.")
    df = pd.concat(dfs, ignore_index=True).drop_duplicates()
    df['target'] = (df['num'] > 0).astype(int)
    return df.drop(columns=['num'])


def engineer(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df['age_group']        = pd.cut(df['age'], bins=[0,40,50,60,70,100], labels=[0,1,2,3,4]).astype(float)
    df['hr_reserve']       = df['thalach'] / (220 - df['age'])
    df['bp_high']          = (df['trestbps'] > 140).astype(float)
    df['cp_asymptomatic']  = (df['cp'] == 4).astype(float)
    df['age_sex']          = df['age'] * df['sex']
    df['oldpeak_severity'] = pd.cut(df['oldpeak'].fillna(0), bins=[-0.1,0,1,2,10], labels=[0,1,2,3]).astype(float)
    return df


def train():
    log.info("Loading data…")
    df   = load_data()
    df   = engineer(df)
    feat = [c for c in df.columns if c != 'target']
    X_raw, y = df[feat], df['target']

    log.info(f"Samples: {len(df)}  Positive: {y.sum()}  Features: {len(feat)}")

    imp = SimpleImputer(strategy='median')
    X   = pd.DataFrame(imp.fit_transform(X_raw), columns=feat)

    best_rf = RandomForestClassifier(
        n_estimators=500, min_samples_split=4, min_samples_leaf=3,
        max_features='log2', max_depth=8, class_weight='balanced', random_state=42
    )
    best_gb = GradientBoostingClassifier(
        subsample=0.8, n_estimators=100, min_samples_leaf=4,
        max_depth=3, learning_rate=0.05, random_state=42
    )
    best_lr = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(C=0.05, solver='lbfgs', max_iter=2000, class_weight='balanced'))
    ])
    ensemble = VotingClassifier(
        estimators=[('rf', best_rf), ('gb', best_gb), ('lr', best_lr)],
        voting='soft', weights=[2, 2, 1]
    )

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    auc = cross_val_score(ensemble, X, y, cv=cv, scoring='roc_auc').mean()
    acc = cross_val_score(ensemble, X, y, cv=cv, scoring='accuracy').mean()
    f1  = cross_val_score(ensemble, X, y, cv=cv, scoring='f1').mean()
    log.info(f"CV  →  AUC={auc:.4f}  Acc={acc:.4f}  F1={f1:.4f}")

    log.info("Fitting on full dataset…")
    ensemble.fit(X, y)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(ensemble, os.path.join(MODEL_DIR, 'model.pkl'))
    joblib.dump(imp,      os.path.join(MODEL_DIR, 'imputer.pkl'))
    joblib.dump(feat,     os.path.join(MODEL_DIR, 'feature_cols.pkl'))
    log.info(f"Artifacts saved to {MODEL_DIR}")


if __name__ == "__main__":
    train()
