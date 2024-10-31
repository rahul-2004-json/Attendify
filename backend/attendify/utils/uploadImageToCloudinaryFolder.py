import cv2
import cloudinary.uploader

def upload_images_to_cloudinary(image_list, folder_path, enroll_id):
    """
    Uploads a list of images to Cloudinary.

    Parameters:
    - image_list (list of numpy.ndarray): The images to upload, each in NumPy array format.
    - folder_path (str): The Cloudinary folder path to upload to.
    - enroll_id (str): Unique enrollment ID for naming each uploaded image.

    Returns:
    - list of dict: List of Cloudinary responses with details of each uploaded image.
    """
    responses = []
    for idx, image in enumerate(image_list):
        try:
            # Encode the image to JPG format
            _, image_bytes = cv2.imencode('.jpg', image)
            
            # Upload each image to Cloudinary with a unique public ID
            response = cloudinary.uploader.upload(
                image_bytes.tobytes(),
                folder=folder_path,
                public_id=f"{enroll_id}_aug_{idx + 1}",
                overwrite=True,
                resource_type="image"
            )
            responses.append(response)

        
        except Exception as e:
            print(f"Error uploading image {enroll_id}_aug_{idx + 1} to Cloudinary: {e}")
            
    print(f"Uploaded {len(responses)} images to Cloudinary folder {folder_path}")
    
    return responses
