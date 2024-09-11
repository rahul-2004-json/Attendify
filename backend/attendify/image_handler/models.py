#This is for local storage
from django.db import models

class AttendanceImage(models.Model):
    image = models.ImageField(upload_to='images/')  # Save images to 'images/' folder
    timestamp = models.DateTimeField(auto_now_add=True)  # Automatically store upload time

    def __str__(self):
        return f"Image uploaded at {self.timestamp}"


# from django.db import models

# class UploadedImage(models.Model):
#     image = models.ImageField(upload_to='images/')
#     # Add a new field
#     description = models.CharField(max_length=255, blank=True, null=True)
#     # Modify an existing field
#     #image = models.ImageField(upload_to='updated_images/')
