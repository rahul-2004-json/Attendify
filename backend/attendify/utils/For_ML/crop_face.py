import cv2
import face_recognition

def crop_and_resize_face(np_image):
    """
    Resize, normalize, and preprocess the image for face cropping.

    Parameters:
    np_image (numpy.ndarray): The original image in NumPy array format.

    Returns:
    numpy.ndarray: Cropped face as a NumPy array, or None if no faces found.
    list of tuple: Face location coordinates [(top, right, bottom, left)] wrt to given image.
    """
    try:
        # Initial resize for faster detection (optional, e.g., resize if width > 800)
        if np_image.shape[1] > 800:
            np_image = cv2.resize(np_image, (800, int(800 * np_image.shape[0] / np_image.shape[1])))

        # Detect faces in the resized image
        face_locations = face_recognition.face_locations(np_image)

        # If no faces are detected, return None
        if not face_locations:
            print("No faces detected in the image.")
            return None, None

        # Get the first detected face
        top, right, bottom, left = face_locations[0]

        # Crop the detected face region
        cropped_face = np_image[top:bottom, left:right]

        # Resize cropped face to standard size (e.g., 224x224)
        cropped_face = cv2.resize(cropped_face, (224, 224))

        return cropped_face, [face_locations[0]]

    except Exception as e:
        print(f"Error during face cropping: {str(e)}")
        return None
