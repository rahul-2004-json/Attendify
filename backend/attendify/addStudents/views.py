import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from db_connections import students_collection
from ml.face_recognition.face_recognition import generate_all_encodings

@csrf_exempt
def add_students(request):
    """
    Function to add or update multiple students in the MongoDB 'students' collection,
    process their face encodings, and store images in Cloudinary.
    """
    if request.method == 'POST':
        try:
            # Extract student data from the request body
            data = json.loads(request.body)  # Get raw body directly
            students_data = data.get('students', [])

            if not students_data:
                return JsonResponse({"error": "No student data provided"}, status=400)

            for student in students_data:
                name = student.get('name')
                enroll = student.get('enroll')
                batch = student.get('batch')
                year = student.get('year')
                branch = student.get('branch', 'CSE')  # Default to 'CSE'
                cloudinary_folder_path = student.get('folder_url')
                image_urls = student.get('image_urls', [])


                # Validate required fields
                if not all([name, enroll, batch, year, branch, cloudinary_folder_path,image_urls]):
                    return JsonResponse({"error": "Missing required fields"}, status=400)
                
                # Get the face encodings for the student
                encodings = generate_all_encodings(enroll, cloudinary_folder_path,image_urls)
                if(encodings == None):
                   encodings = []

                # Prepare the student document
                student_doc = {
                    "name": name,
                    "enroll": int(enroll),
                    "batch": batch,
                    "year": int(year),
                    "cloudinary_folder_url": cloudinary_folder_path,  # Use folder URL
                    "branch": branch,
                    "encodings": encodings  # Add the face encodings
                }
                
                # Update the student data if they already exist, or insert new if not
                students_collection.update_one(
                    {"enroll": int(enroll)},  # Filter by enrollment number
                    {"$set": student_doc},  # Overwrite the document with new data
                    upsert=True  # Insert if the document does not exist
                )
                
            # Return success response
            return JsonResponse({"message": "Students added/updated and face encodings processed successfully!"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
