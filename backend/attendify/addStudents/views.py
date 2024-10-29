import json
import cloudinary.uploader
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from db_connections import students_collection
from ml.addNewKnownFaces.addNewKnownFace import add_new_known_faces  # Import face encoding function

@csrf_exempt
def add_students(request):
    """
    Function to add or update multiple students in the MongoDB 'students' collection,
    process their face encodings, and store images in Cloudinary.
    """
    if request.method == 'POST':
        try:
            # Extract student data from the request body
            data = json.loads(request.POST.get('data', '{}'))
            students_data = data.get('students', [])

            if not students_data:
                return JsonResponse({"error": "No student data provided"}, status=400)

            new_students = []  # To pass to the face encoding function

            for student in students_data:
                name = student.get('name')
                enroll = student.get('enroll')
                batch = student.get('batch')
                year = student.get('year')
                branch = student.get('branch', 'CSE')  # Default to 'CSE'

                # Validate required fields
                if not all([name, enroll, batch, year, branch]):
                    return JsonResponse({"error": "Missing required fields"}, status=400)

                # Check if image is provided (compulsory)
                image_file = request.FILES.get(str(enroll))  # Image file keyed by enrollment number
                if not image_file:
                    return JsonResponse({"error": f"Missing image for student {name}"}, status=400)

                # Upload the image to Cloudinary and get the URL
                cloudinary_response = cloudinary.uploader.upload(image_file)
                student_image_url = cloudinary_response.get('secure_url')

                # Prepare the student document
                student_doc = {
                    "name": name,
                    "enroll": int(enroll),
                    "batch": batch,
                    "year": int(year),
                    "student_image_url": student_image_url,
                    "branch": branch
                }

                # Update the student data if they already exist, or insert new if not
                students_collection.update_one(
                    {"enroll": int(enroll)},  # Filter by enrollment number
                    {"$set": student_doc},  # Overwrite the document with new data
                    upsert=True  # Insert if the document does not exist
                )

                # Add the student to the list for face recognition
                new_students.append({
                    "enroll": enroll,
                    "image_file": image_file
                })

            # Call the add_new_known_faces function to process face encodings (actual image is passed)
            add_new_known_faces(new_students)

            # Return success response
            return JsonResponse({"message": "Students added/updated and face encodings processed successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
