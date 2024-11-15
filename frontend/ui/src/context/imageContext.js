import React, { createContext, useState } from "react";
export const ImageContext = createContext(null);
export default function ImageState({ children }) {
	const [imagesArray, setImagesArray] = useState([]);
	const [forwardImages, setforwardImages] = useState([]);
	const [imageLinks, setImageLinks] = useState([]);
	const [detectedFaces, setDetectedFaces] = useState([]); //for each image
	const [isLoading, setIsLoading] = useState(false);
	// console.log("Forward Images Array:", forwardImages);
	// console.log("Detected Faces from context:", detectedFaces);
	return (
		<ImageContext.Provider
			value={{
				imagesArray,
				setImagesArray,
				isLoading,
				setIsLoading,
				detectedFaces,
				setDetectedFaces,
				setforwardImages,
				forwardImages,
				imageLinks,
				setImageLinks,
			}}
		>
			{children}
		</ImageContext.Provider>
	);
}
