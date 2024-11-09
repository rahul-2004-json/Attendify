from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from db_connections import preview_images_collection  # MongoDB collection import
from ml.face_detection.face_detection import detect_faces_face_recognition  # Face detection function import
from utils.loadImageFromUrl import load_image_from_url  # Image loading function import

@csrf_exempt
def fetch_preview_images(request):
    """
    API to upload multiple images, detect faces, and store metadata in MongoDB.
    """
    if request.method == 'POST':
        try:
            # Expecting JSON payload with a list of URLs
            data = request.json()  # Ensure request content type is application/json
            image_urls = data.get('urls', [])

            if not image_urls:
                return JsonResponse({"error": "No URLs provided."}, status=400)

            responses = []

            for image_url in image_urls:
                # Load the image using load_from_url function (returns a NumPy image)
                np_image, image_pil = load_image_from_url(image_url)
                if np_image is None:
                    responses.append({"error": f"Failed to fetch image from URL: {image_url}"})
                    continue

                # Run face detection on the image file
                face_locations, _, best_rotation_angle = detect_faces_face_recognition(image_pil)

                if face_locations is None:
                    responses.append({
                        "error": "Face detection failed"
                    })
                    continue

                # Convert face_locations and best_rotation_angle to JSON format
                face_locations = [[int(coord) for coord in floc] for floc in face_locations]
                best_rotation_angle = int(best_rotation_angle)

                responses.append({
                    "image_url": image_url,
                    "number_of_detected_faces": len(face_locations),
                    "face_locations": face_locations,
                    "best_rotation_angle": best_rotation_angle
                })

            return JsonResponse({
                "message": "Images processed successfully",
                "results": responses
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
