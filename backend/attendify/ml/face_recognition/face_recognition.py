import face_recognition
import numpy as np
from utils.loadImageFromUrl import load_image_from_url
from utils.For_ML.augmentImage import augment_images
from utils.uploadImageToCloudinaryFolder import upload_images_to_cloudinary
from utils.For_ML.crop_face import crop_and_resize_face

def get_encodings(np_image, face_locations=None):
    """
    Generate face encodings for a given image and face locations.

    Parameters:
    np_image (numpy.ndarray): The image in NumPy array format.
    face_locations (list): Pre-detected face locations, if available.

    Returns:
    numpy.ndarray: The first face encoding, or None if no faces are found.
    """
    try:
        # Generate face encodings
        face_encodings = face_recognition.face_encodings(np_image, known_face_locations=face_locations)

        # If no encodings are found, return None
        if not face_encodings:
            return None

        # Return the first encoding
        return face_encodings[0]

    except Exception as e:
        print(f"Error generating encodings: {str(e)}")
        return None


def generate_all_encodings(enroll, cloudinary_folder_path, image_urls, target_encodings=100):
    """
    Generate a specified number of face encodings for a student, with diversity in augmentation.

    Parameters:
    enroll (str): Student enrollment ID.
    cloudinary_folder_path (str): Folder path for student images on Cloudinary.
    image_urls (list): List of image URLs for the student.
    target_encodings (int): Desired total number of encodings for the student.

    Returns:
    list: A list of `target_encodings` face encodings, or None if encodings cannot be generated.
    """
    try:
        # Initialize a list to hold encodings
        encodings = []
        cropped_images = []
        
        if not image_urls:  # Check if image_urls is empty
            print(f"No image URLs provided for student {enroll}.")
            return None

        i = 0
        # Process each image to generate face encodings
        for image_url in image_urls:
            i = i + 1
            print(f"Processing image {i} for student {enroll}...")

            # Load the image from Cloudinary
            np_image, _ = load_image_from_url(image_url)

            # Crop and resize the face from the image
            cropped_face, face_loc = crop_and_resize_face(np_image)

            # Ensure that cropped_face is valid
            if cropped_face is None:
                print(f"Failed to crop face for image URL: {image_url}")
                continue

            # Save valid cropped images
            cropped_images.append(cropped_face)

            # Generate face encodings from the cropped face
            face_encodings = get_encodings(np_image, face_loc)

            if face_encodings is None:
                print(f"No face encodings found for student {enroll} in image {i}.")
                continue

            # Append the face encodings to the list
            encodings.append(face_encodings)

            # Early stop if we reach the target encodings
            if len(encodings) >= target_encodings:
                print(f"Reached target encodings for student {enroll}.")
                break

        # # augment and encode to generate target_encodings
        remaining_encodings = target_encodings - len(encodings)
        if remaining_encodings > 0:
            print(f"Augmenting images to generate {remaining_encodings} more encodings.")
            augmented_encodings = augment_to_target_encodings(cropped_images, target_encodings, cloudinary_folder_path, enroll)

            if augmented_encodings:
                encodings.extend(augmented_encodings)

        # Ensure the final count matches the target
        if len(encodings) > target_encodings:
            encodings = encodings[:target_encodings]
        
        # If no encodings were found, handle the case (e.g., log an error or skip updating)
        if not encodings:
            print(f"No face encodings found for student {enroll}.")
        else :
            print(f"Face encodings generated for student {enroll}.")

        # Convert encodings list to a numpy array
        encodings_array = np.array(encodings).tolist()  # Convert to list for MongoDB compatibility

        return encodings_array

    except Exception as e:
        print(f"Error processing student {enroll}: {str(e)}")


def augment_to_target_encodings(cropped_images, target_encodings, cloudinary_folder_path, enroll):
    """
    Augment the cropped images to generate the remaining encodings.

    Parameters:
    cropped_images (list): List of cropped face images.
    target_encodings (int): Number of target encodings to generate.
    cloudinary_folder_path (str): Folder path for student images on Cloudinary.
    enroll (str): Student enrollment ID.

    Returns:
    list: A list of remaining face encodings, or None if encodings cannot be generated.
    """
    try:        
        # Initialize a list to hold augmented images with encodings
        augmented_images = []

        augmented_encodings = []

        # Calculate the number of remaining encodings to generate
        remaining_encodings = target_encodings - len(cropped_images)

        if(remaining_encodings <= 0):
            print(f"No need to augment images for student {enroll}.")
            return augmented_encodings

        ind = 0
        while(remaining_encodings > 0):
            image = cropped_images[ind%len(cropped_images)]
            ind = ind + 1

            augmented_image = augment_images(image, 1)[0]
            encodings = get_encodings(augmented_image)

            if encodings is not None:
                augmented_images.append(augmented_image)
                augmented_encodings.append(encodings)
                remaining_encodings = remaining_encodings - 1

        print(f"Generated {len(augmented_encodings)} augmented encodings for student {enroll}.")

        # Upload augmented images to Cloudinary
        print(f"Uploading augmented images for student {enroll}...")
        upload_images_to_cloudinary(
            image_list=augmented_images,
            folder_path=cloudinary_folder_path,
            enroll_id=enroll
        )

        return augmented_encodings

    except Exception as e:
        print(f"Error during augmentation: {str(e)}")
        return []