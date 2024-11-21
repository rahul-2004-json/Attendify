import cv2 # type: ignore
import numpy as np
from PIL import Image, ImageDraw
import face_recognition

def draw_face_locations_and_display(image_pil, face_locations):
    """Draw bounding boxes around detected faces."""
    # Create a PIL drawing object to draw the face locations
    draw = ImageDraw.Draw(image_pil)

    # Loop through each face found in the image and draw a box around it
    for (top, right, bottom, left) in face_locations:
        draw.rectangle([left, top, right, bottom], outline="red", width=5)

    # Convert the PIL image to NumPy array for OpenCV display
    image_np = np.array(image_pil)
    # Convert back to BGR format for display with OpenCV
    image_np_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    # Resize the image for better display (adjust width as needed)
    height, width = image_np_bgr.shape[:2]
    new_height = 500  # Desired height
    new_width = int((new_height / height) * width)  # Maintain aspect ratio
    resized_image = cv2.resize(image_np_bgr, (new_width, new_height))

    # Display the image with bounding boxes
    cv2.imshow("Detected Faces", resized_image)
    cv2.waitKey(0)  # Wait for a key press to close the window
    cv2.destroyAllWindows()

def detect_faces_face_recognition(image_pil):
    """Detect faces using face_recognition library with multiple rotations to find the best angle."""
    try:
        # Rotations to check
        angles = [0, 90, 180, 270]
        best_rotated_image = None
        best_rotated_image_pil = None
        best_angle = 0
        max_faces = 0
        best_face_locations = []

        # Loop through each rotation angle and detect faces
        for angle in angles:
            rotated_image_pil = image_pil.rotate(angle, resample=Image.BICUBIC, expand=True)
            image_np = np.array(rotated_image_pil)  # Convert to numpy array for face_recognition

            # Detect faces using face_recognition
            face_locations = face_recognition.face_locations(image_np, model="hog")
            
            # Track the rotation with the most detected faces
            if len(face_locations) > max_faces:
                best_angle = angle
                max_faces = len(face_locations)
                best_rotated_image = image_np
                best_rotated_image_pil = rotated_image_pil
                best_face_locations = face_locations

        # # Draw bounding boxes on the best-rotated image
        # draw_face_locations_and_display(best_rotated_image_pil, best_face_locations)

        # Return the best face locations, best rotated image and rotation angle
        return best_face_locations, best_rotated_image, best_angle

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
        best_face_locations = []
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
                best_face_locations = bounding_boxes
        
        # # Draw bounding boxes on the best-rotated image
        # for (x, y, w, h) in best_face_locations:
        #     cv2.rectangle(image_np_best, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # # Convert back to BGR format for display with OpenCV
        # image_np_best_bgr = cv2.cvtColor(image_np_best, cv2.COLOR_RGB2BGR)

        # # Resize the image for better display (adjust width as needed)
        # height, width = image_np_best_bgr.shape[:2]
        # new_height = 500  # Desired height
        # new_width = int((new_height / height) * width)  # Maintain
        # resized_image = cv2.resize(image_np_best_bgr, (new_width, new_height))

        # # Display the image with bounding boxes
        # cv2.imshow("Detected Faces", resized_image)
        # cv2.waitKey(0)  # Wait for a key press to close the window
        # cv2.destroyAllWindows() 

        # Return the best bounding boxes and rotation angle
        return best_face_locations, best_angle

    except Exception as e:
        print(f"Error: {e}")
        return None, None
