import React, { useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import { FaImages } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";

const AddStudent = () => {
	const [students, setStudents] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [newStudent, setNewStudent] = useState({
		name: "",
		enroll: "",
		batch: "",
		year: "",
		branch: "",
		images: [],
	});
	const [showImagePopup, setShowImagePopup] = useState(false);
	const [selectedImages, setSelectedImages] = useState([]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewStudent((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		setNewStudent((prev) => ({
			...prev,
			images: [...prev.images, ...files],
		}));
	};

	const handleAddStudent = () => {
		setShowForm(true);
	};

	const handleSubmit = () => {
		setStudents((prev) => [...prev, newStudent]);
		setNewStudent({
			name: "",
			enroll: "",
			batch: "",
			year: "",
			branch: "",
			images: [],
		});
		setShowForm(false);
	};

	const handleImagePreview = (images) => {
		setSelectedImages(images);
		setShowImagePopup(true);
	};

	const handleRemoveStudent = (index) => {
		setStudents((prev) => prev.filter((_, i) => i !== index));
	};

	const handleRemoveImage = (imageIndex) => {
		const updatedImages = selectedImages.filter((_, i) => i !== imageIndex);
		setSelectedImages(updatedImages);

		if (updatedImages.length === 0) {
			setShowImagePopup(false);
		}
	};

	const handleClosePopup = () => {
		setShowImagePopup(false);
		setSelectedImages([]);
	};

	return (
		<div className="min-h-screen p-6">
			{/* Student Cards */}
			{students.map((student, index) => (
				<div
					key={index}
					className="flex relative p-4 mb-4 border rounded-md shadow-md shadow-indigo-300 max-w-md mx-auto"
				>
					{/* Delete Student Icon */}
					<button
						className="absolute top-2 right-2 text-red-600"
						onClick={() => handleRemoveStudent(index)}
					>
						<AiFillCloseCircle size={20} />
					</button>

					<div className="flex-grow mr-4 overflow-hidden">
						<p className="text-wrap break-words">
							<strong>Name:</strong> {student.name}
						</p>
						<p className="whitespace-normal break-words">
							<strong>Enroll:</strong> {student.enroll}
						</p>
						<p className="whitespace-normal break-words">
							<strong>Batch:</strong> {student.batch}
						</p>
						<p className="whitespace-normal break-words">
							<strong>Year:</strong> {student.year}
						</p>
						<p className="whitespace-normal break-words">
							<strong>Branch:</strong> {student.branch}
						</p>
					</div>
					<div className="flex justify-center items-center">
						<button
							className="text-indigo-600"
							onClick={() => handleImagePreview(student.images)}
						>
							<FaImages size={74} />
						</button>
					</div>
				</div>
			))}

			{/* Add Student Form */}
			{showForm ? (
				<div className="p-4 mb-6 border rounded shadow max-w-md mx-auto">
					<h2 className="text-xl font-semibold mb-4">Add Student</h2>
					<input
						type="text"
						name="name"
						placeholder="Name"
						value={newStudent.name}
						onChange={handleInputChange}
						className="w-full p-2 mb-2 border rounded"
					/>
					<input
						type="text"
						name="enroll"
						placeholder="Enrollment Number"
						value={newStudent.enroll}
						onChange={handleInputChange}
						className="w-full p-2 mb-2 border rounded"
					/>
					<input
						type="text"
						name="batch"
						placeholder="Batch"
						value={newStudent.batch}
						onChange={handleInputChange}
						className="w-full p-2 mb-2 border rounded"
					/>
					<input
						type="text"
						name="year"
						placeholder="Year"
						value={newStudent.year}
						onChange={handleInputChange}
						className="w-full p-2 mb-2 border rounded"
					/>
					<input
						type="text"
						name="branch"
						placeholder="Branch"
						value={newStudent.branch}
						onChange={handleInputChange}
						className="w-full p-2 mb-4 border rounded"
					/>
					<input
						type="file"
						multiple
						onChange={handleImageUpload}
						className="mb-4"
					/>
					<button
						onClick={handleSubmit}
						className="w-full bg-indigo-600 text-white py-2 rounded"
					>
						Submit
					</button>
				</div>
			) : (
				<div
					className={`flex flex-col items-center gap-4 justify-center ${
						students.length ? "mt-4" : "min-h-[500px]"
					}`}
				>
					<button
						onClick={handleAddStudent}
						className="text-indigo-600"
					>
						<TbCirclePlus size={students.length ? 50 : 100} />
					</button>
					<h2 className="text-2xl font-semibold">
						Click to{" "}
						{students.length ? "add another" : "add Students"}
					</h2>
				</div>
			)}

			{/* Image Preview Popup */}
			{showImagePopup && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
					<div className="bg-white p-6 w-full max-w-md max-h-[80vh] overflow-y-auto rounded-lg relative">
						<button
							className="absolute top-2 right-2 text-red-600"
							onClick={handleClosePopup}
						>
							<AiFillCloseCircle size={30} />
						</button>
						<h2 className="text-xl font-semibold mb-4">
							Image Preview
						</h2>
						<div className="flex flex-col gap-4">
							{selectedImages.map((image, imageIndex) => (
								<div
									key={imageIndex}
									className="relative"
								>
									<img
										src={URL.createObjectURL(image)}
										alt={`Uploaded ${imageIndex}`}
										className="w-full max-h-80 object-contain rounded"
									/>
									<button
										className="absolute top-2 right-2 text-red-600"
										onClick={() =>
											handleRemoveImage(imageIndex)
										}
									>
										<AiFillCloseCircle size={24} />
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddStudent;
