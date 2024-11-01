import cv2 # type: ignore
import numpy as np
from PIL import Image
import face_recognition

def detect_faces_face_recognition(image_file):
    """Detect faces using face_recognition library with multiple rotations to find the best angle."""
    try:
        # Load the image using PIL and convert to RGB format
        image_pil = Image.open(image_file).convert("RGB")

        # Rotations to check
        angles = [0, 90, 180, 270]
        best_angle = 0
        max_faces = 0
        best_bounding_boxes = []
        image_np_best = np.array(image_pil)  # Default to original orientation

        # Loop through each rotation angle and detect faces
        for angle in angles:
            rotated_image_pil = image_pil.rotate(angle, resample=Image.BICUBIC, expand=True)
            image_np = np.array(rotated_image_pil)  # Convert to numpy array for face_recognition

            # Detect faces using face_recognition
            face_locations = face_recognition.face_locations(image_np, model="hog")
            
            # Convert face_locations to bounding boxes format [(x, y, w, h)]
            bounding_boxes = [(left, top, right - left, bottom - top) for top, right, bottom, left in face_locations]
            
            # Track the rotation with the most detected faces
            if len(bounding_boxes) > max_faces:
                image_np_best = image_np
                max_faces = len(bounding_boxes)
                best_angle = angle
                best_bounding_boxes = bounding_boxes

        # Draw bounding boxes on the best-rotated image
        for (x, y, w, h) in best_bounding_boxes:
            cv2.rectangle(image_np_best, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Convert back to BGR format for display with OpenCV
        image_np_best_bgr = cv2.cvtColor(image_np_best, cv2.COLOR_RGB2BGR)

        # Display the image with bounding boxes
        cv2.imshow("Detected Faces", image_np_best_bgr)
        cv2.waitKey(0)  # Wait for a key press to close the window
        cv2.destroyAllWindows()

        # Return the best bounding boxes and rotation angle
        return best_bounding_boxes, best_angle

    except Exception as e:
        print(f"Error: {e}")
        return None, None

    

def detect_faces_haar(image_file, scaleFactor=1.3, minNeighbors=5):
    """Detect faces using Haar Cascade in multiple orientations, returning the best result."""
    try:
        # Load the image using PIL
        image_pil = Image.open(image_file)

        # Rotations to check
        angles = [0, 90, 180, 270]
        best_angle = 0
        max_faces = 0
        best_bounding_boxes = []
        image_np_best = np.array(image_pil) # RGB format
        
        # Load the Haar cascade model
        detect_face_model = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

        # Loop through each rotation angle and detect faces
        for angle in angles:
            rotated_image_pil = image_pil.rotate(angle, resample=Image.BICUBIC, expand=True)
            image_np = np.array(rotated_image_pil) # RGB format

            grayscale = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)  
            
            # Detect faces
            faces = detect_face_model.detectMultiScale(grayscale, scaleFactor=scaleFactor, minNeighbors=minNeighbors)
            # print(faces)
            # bounding_boxes =[(x, y, w, h) for (x, y, w, h) in faces]
            bounding_boxes = faces
            
            # Track the rotation with the most detected faces
            if len(bounding_boxes) > max_faces:
                image_np_best = image_np
                max_faces = len(bounding_boxes)
                best_angle = angle
                best_bounding_boxes = bounding_boxes
        
        # Draw bounding boxes on the best-rotated image
        for (x, y, w, h) in best_bounding_boxes:
            cv2.rectangle(image_np_best, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Convert back to BGR format for display with OpenCV
        image_np_best_bgr = cv2.cvtColor(image_np_best, cv2.COLOR_RGB2BGR)

        # Display the image with bounding boxes
        cv2.imshow("Detected Faces", image_np_best_bgr)
        cv2.waitKey(0)  # Wait for a key press to close the window
        cv2.destroyAllWindows() 

        # Return the best bounding boxes and rotation angle
        return best_bounding_boxes, best_angle

    except Exception as e:
        print(f"Error: {e}")
        return None, None
