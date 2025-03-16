from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pdfplumber
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

UPLOAD_FOLDER = "uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the folder exists
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Load Summarization Model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Store document processing statuses
processing_status = {}

# ---------------------- File Upload API ----------------------
@app.route("/upload", methods=["POST"])
def upload_file():
    """Handles document upload and stores it locally."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Invalid file name"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)

    # Store initial processing status
    processing_status[file.filename] = "Processing"

    return jsonify({
        "message": "File uploaded successfully",
        "file_path": file_path,
        "document_id": file.filename
    })


# ---------------------- Status Check API ----------------------
@app.route("/status/<document_id>", methods=["GET"])
def check_status(document_id):
    """Returns the processing status of a document."""
    status = processing_status.get(document_id, "Not Found")
    return jsonify({"document_id": document_id, "status": status})


# ---------------------- Summarization API ----------------------
@app.route("/summarize", methods=["POST"])
def summarize_document():
    """Reads the stored PDF, extracts text, and summarizes it."""
    print("in summary")
    data = request.get_json()
    file_path = data.get("file_path")

    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 400

    # Extract text from PDF
    with pdfplumber.open(file_path) as pdf:
        text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])

    if not text:
        processing_status[file_path] = "Error"
        return jsonify({"error": "No readable text found in PDF"}), 400

    # Mark as "Summarizing"
    processing_status[file_path] = "Summarizing"

    # Generate summary
    summary = summarizer(text[:1024], max_length=200, min_length=50, do_sample=False)[0]["summary_text"]

    # Mark as "Completed"
    processing_status[file_path] = "Completed"
    print("Status set to Completed")  # Add this line

    return jsonify({"summary": summary})


if __name__ == "__main__":
    app.run(debug=True)
