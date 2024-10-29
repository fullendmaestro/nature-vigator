# scripts/search.py

import sys
import json
import torch
from transformers import CLIPProcessor, CLIPModel
import chromadb
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image

# Setup ChromaDB and CLIP model
client = chromadb.Client()
collection = client.get_collection("image_collection") # Use pre-created collection
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load query text and process
with open(sys.argv[1], 'r') as file:
    query = file.read().strip()

# Generate query embedding
inputs = processor(text=query, return_tensors="pt", padding=True)
with torch.no_grad():
    query_embedding = model.get_text_features(**inputs).numpy().tolist()

# Perform a search in ChromaDB
results = collection.query(query_embeddings=query_embedding, n_results=1)

# Extract image path and similarity
result_image_path = results['metadatas'][0][0]['image']
matched_image_index = int(results['ids'][0][0])
matched_image_embedding = collection[matched_image_index]['embedding']

accuracy_score = cosine_similarity([query_embedding[0]], [matched_image_embedding])[0][0]

# Return results as JSON
response = {
    "image": result_image_path,
    "accuracy_score": accuracy_score,
}

print(json.dumps(response))
