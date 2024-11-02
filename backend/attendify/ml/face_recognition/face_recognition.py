import face_recognition
import cloudinary
import cloudinary.api
import numpy as np
from utils.loadImageFromUrl import load_image_from_url
from utils.augmentImage import augment_image
from utils.uploadImageToCloudinaryFolder import upload_images_to_cloudinary
from utils.For_ML.crop_face import crop_and_resize_face

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


def generate_all_encodings(enroll, cloudinary_folder_path, image_urls):
    """
    Function to generate face encodings for new students and update their records in the database.
    """
    try:
        # Initialize a list to hold encodings
        encodings = []

        first_image =  None

        # Process each image to generate face encodings
        for image_url in image_urls:
            # Load the image from Cloudinary
            np_image = load_image_from_url(image_url)


            # Normalize and crop the face from the image
            cropped_face = crop_and_resize_face(np_image)

            if first_image is None:
                first_image = cropped_face

            # Generate face encodings from the cropped face
            face_encodings = get_encodings(cropped_face)

            # Check if encodings were found
            if face_encodings is not None:
                encodings.append(face_encodings)

        # If only 1 image, augment the image and then generate encodings
        if len(image_urls) == 1:
            print("Augmenting image")
            np_image = first_image
            augmented_images = augment_image(np_image, 4)
            
            # Upload all augmented images at once
            # upload_images_to_cloudinary(
            #     image_list=augmented_images,
            #     folder_path=cloudinary_folder_path,
            #     enroll_id=enroll
            # )
            
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