import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import numpy as np
import face_recognition
from PIL import Image
from utils.loadImageFromUrl import load_image_from_url

students = None

@csrf_exempt
def mark_attendance_view(request):
    global students  # Declare students as global to modify the global variable
    """
    View to handle the attendance marking process using Cloudinary image URLs.
    """
    if request.method == 'POST':
        try:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON format"}, status=400)

            # Ensure the request contains the detections key
            if 'students' not in data or 'detections' not in data:
                return JsonResponse({"error": "No detections provided"}, status=400)

            # Get the list of students
            students = data.get('students', [])
            # Get the list of detections
            detections = data.get('detections', [])
            
            if not detections:
                return JsonResponse({"error": "No detections found"}, status=400)

            all_recognized_students = []  # List to hold results from all images

            # Process each detection
            for detection in detections:
                recognized_students = process_detection(detection)
                all_recognized_students.extend(recognized_students)  # Add recognized students to the overall list

            # only have unique students in the list
            all_recognized_students = [dict(t) for t in {tuple(d.items()) for d in all_recognized_students}]

            # print(all_recognized_students)

            return JsonResponse({
                "message": "Attendance marked successfully",
                "recognized_students": all_recognized_students
            }, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

def process_detection(detection):
    """
    Processes a single detection to match face encodings with the database.
    """
    recognized_students = []

    try:
        # Ensure necessary keys are present in detection
        if 'image_url' not in detection or 'face_locations' not in detection or 'best_rotation_angle' not in detection:
            return []

        image_url = detection['image_url']
        face_locations = detection['face_locations']
        rotation_angle = detection['best_rotation_angle']

        # Load image from URL
        image_np, image_pil = load_image_from_url(image_url)

        # Rotate the image based on the provided angle
        rotated_image_pil = image_pil
        rotated_image_np = image_np
        if rotation_angle != 0:
            rotated_image_pil = image_pil.rotate(rotation_angle, resample=Image.BICUBIC, expand=True)
            rotated_image_np = np.array(rotated_image_pil)

        # Encode faces based on the provided face locations
        face_encodings = face_recognition.face_encodings(rotated_image_np, face_locations)

        for face_encoding in face_encodings:
            matched_student = find_matching_student(face_encoding)

            if matched_student:
                recognized_students.append(matched_student)

    except Exception as e:
        print(f"Error processing detection for image: {detection.get('image_url', 'Unknown')}. Error: {str(e)}")

    return recognized_students


def find_matching_student(face_encoding, tolerance=0.55):
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

        # if min_distance < tolerance:
        #     best_match = {
        #         "enrollment": student["enrollment"],
        #         "name": student["name"],
        #         "batch": student["batch"],
        #         "distance": min_distance
        #     }
        #     lowest_distance = min_distance

        #     break
    
        # Update best_match if this student has the closest match so far
        if min_distance < lowest_distance:
            lowest_distance = min_distance
            best_match = {
                "enrollment": student["enrollment"],
                "name": student["name"],
                "batch": student["batch"],
                "distance": min_distance
            }


    # Check if a sufficiently close match was found
    # if best_match and lowest_distance <= 0.55:  # Adjust tolerance as needed
    #     return best_match
    if best_match and lowest_distance <= tolerance:
        print(f"Best match: {best_match}, Distance: {lowest_distance}")
        return best_match
    else:
        return None  # Return None if no match within tolerance is found    
