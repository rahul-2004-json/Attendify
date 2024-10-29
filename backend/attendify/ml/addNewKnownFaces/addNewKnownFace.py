import face_recognition
import pickle
import os

def add_new_known_faces(students):
    """
    Given a list of student dictionaries (each containing enroll and student_image_url),
    add their face encodings to the existing encodings.pickle file.
    
    :param students: List of student dictionaries with 'enroll' and 'student_image_url' keys.
    """
    new_encodings = []
    new_enroll_numbers = []

    for student in students:
        enroll = student.get('enroll')
        student_image_url = student.get('student_image_url')

        if not enroll or not student_image_url:
            print(f"Missing enrollment number or image URL for student: {student}")
            continue

        try:
            # Load the image from the provided URL
            image = face_recognition.load_image_file(student_image_url)

            # Get face encodings
            encodings = face_recognition.face_encodings(image)

            if encodings:
                # Use the first encoding
                new_encodings.append(encodings[0])
                new_enroll_numbers.append(enroll)
            else:
                print(f"No face detected for student with enrollment: {enroll}")
        except Exception as e:
            print(f"Error processing image for student with enrollment: {enroll}, Error: {e}")

    # Load existing encodings from pickle file (if it exists)
    encodings_file = 'encodings.pickle'
    if os.path.exists(encodings_file):
        with open(encodings_file, 'rb') as f:
            data = pickle.load(f)
            known_encodings = data.get('encodings', [])
            known_enroll_numbers = data.get('enrolls', [])
    else:
        known_encodings = []
        known_enroll_numbers = []

    # Append the new encodings to the existing encodings
    known_encodings.extend(new_encodings)
    known_enroll_numbers.extend(new_enroll_numbers)

    # Save the updated encodings and enroll numbers back to the pickle file
    with open(encodings_file, 'wb') as f:
        pickle.dump({"encodings": known_encodings, "enrolls": known_enroll_numbers}, f)

    print(f"New student face encodings added with enrollment numbers: {new_enroll_numbers}")


dict = {}

add_new_known_faces()