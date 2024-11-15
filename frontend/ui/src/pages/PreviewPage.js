import React, { useState, useContext, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { IoCameraReverse } from "react-icons/io5";
import { Link } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { Hourglass } from "react-loader-spinner";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecognizedContext } from "../context/recognizedStudentcontext";

const DetectedFaces = () => {
	const {
		isLoading,
		detectedFaces,
		setDetectedFaces,
		forwardImages,
		setforwardImages,
		imageLinks,
		setImageLinks,
		setIsLoading,
	} = useContext(ImageContext);
	const { setRecognizedStudents } = useContext(RecognizedContext);

	const [selectedImage, setSelectedImage] = useState(null);
	const [showRetakeModal, setShowRetakeModal] = useState(false);
	const [retakeIndex, setRetakeIndex] = useState(null);

	// Loading stages
	const [uploading, setUploading] = useState(false);
	const [processing, setProcessing] = useState(false);

	useEffect(() => {}, [isLoading]);

	const notifySuccess = () => {
		toast.success("Attendance Marked successfully!");
	};
	const notifyFailure = () => {
		toast.error("Failed to mark attendance!");
	};

	// Handle image click to zoom
	const handleImageClick = (imageSrc) => {
		setSelectedImage(imageSrc);
	};

	// Close modal for zoom
	const handleCloseModal = () => {
		setSelectedImage(null);
	};

	// Handle retake click
	const handleImageRetake = (retakeIndex) => {
		setShowRetakeModal(true); // Open the modal
		setRetakeIndex(retakeIndex);
	};

	// Close retake modal
	const closeRetakeModal = () => {
		setShowRetakeModal(false);
	};

	// Upload new image for retake
	const handleUpload = async (newImage, index) => {
		newImage = newImage[0];

		try {
			setUploading(true); // Set uploading to true

			const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
			const folderName = `uploadedImages/${timestamp}`;

			const formData = new FormData();
			formData.append("file", newImage);
			formData.append(
				"upload_preset",
				process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
			);
			formData.append("folder", folderName);

			const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

			// Upload to Cloudinary
			const uploadResponse = await axios.post(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				formData
			);

			const url = uploadResponse.data.secure_url;

			setUploading(false); // Stop the uploading state

			setIsLoading(true);

			// Fetch preview image
			const previewResponse = await axios.post(
				"/api/previewImages/fetch_preview_images/",
				{ urls: [url] },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const previewImage = previewResponse.data.results[0];

			setProcessing(true); // Start processing the image

			// Update states using map to ensure immutability
			setDetectedFaces((prev) =>
				prev.map((item, idx) => (idx === index ? previewImage : item))
			);

			setforwardImages((prev) =>
				prev.map((item, idx) => (idx === index ? newImage : item))
			);

			setImageLinks((prev) =>
				prev.map((item, idx) => (idx === index ? url : item))
			);

			toast.success("Image updated successfully!");
		} catch (error) {
			console.error("Failed to upload new image:", error);
			toast.error("Failed to update image!");
		} finally {
			setIsLoading(false);
			setRetakeIndex(null);
			closeRetakeModal();
			setProcessing(false); // Stop processing the image
		}
	};

	const markattendance = async () => {
		setIsLoading(true);
		try {
			const res = await axios.post(
				"/api/markAttendance/mark_attendance/",
				{
					detections: detectedFaces,
				}
			);
			setRecognizedStudents(res.data.recognized_students);
			notifySuccess();
		} catch (error) {
			notifyFailure();
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{isLoading || uploading || processing ? (
				<div className="flex flex-col justify-center min-h-screen items-center">
					<Hourglass
						visible={true}
						height="80"
						width="80"
						ariaLabel="hourglass-loading"
						colors={["#3949ab", "#667eea"]}
					/>
					<h1 className="text-center text-2xl font-bold mt-5">
						{uploading
							? "Uploading Image..."
							: processing
							? "Processing Image..."
							: "Detecting Faces..."}
					</h1>
				</div>
			) : (
				<div className="flex flex-col justify-center">
					<div className="flex flex-col container mx-auto gap-5 md:p-12 mt-8">
						<h1 className="text-center text-2xl font-bold">
							Detected Faces
						</h1>
						{forwardImages &&
							forwardImages.map((image, index) => (
								<div
									key={index}
									className="flex border p-4 rounded-md shadow-md shadow-indigo-300 items-center justify-between mx-4"
								>
									<img
										src={URL.createObjectURL(image)}
										alt="detected-face"
										className="w-25 h-20 cursor-pointer"
										onClick={() =>
											handleImageClick(
												URL.createObjectURL(image)
											)
										}
									/>
									<button
										className="text-white bg-red-500 rounded-full p-1"
										onClick={() => handleImageRetake(index)}
									>
										<IoCameraReverse />
									</button>
								</div>
							))}
					</div>
					<div className="flex justify-center">
						<Link to={"/attendance"}>
							<button
								onClick={markattendance}
								className="mt-12 mb-10 bg-indigo-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm lg:ml-1 hover:bg-indigo-700"
							>
								Mark Attendance
							</button>
						</Link>
					</div>

					{/* Modal for zoomed image */}
					{selectedImage && (
						<div
							className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
							onClick={handleCloseModal}
						>
							<div
								className="relative bg-white p-4 rounded-2xl mx-3"
								onClick={(e) => e.stopPropagation()}
							>
								<img
									src={selectedImage}
									alt="zoomed"
									className="max-w-full max-h-screen"
								/>
								<button
									className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2"
									onClick={handleCloseModal}
								>
									<IoCloseOutline size={20} />
								</button>
							</div>
						</div>
					)}

					{/* Modal for retake options */}
					{showRetakeModal && (
						<div
							className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
							onClick={closeRetakeModal}
						>
							<div
								className="relative bg-white p-6 rounded-lg w-96 mx-3"
								onClick={(e) => e.stopPropagation()}
							>
								<h2 className="text-center text-lg font-semibold mb-4">
									Retake Image
								</h2>
								<div className="flex justify-around">
									<button
										className="bg-blue-500 text-white px-4 py-2 rounded"
										onClick={() =>
											document
												.getElementById("uploadInput")
												.click()
										}
									>
										Upload
									</button>
									<button
										className="bg-green-500 text-white px-4 py-2 rounded"
										onClick={() =>
											console.log("Open Camera Interface")
										}
									>
										Camera
									</button>
								</div>
								<input
									type="file"
									id="uploadInput"
									hidden
									accept="image/*"
									onChange={(e) =>
										handleUpload(
											Array.from(e.target.files),
											retakeIndex
										)
									}
								/>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default DetectedFaces;
