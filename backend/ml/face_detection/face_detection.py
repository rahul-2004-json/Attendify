import cv2
# import numpy as np
# import io
# from PIL import Image

# Database functions (to be replaced with your actual DB interaction)
# def fetch_image_from_db(image_id):
    # Placeholder function to fetch image from the database
    # image_blob = db_get_image_blob(image_id)
    # image = np.array(Image.open(io.BytesIO(image_blob)))
    # return image

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
        # Rotations to check
        angles = [0, 90, 180, 270]
        best_angle = 0
        max_faces = 0
        best_bounding_boxes = []

        # Loop through each rotation angle and detect faces
        for angle in angles:
            rotated_image = rotate_image(image, angle)
            grayscale = cv2.cvtColor(rotated_image, cv2.COLOR_BGR2GRAY)

            # Detect faces
            detect_face_model = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
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
