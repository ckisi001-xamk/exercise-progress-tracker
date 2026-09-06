from fastapi import FastAPI

app = FastAPI(
    title="Exercise Progress Tracker",
    description="Backend API for Exercise Progress Tracker",
    version="0.1.0",
)

@app.get("/")
def read_root():
    return {"message": "Exercise Progress Tracker API is running"}
