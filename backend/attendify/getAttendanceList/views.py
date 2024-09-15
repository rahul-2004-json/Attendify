from django.http import JsonResponse
from db_connections import students_collection
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt  # Only if you want to disable CSRF for this view; ensure it's safe in your context
def fetch_students(request):
    if request.method == 'POST':
        # Extract data from the form
        year = request.POST.get('year')
        batch = request.POST.get('batch')
        branch = request.POST.get('branch')

        # Check for missing parameters
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
    
    return JsonResponse({"error": "Invalid request method"}, status=405)



@csrf_exempt
def add_student(request):
    """
    Function to add a new student to the MongoDB 'students' collection.
    """
    if request.method == 'POST':
        try:
            # Extract data from the POST request
            name = request.POST.get('name')
            enroll = request.POST.get('enroll')
            batch = request.POST.get('batch')
            year = request.POST.get('year')
            student_image = request.POST.get('student_image')
            branch = request.POST.get('branch', 'CSE')  # Default to 'CSE' if not provided

            # Validate required fields
            # if not all([name, enroll, batch, year, student_image]):
            #     return JsonResponse({"error": "Missing required fields"}, status=400)

            # Create the student document to be inserted into MongoDB
            student_doc = {
                "name": name,
                "enroll": enroll,
                "batch": batch,
                "year": int(year),  # Ensure year is an integer
                "student_image": student_image,  # This can be a URL or image path
                "branch": branch
            }

            # Insert the student into MongoDB
            students_collection.insert_one(student_doc)

            # Return success response
            return JsonResponse({"message": "Student added successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # If the request method is not POST, return an error
    return JsonResponse({"error": "Invalid request method"}, status=400)