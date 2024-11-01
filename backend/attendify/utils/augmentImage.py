import cv2
import numpy as np
import random
from PIL import Image, ImageEnhance

def augment_image(image, num_augmented=5):
    """
    Generates augmented versions of a single image using rotation, scaling, color adjustment, etc.

    Parameters:
    image (numpy.ndarray): The original image to augment.
    num_augmented (int): Number of augmented images to generate.

    Returns:
    list: A list of augmented images as numpy arrays.
    """
    augmented_images = []

    for _ in range(num_augmented):
        aug_img = image.copy()

        # Random rotation
        angle = random.uniform(-30, 30)  # Rotate between -30 and 30 degrees
        (h, w) = aug_img.shape[:2]
        center = (w // 2, h // 2)
        rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
        aug_img = cv2.warpAffine(aug_img, rotation_matrix, (w, h))

        # Random scaling
        scale = random.uniform(0.9, 1.1)
        aug_img = cv2.resize(aug_img, None, fx=scale, fy=scale, interpolation=cv2.INTER_LINEAR)

        # Random brightness and contrast adjustments
        pil_img = Image.fromarray(cv2.cvtColor(aug_img, cv2.COLOR_BGR2RGB))  # Convert to PIL image
        enhancer_brightness = ImageEnhance.Brightness(pil_img)
        enhancer_contrast = ImageEnhance.Contrast(pil_img)
        pil_img = enhancer_brightness.enhance(random.uniform(0.8, 1.2))  # Adjust brightness
        pil_img = enhancer_contrast.enhance(random.uniform(0.8, 1.2))  # Adjust contrast
        aug_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)  # Convert back to OpenCV format

        # Add random horizontal flip
        if random.random() > 0.5:
            aug_img = cv2.flip(aug_img, 1)  # Horizontal flip

        augmented_images.append(aug_img)

    return augmented_images
