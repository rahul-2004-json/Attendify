from django.http import JsonResponse
from db_connections import students_collection
from django.views.decorators.csrf import csrf_exempt
import json

# This is valid for POST request using form data
@csrf_exempt
def add_students(request):
    """
    Function to add multiple students to the MongoDB 'students' collection.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Extract the list of students from the JSON data
            students_data = data.get('students', [])

            student_docs = []
            for student in students_data:

                name = student.get('name')
                enroll = student.get('enroll')
                batch = student.get('batch')
                year = student.get('year')
                student_image_url = student.get('student_image_url')
                branch = student.get('branch', 'CSE')  # Default to 'CSE'

                # Validate required fields for each student
                if not all([name, enroll, batch, year, student_image_url, branch]):
                    return JsonResponse({"error": "Missing required fields"}, status=400)

                student_doc = {
                    "name": name,
                    "enroll": int(enroll),
                    "batch": batch,
                    "year": int(year),
                    "student_image_url": student_image_url,  # Cloudinary URL
                    "branch": branch
                }

                student_docs.append(student_doc)

            # Insert the list of student documents into the collection
            students_collection.insert_many(student_docs)

            # Return success response
            return JsonResponse({"message": "Students added successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # If the request method is not POST, return an error
    return JsonResponse({"error": "Invalid request method"}, status=400)



""" This is valid for query parameters, but supports only single addition of student e.g.
http://localhost:8000/getAttendanceList/fetch_students/?year=2024&batch=A&branch=CSE

@csrf_exempt
def fetch_students(request):
    year = request.GET.get('year')
    batch = request.GET.get('batch')
    branch = request.GET.get('branch')

    if year is None or batch is None or branch is None:
        return JsonResponse({"error": "Missing parameters"}, status=400)

    try:
        year = int(year)
    except ValueError:
        return JsonResponse({"error": "Invalid year parameter"}, status=400)

    # Query MongoDB collection
    students = students_collection.find({
        "year": year,
        "batch": batch,
        "branch": branch
    })

    student_list = [{"name": student['name'], "enroll": student['enroll']} for student in students]

    return JsonResponse({"students": student_list}, status=200)
"""