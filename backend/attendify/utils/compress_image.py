from PIL import Image
import os

def compress_image(input_image_path, max_width=899, max_height=1599, compression_quality=85):
    """
    Compresses an image by resizing it and reducing its quality.

    Parameters:
        input_image_path (str): Path to the input image.
        max_width (int): Maximum allowed width for the image.
        max_height (int): Maximum allowed height for the image.
        compression_quality (int): Compression quality (0 to 100, higher means better quality).

    Returns:
        str: Path to the compressed image.
    """
    # Open the image using PIL
    image = Image.open(input_image_path)

    # Get original dimensions
    actual_width, actual_height = image.size
    print("Actual width:", actual_width)
    print("Actual height:", actual_height)
    img_ratio = actual_width / actual_height
    max_ratio = max_width / max_height

    # Adjust dimensions to fit within the max dimensions while maintaining aspect ratio
    if actual_height > max_height or actual_width > max_width:
        if img_ratio < max_ratio:
            # Adjust width according to maxHeight
            scale_factor = max_height / actual_height
            actual_width = int(scale_factor * actual_width)
            actual_height = max_height
        else:
            # Adjust height according to maxWidth
            scale_factor = max_width / actual_width
            actual_height = int(scale_factor * actual_height)
            actual_width = max_width

    # Resize the image
    resized_image = image.resize((actual_width, actual_height), Image.LANCZOS)

    # Generate the output image path
    base, ext = os.path.splitext(input_image_path)
    output_image_path = f"{base}_compressed{ext}"

    # Save the image with reduced quality (compression)
    resized_image.save(output_image_path, "JPEG", quality=compression_quality)

    return output_image_path


# Example Usage
if __name__ == "__main__":
    # Replace 'your_image.jpg' with the path to your image file
    # input_image = r"D:\Web Dev\Collaborate\Attendify\backend\attendify\utils\IMG20241119224436.jpg"
    input_image = r"D:\Web Dev\Collaborate\Attendify\backend\attendify\utils\rahul 28 mb.jpg"
    compressed_image_path = compress_image(input_image)
    print(f"Compressed image saved to: {compressed_image_path}")