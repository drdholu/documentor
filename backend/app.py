# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import pdfplumber
# from transformers import pipeline
# from mistralai import Mistral
# client = Mistral(api_key="jSuS6hHLe4rv2OWmQwql1eDlCvBLgmC2")

# from pathlib import Path

# # pdf_file = Path("./uploads/PROBLEM STATEMENT 2.pdf")
# from mistralai import DocumentURLChunk, ImageURLChunk, TextChunk
# import json

# app = Flask(__name__)
# CORS(app) 

# UPLOAD_FOLDER = "uploads/"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# # Load Summarization Model
# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# # Store document processing statuses
# processing_status = {}

# def mistral_ocr(pdf_file):
#     # assert pdf_file.is_file()
#     uploaded_file = client.files.upload(
#         file={
#             "file_name": pdf_file.stem,
#             "content": pdf_file.read_bytes(),
#         },
#         purpose="ocr",
#     )

#     signed_url = client.files.get_signed_url(file_id=uploaded_file.id, expiry=1)

#     # Perform OCR on the document
#     pdf_response = client.ocr.process(
#         document=DocumentURLChunk(document_url=signed_url.url),
#         model="mistral-ocr-latest",
#         include_image_base64=True
#     )

#     # Convert OCR response to dictionary
#     response_dict = json.loads(pdf_response.model_dump_json())

#     # Print raw JSON response (for debugging)
#     json_string = json.dumps(response_dict, indent=4)
#     print(json_string)

#     def format_french_document(response_dict):
#         """
#         Extracts and formats the OCR output for a French document.
        
#         Args:
#             response_dict (dict): The OCR response dictionary.
            
#         Returns:
#             str: A well-formatted string representation of the document.
#         """
#         output = []

#         # Extract pages
#         pages = response_dict.get("pages", [])
#         for page in pages:
#             index = page.get("index", 0)
#             markdown_text = page.get("markdown", "")

#             output.append(f"### Page {index + 1}")
#             output.append("-" * 50)
#             output.append(markdown_text)
#             output.append("\n")  # Add space between pages

#         return "\n".join(output)

#     def format_hindi_document(response_dict):
#         """
#         Extracts and formats the OCR output for a Hindi document (Devanagari script).
        
#         Args:
#             response_dict (dict): The OCR response dictionary.
            
#         Returns:
#             str: A well-formatted string representation of the document.
#         """
#         output = []

#         # Extract pages
#         pages = response_dict.get("pages", [])
#         for page in pages:
#             index = page.get("index", 0)
#             markdown_text = page.get("markdown", "")

#             output.append(f"### पृष्ठ {index + 1} (Hindi)")
#             output.append("—" * 50)
#             output.append(markdown_text)
#             output.append("\n")  # Add space between pages

#         return "\n".join(output)

#     def format_english_document(response_dict):
#         """
#         Extracts and formats the OCR output for an English document.
        
#         Args:
#             response_dict (dict): The OCR response dictionary.
            
#         Returns:
#             str: A well-formatted string representation of the document.
#         """
#         output = []

#         # Extract pages
#         pages = response_dict.get("pages", [])
#         for page in pages:
#             index = page.get("index", 0)
#             markdown_text = page.get("markdown", "")

#             output.append(f"### Page {index + 1} (English)")
#             output.append("=" * 50)
#             output.append(markdown_text)
#             output.append("\n")  # Add space between pages

#         return "\n".join(output)


#     first_page_text = response_dict["pages"][0]["markdown"]

#     # Detect language from response and format accordingly
#     if any("अ" <= char <= "ह" or "क" <= char <= "ज्ञ" for char in first_page_text):
#         formatted_output = format_hindi_document(response_dict)
#     elif any("é" in first_page_text or "à" in first_page_text or "ç" in first_page_text):
#         formatted_output = format_french_document(response_dict)
#     else:
#         formatted_output = format_english_document(response_dict)
#     # print(formatted_output)




# # ---------------------- File Upload API ----------------------
# @app.route("/upload", methods=["POST"])
# def upload_file():
#     """Handles document upload and stores it locally."""
#     if "file" not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400

#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "Invalid file name"}), 400

