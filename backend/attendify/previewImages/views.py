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
            if 'files' not in request.FILES:
                return JsonResponse({"error": "No image files uploaded"}, status=400)

            files = request.FILES.getlist('files')
            responses = []

            for image_file in files:

                cloudinary_response = cloudinary.uploader.upload(image_file)
                image_url = cloudinary_response.get('secure_url') 
                asset_id = cloudinary_response.get('asset_id')  
                public_id = cloudinary_response.get('public_id') 

                # Run face detection on the image
                bounding_boxes, best_rotation_angle = detect_faces_haar(image_file)

                if bounding_boxes is None:
                    responses.append({
                        "asset_id": asset_id,
                        "error": "Face detection failed"
                    })
                    continue

                #Convert bounding boxes and best_rotation_angle to JSON format
                bounding_boxes = [[int(coord) for coord in bbox] for bbox in bounding_boxes]
                best_rotation_angle = int(best_rotation_angle)
                
                #Data creation for MongoDB
                image_doc = {
                    "asset_id": asset_id,
                    "image_url": image_url,
                    "public_id": public_id,
                    "bboxes": [{"bbox": bbox} for bbox in bounding_boxes],
                    "best_rotation_angle": best_rotation_angle,
                    "timestamp": datetime.utcnow().isoformat()
                }

               
                preview_images_collection.insert_one(image_doc)

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

    return JsonResponse({"error": "Invalid request method"}, status=400)
