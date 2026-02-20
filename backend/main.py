from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("KINDWISE_API_KEY")

class ImageRequest(BaseModel):
    image: str

@app.post("/health")
async def analyze_health(req: ImageRequest):
    try:
        response = requests.post(
            "https://plant.id/api/v3/health_assessment?details=local_name,description,treatment,classification,common_names,cause",
            headers={
                "Api-Key": API_KEY,
                "Content-Type": "application/json"
            },
            json={
                "images": [f"data:image/jpeg;base64,{req.image}"],
                "health": "only"   # REQUIRED
            }
        )

        print("STATUS:", response.status_code)
        print("RAW RESPONSE:", response.text)

        return response.json()

    except Exception as e:
        print("ERROR:", str(e))
        return {"error": str(e)}