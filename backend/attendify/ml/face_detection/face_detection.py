import cv2
import numpy as np

def rotate_image(image, angle):
    """Rotate the image by a specified angle."""
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated_image = cv2.warpAffine(image, matrix, (w, h), flags=cv2.INTER_CUBIC)
    return rotated_image

def detect_faces_haar(image, scaleFactor=1.1, minNeighbors=5):
    """Detect faces using Haar Cascade in multiple orientations, returning the best result."""
    try:
        # Check if the image is in BGR format
        if len(image.shape) == 3 and image.shape[2] == 3:
            pass  # Image is already in BGR format
        else:
            raise ValueError("Input image is not in the expected BGR format")

        # Rotations to check
        angles = [0, 90, 180, 270]
        best_angle = 0
        max_faces = 0
        best_bounding_boxes = []
        
        # Load the Haar cascade model
        detect_face_model = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

        # Loop through each rotation angle and detect faces
        for angle in angles:
            rotated_image = rotate_image(image, angle)
            grayscale = cv2.cvtColor(rotated_image, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            faces = detect_face_model.detectMultiScale(grayscale, scaleFactor=scaleFactor, minNeighbors=minNeighbors)
            boundingBoxes = [(x, y, x + w, y + h) for (x, y, w, h) in faces]
            
            # Track the rotation with the most detected faces
            if len(boundingBoxes) > max_faces:
                max_faces = len(boundingBoxes)
                best_angle = angle
                best_bounding_boxes = boundingBoxes

        # Return the best bounding boxes and rotation angle
        return best_bounding_boxes, best_angle

    except Exception as e:
        print(f"Error: {e}")
        return None, None
