import json
import numpy as np
import faiss
from retriever.embedder import Embedder


class FAISSStore:
    def __init__(self, data_path):
        self.embedder = Embedder()

        with open(data_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)

        questions = [item["question"] for item in self.data]
        embeddings = self.embedder.embed(questions)

        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(embeddings).astype("float32"))

    def search(self, query, k=3):
        query_embedding = self.embedder.embed([query])
        distances, indices = self.index.search(
            np.array(query_embedding).astype("float32"), k
        )

        results = []
        for idx, dist in zip(indices[0], distances[0]):
            results.append({
                "item": self.data[idx],
                "distance": float(dist)
            })

        return results
