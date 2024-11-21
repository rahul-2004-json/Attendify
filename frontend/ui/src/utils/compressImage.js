import imageCompression from "browser-image-compression";

/**
 * Compresses an image by resizing it and reducing its quality.
 *
 * @param {File} file - The image file to compress.
 * @param {number} maxWidth - Maximum allowed width for the image.
 * @param {number} maxHeight - Maximum allowed height for the image.
 * @param {number} compressionQuality - Compression quality (0 to 1, higher means better quality).
 * @returns {Promise<File>} - The compressed image file.
 */
async function compressImage(
	file,
	maxWidth = 899,
	maxHeight = 1599,
	compressionQuality = 0.85
) {
	try {
		// Create an image object to get the original dimensions
		const originalImage = await new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = URL.createObjectURL(file);
		});

		const actualWidth = originalImage.width;
		const actualHeight = originalImage.height;
		console.log("Original Dimensions:", `${actualWidth}x${actualHeight}`);

		const imgRatio = actualWidth / actualHeight;
		const maxRatio = maxWidth / maxHeight;

		let newWidth = actualWidth;
		let newHeight = actualHeight;

		// Adjust dimensions to fit within the max dimensions while maintaining aspect ratio
		if (actualWidth > maxWidth || actualHeight > maxHeight) {
			if (imgRatio < maxRatio) {
				// Adjust width according to maxHeight
				const scaleFactor = maxHeight / actualHeight;
				newWidth = Math.floor(scaleFactor * actualWidth);
				newHeight = maxHeight;
			} else {
				// Adjust height according to maxWidth
				const scaleFactor = maxWidth / actualWidth;
				newHeight = Math.floor(scaleFactor * actualHeight);
				newWidth = maxWidth;
			}
		}

		console.log("Resized Dimensions:", `${newWidth}x${newHeight}`);

		// Prepare options for image compression
		const options = {
			maxSizeMB: 1, // Set max file size in MB
			maxWidthOrHeight: Math.max(newWidth, newHeight), // Set max width or height
			useWebWorker: true, // Use Web Workers for faster compression
			initialQuality: compressionQuality, // Quality of the output image (0 to 1)
		};

		console.log(
			"Original File Size:",
			(file.size / 1024 / 1024).toFixed(2),
			"MB"
		);

		// Compress the image
		const compressedFile = await imageCompression(file, options);

		console.log(
			"Compressed File Size:",
			(compressedFile.size / 1024 / 1024).toFixed(2),
			"MB"
		);

		// Return the compressed image
		return compressedFile;
	} catch (error) {
		console.error("Image compression failed:", error);
		throw error;
	}
}

export default compressImage;
