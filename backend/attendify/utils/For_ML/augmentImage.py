import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def augment_images(image, num_augmented=5):
    """
    Generates augmented versions of a single image using Keras ImageDataGenerator.

    Parameters:
    image (numpy.ndarray): The original image to augment.
    num_augmented (int): Number of augmented images to generate.

    Returns:
    list: A list of augmented images as numpy arrays.
    """
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
    for i in range(num_augmented):
        # Generate one augmented image
        aug_iter = datagen.flow(image, batch_size=1)
        augmented_image = next(aug_iter)[0].astype(np.uint8)
        
        # Convert to 3D shape (height, width, channels) for saving
        augmented_image = augmented_image.reshape(augmented_image.shape[0], augmented_image.shape[1], 3)
        augmented_images.append(augmented_image)

    return augmented_images
