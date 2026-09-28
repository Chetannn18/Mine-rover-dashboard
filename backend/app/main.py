from fastapi import FastAPI

app = FastAPI(title="Mine Rover Backend")


@app.get("/")
def root():
    return {
        "message": "Mine Rover Backend is running"
    }