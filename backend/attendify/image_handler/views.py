# Normal way to store using forms / Django ORM 
# from django.shortcuts import render, redirect
# from django.http import JsonResponse
# from .forms import ImageUploadForm
# from django.views.decorators.csrf import csrf_exempt
# @csrf_exempt


# def upload_images(request):
#     if request.method == 'POST':
#         form = ImageUploadForm(request.POST, request.FILES)
#         if form.is_valid():
#             form.save()  # Save the image to the database
#             return JsonResponse({"message": "Image uploaded successfully!"}, status=200)
#         else:
#             return JsonResponse({"error": form.errors}, status=400)
    
#     return JsonResponse({"message": "Invalid request"}, status=400)



# Using pymongo + MongoDB
import pymongo
from django.http import JsonResponse,HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from bson.binary import Binary
from bson.objectid import ObjectId
from db_connections import images_collection  # Your MongoDB collection

@csrf_exempt
def upload_images(request):
    if request.method == 'POST':
        # Check if files are included in the request
        if 'image' not in request.FILES:
            return JsonResponse({"error": "No image uploaded"}, status=400)

        image = request.FILES['image']
        filename = image.name
        content_type = image.content_type
        
        # Read the image file and store it as binary data
        image_data = image.read()

        # Store the binary data in MongoDB along with metadata
        image_doc = {
            'filename': filename,
            'content_type': content_type,
            'data': Binary(image_data),
        }

        # Insert the image document into the collection
        result = images_collection.insert_one(image_doc)

        return JsonResponse({
            "message": "Image uploaded successfully!",
            "image_id": str(result.inserted_id)
        }, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)


def view_image(request, image_id):
    try:
        # Retrieve the image document from MongoDB using the image_id
        image_doc = images_collection.find_one({'_id': ObjectId(image_id)})
        
        if image_doc:
            # Serve the image data as HTTP response
            response = HttpResponse(image_doc['data'], content_type=image_doc['content_type'])
            #The Content-Disposition header is set to inline to display the image directly in the browser instead of forcing a download.
            response['Content-Disposition'] = f'inline; filename="{image_doc["filename"]}"'
            return response
        else:
            return JsonResponse({"error": "Image not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)