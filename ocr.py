import cv2
import numpy as np
from pdf2image import convert_from_path
from paddleocr import PaddleOCR

def pdf_to_images(pdf_path, dpi=300):
    """Convert PDF pages to images."""
    images = convert_from_path(pdf_path, dpi=dpi)
    return images

def preprocess_image(image):
    """Preprocess image for better OCR results."""
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresholded = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                        cv2.THRESH_BINARY, 11, 2)
    return thresholded

def extract_text_paddle(image, lang="en"):
    """Extract text from an image using PaddleOCR."""
    ocr = PaddleOCR(use_angle_cls=True, lang=lang)
    results = ocr.ocr(image, cls=True)
    extracted_text = ""
    for line in results:
        for word in line:
            extracted_text += word[1][0] + " "
    return extracted_text.strip()

def process_pdf(pdf_path, lang="en"):
    """Convert a PDF to text using PaddleOCR with multilingual support."""
    images = pdf_to_images(pdf_path)
    extracted_text = ""
    
    for idx, image in enumerate(images):
        processed_img = preprocess_image(image)
        text = extract_text_paddle(processed_img, lang=lang)
        extracted_text += f"Page {idx+1}:\n" + text + "\n\n"
    
    return extracted_text

# Example usage
pdf_path = "//home/khushi/Desktop/cummins/hindi.jpeg"
language = "hi"  # Change to desired language
o_text = process_pdf(pdf_path, lang=language)
print(o_text)

# Save extracted text to file
with open("extracted_text.txt", "w", encoding="utf-8") as f:
    f.write(o_text)

print("OCR process completed using PaddleOCR. Extracted text saved to extracted_text.txt")