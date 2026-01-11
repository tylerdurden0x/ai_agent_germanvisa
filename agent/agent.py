# agent workflow
import os
from dotenv import load_dotenv
from retriever.faiss_store import FAISSStore
from google import genai

# Load .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)


class VisaAgent:
    def __init__(self):
        # Load your knowledge base
        self.store = FAISSStore("data/visa_knowledge.json")

    def answer(self, user_question):
        # Semantic search in your knowledge base
        results = self.store.search(user_question)
        best = results[0]

        # Confidence threshold
        if best["distance"] > 1.5:
            return "I don’t have real experience on this yet."

        # Prepare context
        context = "\n".join([r["item"]["answer"] for r in results])
        prompt = f"""
Answer ONLY from real student experience.

Context:
{context}

Question:
{user_question}
"""

        # Call Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",  # or any model you have access to
            contents=prompt
        )

        return response.text.strip()
