import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import cv2

def augment_images(image, num_augmented=5):
    """
    Generates augmented versions of a single image using Keras ImageDataGenerator.

    Parameters:
    image (numpy.ndarray): The original image to augment.
    num_augmented (int): Number of augmented images to generate.

    Returns:
    list: A list of augmented images as numpy arrays.
    """

    # Ensure the image is in RGB format
    if image.shape[-1] == 3 and isinstance(image, np.ndarray):
        # Convert BGR to RGB if necessary
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Uncomment this if images are BGR
    
    # Reshape the image to add an additional dimension for the generator
    image = image.reshape((1,) + image.shape)  # shape: (1, height, width, channels)

    # Create an ImageDataGenerator instance with adjusted augmentations
    datagen = ImageDataGenerator(
        rotation_range=10,  # Rotate images in the range (degrees)
        width_shift_range=0.1,  # Translate images horizontally (fraction of total width)
        height_shift_range=0.1,  # Translate images vertically (fraction of total height)
        shear_range=0.1,  # Shear intensity
        zoom_range=0.1,  # Randomly zoom into images
        horizontal_flip=True,  # Randomly flip images
        fill_mode='nearest'  # Fill empty pixels after transformations
    )

    augmented_images = []

    # Generate augmented images
    for _ in range(num_augmented):
        # Generate one augmented image and convert it back to uint8
        aug_iter = datagen.flow(image, batch_size=1)
        augmented_image = next(aug_iter)[0].astype(np.uint8)
        augmented_images.append(augmented_image)

    return augmented_images
