import requests
import numpy as np
from PIL import Image
from io import BytesIO

# Fetch the image from the URL
def load_image_from_url(url):
    response = requests.get(url)
    
    # Use BytesIO to treat the response content as a file-like object
    image_pil = Image.open(BytesIO(response.content)).convert("RGB")
    
    # Convert the PIL image to a NumPy array
    image_np = np.array(image_pil)

    print("Image loaded successfully.")

    # # print image dimensions and size
    # print("Image dimensions:", image_np.shape)
    # print("Image size:", image_np.size)
    
    # # Convert RGB to BGR for OpenCV
    # image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    # # Resize the image for better display (adjust width as needed)
    # height, width = image_np.shape[:2]
    # new_height = 500  # Desired height
    # new_width = int((new_height / height) * width)  # Maintain
    # resized_image = cv2.resize(image_bgr, (new_width, new_height))

    # # Display the resized image using OpenCV
    # cv2.imshow("Image from URL", resized_image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    return image_np, image_pil