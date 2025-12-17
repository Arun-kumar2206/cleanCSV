from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.preprocess import router as preprocess_router

app = FastAPI(
    title="ML Dataset Preprocessor",
    description="Upload a CSV file and get an ML-ready cleaned dataset",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(preprocess_router)

@app.get("/")
def root():
    return {
        "message": "ML Dataset Preprocessor API is running"
    }
