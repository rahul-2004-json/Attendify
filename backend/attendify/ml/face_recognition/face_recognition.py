import face_recognition
import pickle
import os
import numpy as np
from PIL import Image
from face_detection.face_detection import detect_faces_haar # Assuming the detect_faces_haar is in a file named detect_faces_haar.py

def add_new_known_faces(students, image_file):
    """
    Given a list of student dictionaries (each containing enroll) and the class image file,
    detect faces, add their face encodings to the existing encodings.pickle file.

    :param students: List of student dictionaries with 'enroll' keys.
    :param image_file: Class image file (path to the image).
    """
    
    # Step 1: Detect faces using the detect_faces_haar function
    bounding_boxes, best_angle = detect_faces_haar(image_file)

    if bounding_boxes is None or len(bounding_boxes) == 0:
        print("No faces detected in the image.")
        return

    # Step 2: Rotate the image to the best angle for face recognition
    image_pil = Image.open(image_file).rotate(best_angle, resample=Image.BICUBIC, expand=True)
    image_np = np.array(image_pil)

    new_encodings = []
    new_enroll_numbers = []

    for i, student in enumerate(students):
        enroll = student.get('enroll')

        if not enroll:
            print(f"Missing enrollment number for student: {student}")
            continue

        try:
            # Extract the bounding box for the student's face
            if i < len(bounding_boxes):
                (x, y, w, h) = bounding_boxes[i]
                face_image = image_np[y:y+h, x:x+w]

                # Step 3: Get face encodings for the detected face
                face_encoding = face_recognition.face_encodings(face_image)

                if face_encoding:
                    new_encodings.append(face_encoding[0])
                    new_enroll_numbers.append(enroll)
                else:
                    print(f"No face encoding found for student with enrollment: {enroll}")

            else:
                print(f"No bounding box for student with enrollment: {enroll}")

        except Exception as e:
            print(f"Error processing face for student with enrollment: {enroll}, Error: {e}")

    # Step 4: Load existing encodings from pickle file (if it exists)
    encodings_file = 'encodings.pickle'
    if os.path.exists(encodings_file):
        with open(encodings_file, 'rb') as f:
            data = pickle.load(f)
            known_encodings = data.get('encodings', [])
            known_enroll_numbers = data.get('enrolls', [])
    else:
        known_encodings = []
        known_enroll_numbers = []

    # Step 5: Append the new encodings to the existing encodings
    known_encodings.extend(new_encodings)
    known_enroll_numbers.extend(new_enroll_numbers)

    # Step 6: Save the updated encodings and enroll numbers back to the pickle file
    with open(encodings_file, 'wb') as f:
        pickle.dump({"encodings": known_encodings, "enrolls": known_enroll_numbers}, f)

    print(f"New student face encodings added with enrollment numbers: {new_enroll_numbers}")

