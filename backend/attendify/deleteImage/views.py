from django.shortcuts import render
from django.http import JsonResponse
import cloudinary.uploader

def delete_image(request, public_id):
    try:
        result = cloudinary.uploader.destroy(public_id)
        
        if result['result'] == 'ok':
            return JsonResponse({'status': 'success', 'message': 'Image deleted successfully.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Failed to delete image.'})
    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