#     file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
#     file.save(file_path)

#     # Store initial processing status
#     processing_status[file.filename] = "Processing"

#     return jsonify({
#         "message": "File uploaded successfully",
#         "file_path": file_path,
#         "document_id": file.filename
#     })


# # ---------------------- Status Check API ----------------------
# # @app.route("/status/<document_id>", methods=["GET"])
# # def check_status(document_id):
# #     """Returns the processing status of a document."""
# #     status = processing_status.get(document_id, "Not Found")
# #     return jsonify({"document_id": document_id, "status": status})


# # ---------------------- Summarization API ----------------------
# @app.route("/summarize", methods=["POST"])
# def summarize_document():
#     """Reads the stored PDF, extracts text, and summarizes it."""
#     print("in summary")
#     data = request.get_json()
#     file_path = data.get("file_path")

#     if not file_path or not os.path.exists(file_path):
#         return jsonify({"error": "File not found"}), 400

#     # Perform OCR using Mistral
#     text, error = mistral_ocr(file_path)

#     if error:
#         processing_status[file_path] = "Error"
#         return jsonify({"error": error}), 400

#     # Mark as "Summarizing"
#     processing_status[file_path] = "Summarizing"

#     # Generate summary
#     summary = summarizer(text[:1024], max_length=200, min_length=50, do_sample=False)[0]["summary_text"]

#     # Mark as "Completed"
#     processing_status[file_path] = "Completed"

#     return jsonify({"summary": summary})


# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from pathlib import Path
from transformers import pipeline
from mistralai import Mistral, DocumentURLChunk

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
model = "open-mistral-nemo"

# Load Summarization Model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Store document processing statuses
processing_status = {}

# Initialize Mistral Client
client = Mistral(api_key="jSuS6hHLe4rv2OWmQwql1eDlCvBLgmC2")

def mistral_ocr(pdf_file_path):
    """
    Performs OCR using Mistral and returns the extracted text.
    
    Args:
        pdf_file_path (str): Path to the uploaded PDF file.
    
    Returns:
        str: Extracted text from the document.
    """
    pdf_file = Path(pdf_file_path)
    if not pdf_file.is_file():
        return None, "File not found"

    # Upload PDF for OCR processing
    uploaded_file = client.files.upload(
        file={
            "file_name": pdf_file.stem,
            "content": pdf_file.read_bytes(),
        },
        purpose="ocr",
    )

    # Get signed URL for OCR processing
    signed_url = client.files.get_signed_url(file_id=uploaded_file.id, expiry=1)

    # Perform OCR
    pdf_response = client.ocr.process(
        document=DocumentURLChunk(document_url=signed_url.url),
        model="mistral-ocr-latest",
        include_image_base64=True
    )

    # Convert OCR response to dictionary
    response_dict = json.loads(pdf_response.model_dump_json())

    # Extract text from pages
    extracted_text = []
    for page in response_dict.get("pages", []):
        page_text = page.get("markdown", "").strip()
        if page_text:
            extracted_text.append(page_text)

    # Join extracted text
    final_text = "\n".join(extracted_text)

    if not final_text:
        return None, "No readable text found in OCR"

    return final_text, None  # No error

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


# ---------------------- Summarization API ----------------------
@app.route("/summarize", methods=["POST"])
def summarize_document():
    """Extracts text using OCR, then summarizes it."""
    data = request.get_json()
    file_path = data.get("file_path")

    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 400

    text, error = mistral_ocr(file_path)
    
    chat_response = client.chat.complete(
    model= model,
    messages = [
        {
            "role": "user",
            "content": f"Translate this {text} to english if it's already not in english. Only return back the translations and nothing else.",
        },
    ]
    )
    text = chat_response.choices[0].message.content

    if error:
        processing_status[file_path] = "Error"
        return jsonify({"error": error}), 400

    processing_status[file_path] = "Summarizing"

    summary = summarizer(text[:1024], max_length=200, min_length=50, do_sample=False)[0]["summary_text"]

    processing_status[file_path] = "Completed"

    return jsonify({"summary": summary})


if __name__ == "__main__":
    app.run(debug=True)
