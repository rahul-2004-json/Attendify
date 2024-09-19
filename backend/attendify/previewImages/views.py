import cloudinary.uploader
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from db_connections import preview_images_collection  # MongoDB collection import
from ml.face_detection.face_detection import detect_faces_haar  # Face detection function import

@csrf_exempt
def fetch_preview_images(request):
    """
    API to upload multiple images, detect faces, and store metadata in MongoDB.
    """
    if request.method == 'POST':
        try:
            # Check if multiple image files are provided in the request
            if 'files' not in request.FILES:
                return JsonResponse({"error": "No image files uploaded"}, status=400)

            files = request.FILES.getlist('files')
            responses = []

            for image_file in files:
                # Upload the image to Cloudinary
                cloudinary_response = cloudinary.uploader.upload(image_file)
                image_url = cloudinary_response.get('secure_url')  # Cloudinary URL
                asset_id = cloudinary_response.get('asset_id')  # Cloudinary asset ID
                public_id = cloudinary_response.get('public_id')  # Cloudinary public ID

                # Run face detection on the image
                bounding_boxes, best_rotation_angle = detect_faces_haar(image_file)

                if bounding_boxes is None:
                    responses.append({
                        "asset_id": asset_id,
                        "error": "Face detection failed"
                    })
                    continue

                # Convert bounding boxes and best_rotation_angle to JSON format
                bounding_boxes = [[int(coord) for coord in bbox] for bbox in bounding_boxes]
                best_rotation_angle = int(best_rotation_angle)
                
                # data for MongoDB
                image_doc = {
                    "asset_id": asset_id,
                    "image_url": image_url,
                    "public_id": public_id,
                    "bboxes": [{"bbox": bbox} for bbox in bounding_boxes],
                    "best_rotation_angle": best_rotation_angle,
                    "timestamp": datetime.utcnow().isoformat()
                }

                # Insert the document into MongoDB
                preview_images_collection.insert_one(image_doc)

                # Append success response with Cloudinary data and bounding boxes
                responses.append({
                    "asset_id": asset_id,
                    "public_id": public_id,
                    "image_url": image_url,
                    "number of detected faces": len(bounding_boxes),
                    "bboxes": bounding_boxes,
                    "best_rotation_angle": best_rotation_angle
                })

            return JsonResponse({
                "message": "Images uploaded and processed successfully",
                "results": responses
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # Return error if not a POST request
    return JsonResponse({"error": "Invalid request method"}, status=400)
