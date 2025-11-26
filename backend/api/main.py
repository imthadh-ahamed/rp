from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import recommend
import uvicorn
import os

app = FastAPI(
    title="Agentic Course Recommendation API",
    description="AI-powered course recommendation system using RAG and LLMs",
    version="1.0.0"
)

# CORS Configuration
# Allow requests from Node.js backend (usually localhost:5000 or similar)
# and Frontend (localhost:3000)
origins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "*" # For development, allow all. Restrict in production.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(recommend.router, tags=["Recommendations"])

@app.get("/")
async def root():
    return {"message": "Agentic Course Recommendation API is running 🚀"}

if __name__ == "__main__":
    # Run with uvicorn
    # Host 0.0.0.0 allows access from other containers/machines
    # Port 8000 is standard for FastAPI
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
