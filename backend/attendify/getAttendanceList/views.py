from django.http import JsonResponse
from db_connections import students_collection
from django.views.decorators.csrf import csrf_exempt
import json

""" This is valid for query parameters, e.g.
http://127.0.0.1:8000/api/getAttendanceList/fetch_students/?year=2024&batch=B1&batch=B2&branch=CSE
"""

@csrf_exempt
def fetch_students(request):
    year = request.GET.get('year')
    batches = request.GET.getlist('batch')  # Get multiple batch values
    branch = request.GET.get('branch')

    if year is None or not batches or branch is None:
        return JsonResponse({"error": "Missing parameters"}, status=400)

    try:
        year = int(year)
    except ValueError:
        return JsonResponse({"error": "Invalid year parameter"}, status=400)

    # Query MongoDB for multiple batches
    students = students_collection.find({
        "year": year,
        "batch": {"$in": batches},  # Match any of the selected batches
        "branch": branch
    })

    student_list = [{"name": student['name'], "enroll": student['enroll']} for student in students]

    return JsonResponse({
        "students": student_list, 
        "msg": f"Students of year {year}, batches: {batches} and branch {branch} fetched successfully."}, 
        status=200
    )

""" This is valid for POST request using JSON data, csv will be parsed in the frontend and sent as JSON"""
@csrf_exempt
def upload_csv(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST method required"}, status=400)

    try:
        data = json.loads(request.body)
        enrollment_numbers = data.get('enrollments', [])
        
        if not enrollment_numbers:
            return JsonResponse({"error": "No enrollment numbers provided"}, status=400)

        # Query MongoDB for students with these enrollment numbers
        students = students_collection.find({
            "enroll": {"$in": enrollment_numbers}
        })

        student_list = [{"name": student['name'], "enroll": student['enroll']} for student in students]

        return JsonResponse({
            "students": student_list,
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)








"""
This is valid for POST request using form data
@csrf_exempt
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
"""


