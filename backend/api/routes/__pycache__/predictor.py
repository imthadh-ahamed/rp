from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
import logging
from pathlib import Path
from typing import Dict, List, Any

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/predict", tags=["Predictor"])

# ============================================================================
# LOAD MODEL AND ENCODERS ON STARTUP
# ============================================================================
MODEL_DIR = Path("data/models")

# Global variables
model = None
label_encoder = None
feature_columns = None

def load_models():
    global model, label_encoder, feature_columns
    try:
        logger.info("Loading model and encoders...")
        
        # Load XGBoost model
        model = xgb.XGBClassifier()
        model_path = MODEL_DIR / 'xgboost_al_stream_model.json'
        if not model_path.exists():
             raise FileNotFoundError(f"Model file not found at {model_path}")
        model.load_model(str(model_path))
        
        # Load label encoder classes
        le_path = MODEL_DIR / 'label_encoder_classes.npy'
        if not le_path.exists():
            raise FileNotFoundError(f"Label encoder file not found at {le_path}")
        label_classes = np.load(str(le_path), allow_pickle=True)
        label_encoder = LabelEncoder()
        label_encoder.classes_ = label_classes
        
        # Load feature columns
        fc_path = MODEL_DIR / 'feature_columns.txt'
        if not fc_path.exists():
            raise FileNotFoundError(f"Feature columns file not found at {fc_path}")
        with open(fc_path, 'r') as f:
            feature_columns = [line.strip() for line in f.readlines()]
        
        logger.info("✓ Model loaded successfully!")
        logger.info(f"Available streams: {', '.join(label_classes)}")
        
    except Exception as e:
        logger.error(f"✗ Error loading model: {e}")
        # We don't raise here to allow the app to start, but endpoints will fail
        
# Load models immediately (or could do mostly on startup event)
load_models()

# ============================================================================
# SCHEMAS
# ============================================================================
class StreamPredictionRequest(BaseModel):
    first_language: float
    english: float
    mathematics: float
    science: float
    history: float
    religion: float
    Geography: float = 0
    Civic_Education: float = 0  # Copied key name handling carefully
    Business_and_Accounting_Studies: float = 0
    Second_Language: float = 0
    ICT: float = 0
    Agriculture_and_Food_Technology: float = 0
    Health_and_Physical_Education: float = 0
    Art: float = 0
    Music: float = 0
    Dance: float = 0
    Drama: float = 0
    Literature: float = 0

    class Config:
        # Allow input aliases to match the frontend JSON keys if they contain spaces
        # But for simplicity, we'll try to handle mapping manually or expect snake_case/matching keys
        pass

