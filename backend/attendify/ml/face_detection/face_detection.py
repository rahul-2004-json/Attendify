import cv2
import numpy as np
from PIL import Image

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
        
        # Load the Haar cascade model
        detect_face_model = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

        test_image = image_pil

        # Loop through each rotation angle and detect faces
        for angle in angles:
            rotated_image_pil = image_pil.rotate(angle, resample=Image.BICUBIC, expand=True)
            image_np = np.array(rotated_image_pil)

            grayscale = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)  # Convert to grayscale
            
            # Detect faces
            faces = detect_face_model.detectMultiScale(grayscale, scaleFactor=scaleFactor, minNeighbors=minNeighbors)
            # print(faces)
            # bounding_boxes =[(x, y, w, h) for (x, y, w, h) in faces]
            bounding_boxes = faces
            
            # Track the rotation with the most detected faces
            if len(bounding_boxes) > max_faces:
                test_image = rotated_image_pil
                max_faces = len(bounding_boxes)
                best_angle = angle
                best_bounding_boxes = bounding_boxes

        # Draw bounding boxes on the best-rotated image
        image_np_best = np.array(test_image)
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