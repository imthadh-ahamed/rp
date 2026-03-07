from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.routes import health, debug, predict, courses, combined, rule_recommend

app = FastAPI(title="UGC Admission Forecasting API", version="1.0.0")

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(debug.router)
app.include_router(predict.router)
app.include_router(courses.router)
app.include_router(combined.router)
app.include_router(rule_recommend.router)


if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)