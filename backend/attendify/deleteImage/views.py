import cloudinary.uploader
from bson import ObjectId
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from db_connections import preview_images_collection  # MongoDB collection

@csrf_exempt
def delete_image(request):
    """
    API to delete an image both from Cloudinary and MongoDB.
    """
    if request.method == 'DELETE':
        try:
            # Parse the request body for object_id and public_id
            data = json.loads(request.body)
            object_id = data.get('object_id')
            public_id = data.get('public_id')

            if not object_id or not public_id:
                return JsonResponse({"error": "Missing object_id or public_id"}, status=400)

            # Delete the image from Cloudinary
            cloudinary_response = cloudinary.uploader.destroy(public_id)
            if cloudinary_response.get("result") != "ok":
                return JsonResponse({"error": "Failed to delete image from Cloudinary"}, status=500)

            # Delete the corresponding document from MongoDB
            result = preview_images_collection.delete_one({"_id": ObjectId(object_id)})

            if result.deleted_count == 0:
                return JsonResponse({"error": "Document not found in MongoDB"}, status=404)

            # Return success response
            return JsonResponse({"message": "Image and document deleted successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # Return error if not a DELETE request
    return JsonResponse({"error": "Invalid request method"}, status=400)
