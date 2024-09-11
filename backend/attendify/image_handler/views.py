from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import ImageUploadForm
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt


def upload_images(request):
    if request.method == 'POST':
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()  # Save the image to the database
            return JsonResponse({"message": "Image uploaded successfully!"}, status=200)
        else:
            return JsonResponse({"error": form.errors}, status=400)
    
    return JsonResponse({"message": "Invalid request"}, status=400)
