import cv2
import numpy as np
from PIL import Image

def rotate_image(image, angle):
    """Rotate the image by a specified angle."""
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated_image = cv2.warpAffine(image, matrix, (w, h), flags=cv2.INTER_CUBIC)
    return rotated_image

def detect_faces_haar(image_file, scaleFactor=1.1, minNeighbors=7):
    """Detect faces using Haar Cascade in multiple orientations, returning the best result."""
    try:
        # Load the image using PIL
        image_pil = Image.open(image_file)
        image_np = np.array(image_pil)
        # Convert the RGB image (from PIL) to BGR for OpenCV compatibility
        image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

        # Rotations to check
        angles = [0, 90, 180, 270]
        best_angle = 0
        max_faces = 0
        best_bounding_boxes = []
        
        # Load the Haar cascade model
        detect_face_model = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

        test_image = image_bgr

        # Loop through each rotation angle and detect faces
        for angle in angles:
            rotated_image = rotate_image(image_bgr, angle)
            grayscale = cv2.cvtColor(rotated_image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
            
            # Detect faces
            faces = detect_face_model.detectMultiScale(grayscale, scaleFactor=scaleFactor, minNeighbors=minNeighbors)
            bounding_boxes = [(x, y, x + w, y + h) for (x, y, w, h) in faces]
            
            # Track the rotation with the most detected faces
            if len(bounding_boxes) > max_faces:
                test_image = rotated_image
                max_faces = len(bounding_boxes)
                best_angle = angle
                best_bounding_boxes = bounding_boxes

        for (x, y, w, h) in best_bounding_boxes:
            cv2.rectangle(test_image, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        # Display the image with bounding boxes
        cv2.imshow("Detected Faces", test_image)
        cv2.waitKey(0)  # Wait for a key press to close the window
        cv2.destroyAllWindows()

        # Save the image with bounding boxes
        output_path = './output/output_with_faces.jpg'
        cv2.imwrite(output_path, test_image)

        # print(test_image)

        # Return the best bounding boxes and rotation angle
        return best_bounding_boxes, best_angle

    except Exception as e:
        print(f"Error: {e}")
        return None, None