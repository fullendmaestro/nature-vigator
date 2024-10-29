# server/create_embeddings.py

import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import chromadb

# Initialize ChromaDB and CLIP model
client = chromadb.Client()
image_collection = client.get_collection("image_embeddings")
text_collection = client.get_collection("text_embeddings")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def generate_image_embedding(image_path):
    image = Image.open(image_path)
    inputs = processor(images=image, return_tensors="pt", padding=True)
    with torch.no_grad():
        image_embedding = model.get_image_features(**inputs).numpy().tolist()
    return image_embedding

def generate_text_embedding(content_data):
    content_text = f"{content_data['type']} {content_data['name']} {content_data['description']} " + \
                   " ".join([f"{d['name']}: {d['value']}" for d in content_data['details']])
    inputs = processor(text=content_text, return_tensors="pt", padding=True)
    with torch.no_grad():
        text_embedding = model.get_text_features(**inputs).numpy().tolist()
    return text_embedding

def add_embedding_to_collection(embedding, doc_id, collection_type="image"):
    collection = image_collection if collection_type == "image" else text_collection
    collection.add(embeddings=[embedding], metadatas=[{"doc_id": doc_id}])
