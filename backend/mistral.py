from mistralai import Mistral
client = Mistral(api_key="jSuS6hHLe4rv2OWmQwql1eDlCvBLgmC2")

from pathlib import Path

pdf_file = Path("./uploads/PROBLEM STATEMENT 2.pdf")
assert pdf_file.is_file()
from mistralai import DocumentURLChunk, ImageURLChunk, TextChunk
import json

uploaded_file = client.files.upload(
    file={
        "file_name": pdf_file.stem,
        "content": pdf_file.read_bytes(),
    },
    purpose="ocr",
)

signed_url = client.files.get_signed_url(file_id=uploaded_file.id, expiry=1)

# Perform OCR on the document
pdf_response = client.ocr.process(
    document=DocumentURLChunk(document_url=signed_url.url),
    model="mistral-ocr-latest",
    include_image_base64=True
)

# Convert OCR response to dictionary
response_dict = json.loads(pdf_response.model_dump_json())

# Print raw JSON response (for debugging)
json_string = json.dumps(response_dict, indent=4)
print(json_string)

def format_french_document(response_dict):
    """
    Extracts and formats the OCR output for a French document.
    
    Args:
        response_dict (dict): The OCR response dictionary.
        
    Returns:
        str: A well-formatted string representation of the document.
    """
    output = []

    # Extract pages
    pages = response_dict.get("pages", [])
    for page in pages:
        index = page.get("index", 0)
        markdown_text = page.get("markdown", "")

        output.append(f"### Page {index + 1}")
        output.append("-" * 50)
        output.append(markdown_text)
        output.append("\n")  # Add space between pages

    return "\n".join(output)

def format_hindi_document(response_dict):
    """
    Extracts and formats the OCR output for a Hindi document (Devanagari script).
    
    Args:
        response_dict (dict): The OCR response dictionary.
        
    Returns:
        str: A well-formatted string representation of the document.
    """
    output = []

    # Extract pages
    pages = response_dict.get("pages", [])
    for page in pages:
        index = page.get("index", 0)
        markdown_text = page.get("markdown", "")

        output.append(f"### पृष्ठ {index + 1} (Hindi)")
        output.append("—" * 50)
        output.append(markdown_text)
        output.append("\n")  # Add space between pages

    return "\n".join(output)

def format_english_document(response_dict):
    """
    Extracts and formats the OCR output for an English document.
    
    Args:
        response_dict (dict): The OCR response dictionary.
        
    Returns:
        str: A well-formatted string representation of the document.
    """
    output = []

    # Extract pages
    pages = response_dict.get("pages", [])
    for page in pages:
        index = page.get("index", 0)
        markdown_text = page.get("markdown", "")

        output.append(f"### Page {index + 1} (English)")
        output.append("=" * 50)
        output.append(markdown_text)
        output.append("\n")  # Add space between pages

    return "\n".join(output)


first_page_text = response_dict["pages"][0]["markdown"]

# Detect language from response and format accordingly
if any("अ" <= char <= "ह" or "क" <= char <= "ज्ञ" for char in first_page_text):
    formatted_output = format_hindi_document(response_dict)
elif any("é" in first_page_text or "à" in first_page_text or "ç" in first_page_text):
    formatted_output = format_french_document(response_dict)
else:
    formatted_output = format_english_document(response_dict)

print(formatted_output)


