import face_recognition
import pickle
import os
from PIL import Image
import numpy as np

def add_new_known_faces(new_students):
    """
    Given a list of student dictionaries (each containing enroll and image_file),
    add their face encodings to the existing encodings.pickle file.
    """
    new_encodings = []
    new_enroll_numbers = []

    # Load existing encodings from the pickle file (if it exists)
    encodings_file = 'encodings.pickle'
    if os.path.exists(encodings_file):
        with open(encodings_file, 'rb') as f:
            data = pickle.load(f)
            known_encodings = data.get('encodings', [])
            known_enroll_numbers = data.get('enrolls', [])
    else:
        known_encodings = []
        known_enroll_numbers = []

    for student in new_students:
        enroll = student.get('enroll')
        image_file = student.get('image_file')

        if not enroll or not image_file:
            print(f"Missing enrollment number or image for student: {student}")
            continue

        try:
            # Load the image file using Pillow
            image_pil = Image.open(image_file)

            # Convert the image to RGB format
            image_pil = image_pil.convert('RGB')  # Ensure it's in RGB format

            # Convert Pillow image to numpy array for face_recognition
            image_np = np.array(image_pil)

            print(f"Image numpy array dtype: {image_np.dtype}, shape: {image_np.shape}")
            if image_np.dtype != np.uint8 or image_np.ndim != 3:
                print(f"Unsupported image type for enrollment: {enroll}. Skipping.")
                continue

            # Get face encodings from the numpy array
            encodings = face_recognition.face_encodings(image_np)

            if encodings:
                # Use the first encoding (one face per image)
                face_encoding = encodings[0]

                # Check if the student already has an encoding (based on enrollment number)
                if enroll in known_enroll_numbers:
                    # Update the existing encoding
                    index = known_enroll_numbers.index(enroll)
                    known_encodings[index] = face_encoding
                    print(f"Updated encoding for student with enrollment: {enroll}")
                else:
                    # Add new encoding
                    new_encodings.append(face_encoding)
                    new_enroll_numbers.append(enroll)
                    print(f"Added new encoding for student with enrollment: {enroll}")
            else:
                print(f"No face detected for student with enrollment: {enroll}")
        except Exception as e:
            print(f"Error processing image for student with enrollment: {enroll}, Error: {e}")

    # Append new encodings to the existing encodings
    if new_encodings:
        known_encodings.extend(new_encodings)
        known_enroll_numbers.extend(new_enroll_numbers)

    # Save the updated encodings and enroll numbers back to the pickle file
    with open(encodings_file, 'wb') as f:
        pickle.dump({"encodings": known_encodings, "enrolls": known_enroll_numbers}, f)

    print(f"Encodings updated. Total known students: {len(known_enroll_numbers)}")


# Test the function
new_students = []
with open(r"C:\Users\ansh bansal\Downloads\image.png", "rb") as img:
    new_students.append({"enroll": "123456", "image_file": img})
    add_new_known_faces(new_students)
