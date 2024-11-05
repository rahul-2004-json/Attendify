from pymongo import MongoClient
import numpy as np
import face_recognition
from PIL import Image
import cv2
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ml.face_detection.face_detection import detect_faces_face_recognition
from db_connections import students_collection
import matplotlib.pyplot as plt


@csrf_exempt
def mark_attendance_view(request):
    """
    View to handle the attendance marking process.
    """
    if request.method == 'POST':
        try:
            # Ensure the request has an image file
            if 'image_file' not in request.FILES:
                return JsonResponse({"error": "No image file uploaded"}, status=400)

            # Get the uploaded image file
            image_files = request.FILES.getlist('image_file')

            all_recognized_students = []  # List to hold results from all images

            # Process each uploaded image file
            for image_file in image_files:
                recognized_students = mark_attendance(image_file)
                all_recognized_students.extend(recognized_students)  # Add recognized students to the overall list

            return JsonResponse({
                "message": "Attendance marked successfully",
                "recognized_students": all_recognized_students
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

def mark_attendance(image_file):
    """
    Detects faces in the image, encodes them, and matches them with the database for attendance marking.
    """
    # Detect faces in the uploaded image
    detected_faces, best_rotated_image = detect_faces_face_recognition(image_file)
    face_encodings = face_recognition.face_encodings(best_rotated_image,detected_faces)
    # print("Boxes Coordinates:",detected_faces)
    recognized_students = []

    if detected_faces:
        for face_encoding in face_encodings:
            # top, right, bottom, left = face_location
            # face_image = image_np[top:bottom, left:right]
            # cv2.imshow("face_image", face_image)
            # cv2.waitKey(0)
            # cv2.destroyAllWindows()
            # print("Face Image shape:", face_image.shape)
            # print("Face Image data type:", face_image.dtype)            
            
            # if face_encodings:
            # face_encoding = face_encoding[0]
            matched_student = find_matching_student(face_encoding)

            if matched_student:
                recognized_students.append(matched_student)

    print("Recognized students:", recognized_students)
    return recognized_students

def find_matching_student(face_encoding):
    """
    Matches a given face encoding with student records in the database and selects the student
    with the highest similarity (lowest face distance).
    """
    students = students_collection.find({})
    best_match = None
    lowest_distance = float("inf")  # Initialize with a very high distance

    for student in students:
        student_encodings = np.array(student['encodings'])

        # Calculate distances between the face encoding and each of the student's encodings
        distances = face_recognition.face_distance(student_encodings, face_encoding)

        # Get the minimum distance for this student
        min_distance = min(distances)

        # Update best_match if this student has the closest match so far
        if min_distance < lowest_distance:
            lowest_distance = min_distance
            best_match = {
                "enrollment": student["enroll"],
                "name": student["name"],
                "batch": student["batch"],
                "distance": min_distance
            }

    # Check if a sufficiently close match was found
    if best_match and lowest_distance <= 0.5:  # Adjust tolerance as needed
        return best_match
    else:
        return None  # Return None if no match within tolerance is found

# Example usage
# image_file = "path_to_image.jpg"
# recognized_students = mark_attendance(image_file)
# print("Recognized students:", recognized_students)
