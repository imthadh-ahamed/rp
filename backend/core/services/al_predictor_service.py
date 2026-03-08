import os
import logging
import json
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from pathlib import Path

# Setup logging
logger = logging.getLogger(__name__)

# Data Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data" / "al_predictor"

MODEL_PATH = DATA_DIR / "xgboost_al_stream_model.json"
LABEL_ENCODER_PATH = DATA_DIR / "label_encoder_classes.npy"
FEATURE_COLUMNS_PATH = DATA_DIR / "feature_columns.txt"

# Global variables to hold loaded assets
model = None
label_encoder = None
feature_columns = []

def load_model_assets():
    """Load model, label encoder, and feature columns."""
    global model, label_encoder, feature_columns
    
    try:
        if not MODEL_PATH.exists():
            logger.error(f"Model file not found at: {MODEL_PATH}")
            return
            
        # Load XGBoost model
        model = xgb.XGBClassifier()
        model.load_model(str(MODEL_PATH))
        
        # Load label encoder classes
        label_classes = np.load(str(LABEL_ENCODER_PATH), allow_pickle=True)
        label_encoder = LabelEncoder()
        label_encoder.classes_ = label_classes
        
        # Load feature columns
        with open(FEATURE_COLUMNS_PATH, 'r') as f:
            feature_columns = [line.strip() for line in f.readlines()]
            
        logger.info("✓ AL Predictor Model loaded successfully!")
        logger.info(f"Available streams: {', '.join(label_classes)}")
        
    except Exception as e:
        logger.error(f"✗ Error loading AL Predictor model: {e}")
        raise RuntimeError(f"Failed to load AL Predictor model: {e}")

# Load on module import (or can be called explicitly on app startup)
# Calling it here for simplicity, but in FastAPI lifespan is better.
# We will ensure it's loaded before prediction.

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

def calculate_derived_features(student_data):
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

def predict_stream(student_data):
    """
    Predict AL stream based on OL marks.
    """
    global model, label_encoder, feature_columns
    
    if model is None:
        load_model_assets()
        
    # Validate required core subjects
    core_subjects = SUBJECT_BASKETS['basket1']['subjects']
    for subject in core_subjects:
        if subject not in student_data:
            raise ValueError(f'Missing required subject: {subject}')
    
    # Initialize all OL subjects
    all_ol_subjects = [
        'first_language', 'english', 'mathematics', 'science',
        'history', 'religion', 'Geography', 'Civic Education',
        'Business and Accounting Studies', 'Second Language',
        'ICT', 'Agriculture and Food Technology',
        'Health and Physical Education', 'Art', 'Music',
        'Dance', 'Drama', 'Literature'
    ]
    
    temp_data = student_data.copy()
    
    for subject in all_ol_subjects:
        if subject not in temp_data:
            temp_data[subject] = 0
    
    # Set AL features to default values
    temp_data['al_subject_1_numeric'] = 0
    temp_data['al_subject_2_numeric'] = 0
    temp_data['al_subject_3_numeric'] = 0
    
    # Calculate derived features
    temp_data = calculate_derived_features(temp_data)
    
    # Create feature vector
    feature_vector = [temp_data[col] for col in feature_columns]
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
    confidence_diff = top_2[0]['confidence'] - top_2[1]['confidence']
    
    if top_2[0]['confidence'] >= 60:
        interpretation = f"Strong recommendation for {top_2[0]['stream']}. This stream aligns well with your OL performance."
    elif confidence_diff < 10:
        interpretation = f"Close competition between {top_2[0]['stream']} and {top_2[1]['stream']}. Consider your personal interests and career goals."
    else:
        interpretation = f"{top_2[0]['stream']} is recommended, with {top_2[1]['stream']} as alternative."
    
    return {
        'success': True,
        'top_recommendations': top_2,
        'all_predictions': all_predictions,
        'student_summary': {
            'mathematics': temp_data['mathematics'],
            'science': temp_data['science'],
            'english': temp_data['english'],
            'first_language': temp_data['first_language'],
            'math_science_avg': round(temp_data['math_science_avg'], 2),
            'language_avg': round(temp_data['language_avg'], 2),
            'stem_aptitude': round(temp_data['stem_aptitude'], 2),
            'humanities_aptitude': round(temp_data['humanities_aptitude'], 2)
        },
        'interpretation': interpretation
    }

def get_available_streams():
    global label_encoder
    if label_encoder is None:
        load_model_assets()
    return list(label_encoder.classes_)
