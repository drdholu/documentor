import cv2
import json
from paddleocr import PaddleOCR
from googletrans import Translator

def translate_text(text, target_lang='en'):
    translator = Translator()
    translated = translator.translate(text, dest=target_lang)
    return translated.text

def detect_language(text):
    translator = Translator()
    detected_lang = translator.detect(text).lang
    return detected_lang

def ocr_process(image_path):
    ocr = PaddleOCR(use_angle_cls=True, lang='ch')  # Supports multiple languages
    result = ocr.ocr(image_path, cls=True)
    extracted_text = []
    
    for line in result[0]:
        extracted_text.append(line[1][0])
    
    text_combined = ' '.join(extracted_text)
    detected_lang = detect_language(text_combined)
    
    if detected_lang != 'en':
        translated_text = translate_text(text_combined, 'en')
    else:
        translated_text = text_combined
    
    output = {
        "original_language": detected_lang,
        "original_text": text_combined,
        "translated_text": translated_text
    }
    
    return json.dumps(output, indent=4)

# Example usage
image_path = "/home/khushi/Desktop/cummins/synapse-ps2/mocr.py"  # Replace with actual image path
result_json = ocr_process(image_path)
print(result_json)