# ============================================================================
# CONFIGURATION
# ============================================================================
SUBJECT_BASKETS = {
    'basket1': {
        'name': 'Core Subjects',
        'description': 'Compulsory subjects',
        'subjects': [
            'first_language',
            'english',
            'mathematics',
            'science',
            'history',
            'religion'
        ],
        'required': True
    },
    'basket2': {
        'name': 'Geography/Civic/Business',
        'description': 'Select ONE subject',
        'subjects': [
            'Geography',
            'Civic Education',
            'Business and Accounting Studies'
        ],
        'required': True
    },
    'basket3': {
        'name': 'Language/ICT/Agriculture',
        'description': 'Select ONE subject',
        'subjects': [
            'Second Language',
            'ICT',
            'Agriculture and Food Technology'
        ],
        'required': True
    },
    'basket4': {
        'name': 'Health/Arts',
        'description': 'Select ONE subject',
        'subjects': [
            'Health and Physical Education',
            'Art',
            'Music',
            'Dance',
            'Drama',
            'Literature'
        ],
        'required': True
    }
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================
def calculate_derived_features(student_data: Dict[str, float]) -> Dict[str, float]:
    """Calculate derived features from student marks."""
    student_data['al_average'] = 0
    
    student_data['math_science_avg'] = (
        student_data['mathematics'] + student_data['science']
    ) / 2
    
    student_data['language_avg'] = (
        student_data['first_language'] + student_data['english']
    ) / 2
    
    student_data['social_avg'] = (
        student_data['history'] + student_data['religion']
    ) / 2
    
    student_data['stem_aptitude'] = student_data['math_science_avg']
    
    student_data['humanities_aptitude'] = (
        student_data['language_avg'] + student_data['social_avg']
    ) / 2
    
    return student_data

# ============================================================================
# ROUTES
# ============================================================================
@router.get('/baskets')
def get_baskets():
    """Get subject basket configuration."""
    return SUBJECT_BASKETS

@router.get('/streams')
def get_streams():
    """Get list of available AL streams."""
    if label_encoder is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {
        'streams': list(label_encoder.classes_)
    }

@router.post('/stream')
def predict_stream(payload: Dict[str, Any] = Body(...)):
    """
    Predict AL stream based on OL marks.
    Using Dict[str, Any] temporarily to handle messy key names with spaces easily,
    similar to the original Flask implementation.
    """
    if model is None or label_encoder is None or feature_columns is None:
        raise HTTPException(status_code=503, detail="Model not initialized properly")

    try:
        student_data = payload.copy()
        
        # Validate required core subjects
        core_subjects = SUBJECT_BASKETS['basket1']['subjects']
        for subject in core_subjects:
            if subject not in student_data:
                raise HTTPException(status_code=400, detail=f'Missing required subject: {subject}')
        
        # Initialize all OL subjects
        all_ol_subjects = [
            'first_language', 'english', 'mathematics', 'science',
            'history', 'religion', 'Geography', 'Civic Education',
            'Business and Accounting Studies', 'Second Language',
            'ICT', 'Agriculture and Food Technology',
            'Health and Physical Education', 'Art', 'Music',
            'Dance', 'Drama', 'Literature'
        ]
        
        for subject in all_ol_subjects:
            if subject not in student_data:
                student_data[subject] = 0
            else:
                # Ensure numeric
                student_data[subject] = float(student_data[subject])
        
        # Set AL features to default values
        student_data['al_subject_1_numeric'] = 0
        student_data['al_subject_2_numeric'] = 0
        student_data['al_subject_3_numeric'] = 0
        
        # Calculate derived features
        student_data = calculate_derived_features(student_data)
        
        # Create feature vector
        try:
            feature_vector = [student_data[col] for col in feature_columns]
        except KeyError as missing_col:
            logger.error(f"Missing feature column in data: {missing_col}")
            # Try to recover or strict fail? Strict fail is better for debugging logic.
            # But let's check if it's one of the weird named ones.
            raise HTTPException(status_code=500, detail=f"Internal Logic Error: Missing feature {missing_col}")

        X_test = pd.DataFrame([feature_vector], columns=feature_columns)
        
        # Get predictions
        prediction_proba = model.predict_proba(X_test)[0]
        
        # Get all predictions sorted by confidence
        all_predictions = []
        for idx, prob in enumerate(prediction_proba):
            all_predictions.append({
                'stream': label_encoder.classes_[idx],
                'confidence': float(prob * 100)
            })
        
        all_predictions.sort(key=lambda x: x['confidence'], reverse=True)
        
        top_2 = all_predictions[:2]
        
        # Calculate interpretation
        # Guard against single class or empty results
        if len(top_2) >= 2:
            confidence_diff = top_2[0]['confidence'] - top_2[1]['confidence']
            
            if top_2[0]['confidence'] >= 60:
                interpretation = f"Strong recommendation for {top_2[0]['stream']}. This stream aligns well with your OL performance."
            elif confidence_diff < 10:
                interpretation = f"Close competition between {top_2[0]['stream']} and {top_2[1]['stream']}. Consider your personal interests and career goals."
            else:
                interpretation = f"{top_2[0]['stream']} is recommended, with {top_2[1]['stream']} as alternative."
        elif len(top_2) == 1:
            interpretation = f"Recommendation: {top_2[0]['stream']}."
        else:
             interpretation = "No recommendation available."

        return {
            'success': True,
            'top_recommendations': top_2,
            'all_predictions': all_predictions,
            'student_summary': {
                'mathematics': student_data['mathematics'],
                'science': student_data['science'],
                'english': student_data['english'],
                'first_language': student_data['first_language'],
                'math_science_avg': round(student_data['math_science_avg'], 2),
                'language_avg': round(student_data['language_avg'], 2),
                'stem_aptitude': round(student_data['stem_aptitude'], 2),
                'humanities_aptitude': round(student_data['humanities_aptitude'], 2)
            },
            'interpretation': interpretation
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
