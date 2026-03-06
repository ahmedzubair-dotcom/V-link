import cv2
import numpy as np
import base64

# Load the Haar cascade file for face detection (OpenCV built-in)
# Downloaded at runtime or accessed via cv2.data.haarcascades
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def detect_face(base64_image_str):
    """
    Decodes a base64 image and detects if a face is present.
    base64_image_str: Expected format 'data:image/jpeg;base64,...'
    """
    try:
        # Strip header if present
        if 'base64,' in base64_image_str:
            base64_image_str = base64_image_str.split('base64,')[1]
            
        # Decode image string
        img_data = base64.b64decode(base64_image_str)
        nparr = np.frombuffer(img_data, np.uint8)
        
        # Read image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return False, "Could not decode image."
            
        # Convert to grayscale for Haar cascade
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )
        
        has_face = len(faces) > 0
        return has_face, f"Detected {len(faces)} faces."
        
    except Exception as e:
        return False, str(e)
