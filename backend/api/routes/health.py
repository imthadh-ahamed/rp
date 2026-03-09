from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/")
def root():
    return {"status": "UGC Admission Forecasting API is running"}


@router.get("/health")
def health():
    return {"status": "ok"}
