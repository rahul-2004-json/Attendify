import React, { useState, useContext, useRef } from "react";
import { IoCameraReverse } from "react-icons/io5";
import { Link } from "react-router-dom";
import { ImageContext } from "../context/imageContext";
import { Hourglass } from "react-loader-spinner";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecognizedContext } from "../context/recognizedStudentcontext";
import { StudentsContext } from "../context/fetchStudentcontext";

const DetectedFaces = () => {
	const {
		students,
	} = useContext(StudentsContext);
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

  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [retakeIndex, setRetakeIndex] = useState(null);

  // Loading stages
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [scales, setScales] = useState({}); // Store scales for each image~

  const imageRefs = useRef([]);

  const handleImageLoad = (index) => {
    const img = imageRefs.current[index];
    if (img) {
      // Calculate scale factors for this specific image
      const scaleX = img.clientWidth / img.naturalWidth;
      const scaleY = img.clientHeight / img.naturalHeight;
      setScales((prevScales) => ({
        ...prevScales,
        [index]: { scaleX, scaleY },
      }));
    }
  };


	const notifySuccess = () => {
		toast.success("Attendance Marked successfully!");
	};
	const notifyFailure = () => {
		toast.error("Failed to mark attendance!");
	};

	// Handle retake click
	const handleImageRetake = (retakeIndex) => {
		setRetakeIndex(retakeIndex);
		setShowRetakeModal(true);
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
			setProcessing(false); // Stop processing the image
			setShowRetakeModal(false); // Close the modal
		}
	};

	const markattendance = async () => {
		setIsLoading(true);
		try {
			const res = await axios.post(
				"/api/markAttendance/mark_attendance/",
				{
					students: students,
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

	console.log(showRetakeModal);
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
									className="relative border p-4 rounded-md shadow-md shadow-indigo-300 items-center justify-between mx-4"
								>
									<div className="relative">
										<img
											src={URL.createObjectURL(image)}
											alt="detected-face"
											ref={(el) =>
												(imageRefs.current[index] = el)
											} // Store ref for each image
											onLoad={() =>
												handleImageLoad(index)
											} // Pass the index for this image
											style={{
												transform: `rotate(${detectedFaces[index].best_rotation_angle}deg)`,
											}}
											className="w-full h-auto"
										/>
										{/* Bounding boxes */}
										{scales[index] &&
											detectedFaces[
												index
											].face_locations.map((loc, i) => (
												<div
													key={i}
													className="absolute border-2 border-green-500"
													style={{
														top:
															loc[0] *
															scales[index]
																.scaleY,
														left:
															loc[3] *
															scales[index]
																.scaleX,
														width:
															(loc[1] - loc[3]) *
															scales[index]
																.scaleX,
														height:
															(loc[2] - loc[0]) *
															scales[index]
																.scaleY,
													}}
												></div>
											))}
									</div>
									<div className="flex justify-between items-center">
									<p className="font-semibold">Detected Faces : {detectedFaces[index].number_of_detected_faces}</p>
									<button
										className="text-white bg-red-500 rounded-full p-1 mt-2 flex items-center justify-center gap-2 p-2"
										onClick={() => handleImageRetake(index)}
									>
									    <span >Retake </span>
										<IoCameraReverse />
									</button>
									</div>
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

					{/* Retake Modal */}
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
											document
												.getElementById("cameraInput")
												.click()
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
								<input
									type="file"
									id="cameraInput"
									hidden
									accept="image/*"
									capture="environment"
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
