from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent.agent import VisaAgent  # keep your current import

# Initialize your agent
agent = VisaAgent()

# FastAPI app
app = FastAPI()

# Enable CORS so React frontend can talk to backend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # frontend URLs allowed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class Question(BaseModel):
    question: str

# API endpoint
@app.post("/ask")
def ask_question(q: Question):
    answer = agent.answer(q.question)
    return {"answer": answer}

# Optional CLI for local testing removed
if __name__ == "__main__":
    pass
