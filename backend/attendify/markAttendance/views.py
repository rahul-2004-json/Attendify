import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import numpy as np
import face_recognition
from ml.face_detection.face_detection import detect_faces_face_recognition
from utils.loadImageFromUrl import load_image_from_url
from db_connections import students_collection

students = students_collection.find({})
students = list(students)

@csrf_exempt
def mark_attendance_view(request):
    """
    View to handle the attendance marking process using Cloudinary image URLs.
    """
    if request.method == 'POST':
        try:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON format"}, status=400)

            # Ensure the request contains the URLs
            if 'image_urls' not in data:
                return JsonResponse({"error": "No image URLs provided"}, status=400)

            # Get the list of Cloudinary image URLs
            image_urls = data.get('image_urls', [])
            
            if not image_urls:
                return JsonResponse({"error": "No image URLs found"}, status=400)

            all_recognized_students = []  # List to hold results from all images

            # Process each Cloudinary URL
            for image_url in image_urls:
                recognized_students = mark_attendance(image_url)
                all_recognized_students.extend(recognized_students)  # Add recognized students to the overall list

            # only have unique students in the list
            all_recognized_students = [dict(t) for t in {tuple(d.items()) for d in all_recognized_students}]

            return JsonResponse({
                "message": "Attendance marked successfully",
                "recognized_students": all_recognized_students
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

def mark_attendance(image_url):
    """
    Detects faces in the image from Cloudinary URL, encodes them, and matches them with the database for attendance marking.
    """
    # Fetch image from Cloudinary URL
    _, image_pil = load_image_from_url(image_url)
    
    # Detect faces in the image
    face_locations, best_rotated_image, _ = detect_faces_face_recognition(image_pil)
    face_encodings = face_recognition.face_encodings(best_rotated_image, face_locations)
    recognized_students = []

    if face_locations:
        for face_encoding in face_encodings:
            matched_student = find_matching_student(face_encoding)

            if matched_student:
                recognized_students.append(matched_student)

    return recognized_students

def find_matching_student(face_encoding):
    """
    Matches a given face encoding with student records in the database and selects the student
    with the highest similarity (lowest face distance).
    """
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
