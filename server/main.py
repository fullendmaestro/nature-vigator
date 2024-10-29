# server/main.py

import os
import uuid
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from create_embeddings import generate_image_embedding, generate_text_embedding, add_embedding_to_collection

app = FastAPI()
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/create-content")
async def create_content(
    type: str = Form(...),
    name: str = Form(...),
    description: str = Form(...),
    details: str = Form(...),  # JSON stringified details
    image: UploadFile = File(...)
):
    # Create unique ID for this document
    doc_id = str(uuid.uuid4())

    # Save image temporarily
    image_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(image_path, "wb") as f:
        f.write(image.file.read())

    # Parse details from string to list
    details_list = eval(details)  # Ensure input is secure before using eval in production
    content_data = {
        "type": type,
        "name": name,
        "description": description,
        "details": details_list
    }

    # Generate embeddings
    image_embedding = generate_image_embedding(image_path)
    text_embedding = generate_text_embedding(content_data)

    # Add embeddings to respective ChromaDB collections
    add_embedding_to_collection(image_embedding, doc_id, collection_type="image")
    add_embedding_to_collection(text_embedding, doc_id, collection_type="text")

    # Clean up image file
    os.remove(image_path)

    return JSONResponse(content={"message": "Content created successfully", "doc_id": doc_id})

@app.post("/search-content")
async def search_content(query: str = Form(None), image: UploadFile = File(None)):
    if query:
        # Text search
        query_embedding = generate_text_embedding({"type": "", "name": "", "description": query, "details": []})
        collection = text_collection
    elif image:
        # Image search
        image_path = os.path.join(UPLOAD_DIR, image.filename)
        with open(image_path, "wb") as f:
            f.write(image.file.read())
        query_embedding = generate_image_embedding(image_path)
        collection = image_collection
        os.remove(image_path)
    else:
        return JSONResponse(content={"error": "Query or image is required"}, status_code=400)

    # Perform a similarity search
    results = collection.query(query_embeddings=[query_embedding], n_results=5)

    # Extract and format results
    matched_results = [{"doc_id": result["doc_id"], "score": result["score"]} for result in results]

    return JSONResponse(content={"results": matched_results})

# Start server with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
