from django import forms
from .models import AttendanceImage

#This form allows the frontend to send image files to the backend
class ImageUploadForm(forms.ModelForm):
    class Meta:
        model = AttendanceImage
        fields = ['image']