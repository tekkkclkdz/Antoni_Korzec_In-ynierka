from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from generateEtdrs import generateEtdrsPdf
import uuid
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChartRequest(BaseModel):
    distance: float
    rows: int

@app.post("/generate")
def generateChart(data: ChartRequest):
    filename = f"etdrs_{uuid.uuid4().hex}.pdf"
    output_dir = "charts"
    os.makedirs(output_dir, exist_ok=True)  
    filepath = os.path.join(output_dir, filename)

    try:
        generateEtdrsPdf(distanceM=data.distance, rows=data.rows, filename=filepath)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))  

    return FileResponse(
        path=filepath,
        filename="etdrs_chart.pdf",
        media_type="application/pdf"
    )


