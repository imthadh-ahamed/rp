from fastapi import APIRouter
from api.dependencies import (
    expected_features,
    feature_cols_course,
    loaded_model,
    label_encoders,
    course_model,
    label_encoders_course,
)

router = APIRouter(prefix="/debug", tags=["Debug"])


@router.get("/features")
def debug_features():
    return {
        "university_model_features": list(expected_features),
        "course_model_features": list(feature_cols_course) if feature_cols_course is not None else [],
    }


@router.get("/model-info")
def debug_model_info():
    return {
        "university_model": {
            "loaded": loaded_model is not None,
            "type": str(type(loaded_model)),
            "classes": [str(c) for c in loaded_model.classes_] if loaded_model is not None else [],
            "label_encoder_keys": list(label_encoders.keys()),
        },
        "course_model": {
            "loaded": course_model is not None,
            "type": str(type(course_model)),
            "label_encoder_keys": list(label_encoders_course.keys()),
        },
    }
