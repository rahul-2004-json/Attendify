import face_recognition
import cloudinary
import cloudinary.api
import numpy as np
from utils.loadImageFromUrl import load_image_from_url
from utils.augmentImage import augment_image
from utils.uploadImageToCloudinaryFolder import upload_images_to_cloudinary

def get_encodings(np_image):
    """
    Function to generate face encodings for a given image.
    
    Parameters:
    np_image (numpy.ndarray): The image in NumPy array format.
    """
    # Generate face encodings directly
    face_encodings = face_recognition.face_encodings(np_image)
    
    # If no faces are found, return None
    if not face_encodings:
        return None
    
    print("Encodings found");

    return face_encodings[0]  # Return the first (and assumed only) face encoding


def generate_all_encodings(enroll, cloudinary_folder_path):
    """
    Function to generate face encodings for new students and update their records in the database.
    """
    try:
        # Fetch images from Cloudinary folder
        resources = cloudinary.api.resources_by_asset_folder(cloudinary_folder_path, max_results=15)  # Adjust max_results as needed
        image_urls_in_folder = []

        for resource in resources['resources']:
            image_url = resource['secure_url']
            image_urls_in_folder.append(image_url)

        # Initialize a list to hold encodings
        encodings = []

        # Process each image to generate face encodings
        for image_url in image_urls_in_folder:
            # Load the image from cloudinary
            np_image = load_image_from_url(image_url)
            # Generate face encodings
            face_encodings = get_encodings(np_image)

            # Check if encodings were found
            if face_encodings is not None:
                encodings.append(face_encodings)

        # If only 1 image, augment the image and then generate encodings
        if len(image_urls_in_folder) == 1:
            print("Augmenting image")
            np_image = load_image_from_url(image_urls_in_folder[0])
            augmented_images = augment_image(np_image, 4)
            
            # Upload all augmented images at once
            upload_images_to_cloudinary(
                image_list=augmented_images,
                folder_path=cloudinary_folder_path,
                enroll_id=enroll
            )
            
            # Generate encodings for each augmented image
            for augmented_image in augmented_images:
                face_encodings = get_encodings(augmented_image)
                if face_encodings is not None:
                    encodings.append(face_encodings)

        # If no encodings were found, handle the case (e.g., log an error or skip updating)
        if not encodings:
            print(f"No face encodings found for student {enroll}.")
            return None

        # Convert encodings list to a numpy array
        encodings_array = np.array(encodings).tolist()  # Convert to list for MongoDB compatibility

        return encodings_array

    except Exception as e:
        print(f"Error processing student {enroll}: {str(e)}")