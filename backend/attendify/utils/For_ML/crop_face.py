import cv2
import face_recognition

def crop_and_resize_face(np_image):
    """
    Resize, normalize, and preprocess the image for face cropping.

    Parameters:
    np_image (numpy.ndarray): The original image in NumPy array format.

    Returns:
    list: Cropped faces as NumPy arrays, or None if no faces found.
    """
    # Initial resize for faster detection (optional, e.g., resize if width > 800)
    np_image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
    if np_image.shape[1] > 800:
        np_image = cv2.resize(np_image, (800, int(800 * np_image.shape[0] / np_image.shape[1])))

    # Detect faces in the resized image
    np_image = cv2.cvtColor(np_image, cv2.COLOR_BGR2RGB)
    face_location = face_recognition.face_locations(np_image)[0]

    # If no faces are detected, return None
    if not face_location:
        return None

    # Crop the detected face region
    top, right, bottom, left = face_location
    cropped_face = np_image[top:bottom, left:right]

    # Resize cropped face to standard size (e.g., 224x224)
    cropped_face = cv2.cvtColor(cropped_face, cv2.COLOR_RGB2BGR)
    cropped_face = cv2.resize(cropped_face, (224, 224))

    cropped_face = cv2.cvtColor(cropped_face, cv2.COLOR_BGR2RGB)
    return cropped_face
