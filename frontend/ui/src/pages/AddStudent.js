import React, { useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import { FaImages, FaFolderOpen } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { PiStudentBold } from "react-icons/pi";
import axios from "axios";

const AddStudent = () => {
    const currentYear = new Date().getFullYear();
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
    const [formErrors, setFormErrors] = useState({}); // State for form errors
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "enroll" && value.length > 15) return; // Limit enroll number to 15 characters
        setNewStudent((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
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

    const handleAdd = () => {
        const errors = {};
        if (!newStudent.name) errors.name = "Name is required.";
        if (!newStudent.enroll)
            errors.enroll = "Enrollment number is required.";
        if (!newStudent.batch) errors.batch = "Batch is required.";
        if (!newStudent.year) errors.year = "Year is required.";
        if (!newStudent.branch) errors.branch = "Branch is required.";
        if (newStudent.images.length === 0)
            errors.images = "At least one image is required.";

        setFormErrors(errors); // Set form errors

        // Check if there are any errors
        if (Object.keys(errors).length === 0) {
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
        }
    };

    const handleSubmit = async () => {
        try {
            const uploadedStudents = await Promise.all(
                students.map(async (student) => {
                    const folderName = `students/${student.enroll}`;

                    // Upload each image to Cloudinary in the specified folder
                    const uploadPromises = student.images.map((file) => {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append(
                            "upload_preset",
                            process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
                        );
                        formData.append("folder", folderName);

                        const cloudname =
                            process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
                        return axios.post(
                            `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, // Replace with your Cloudinary cloud name
                            formData
                        );
                    });

                    // Wait for all images to upload and get their URLs
                    const uploadResponses = await Promise.all(uploadPromises);
                    const imageUrls = uploadResponses.map(
                        (res) => res.data.secure_url
                    );

                    const { images, ...studentDataWithoutImages } = student;

                    // Prepare the student data with the Cloudinary folder URL
                    return {
                        ...studentDataWithoutImages,
                        folder_url: folderName, // Construct the folder URL
                        image_urls: imageUrls,
                    };
                })
            );

            // Send the student data to the backend
            await axios.post("/api/addStudents/add_students/", {
                students: uploadedStudents,
            });

            // TODO : Add a success toast notification
            alert("Students added successfully!");
            setStudents([]); // Clear students list after successful submission
        } catch (error) {
            console.error("Error submitting students:", error);
            // TODO : Add an error toast notification
            alert("Failed to submit students.");
        }
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

        setNewStudent((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== imageIndex),
        }));

        if (updatedImages.length === 0) {
            setShowImagePopup(false);
        }
    };

    const handleClosePopup = () => {
        setShowImagePopup(false);
        setSelectedImages([]);
    };

    return (
        <div className="min-h-screen p-6 mt-5">
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

                    <div className="flex-1 min-w-0 mr-4">
                        <p className="break-words">
                            <strong>Name:</strong> {student.name}
                        </p>
                        <p className="break-words">
                            <strong>Enroll:</strong> {student.enroll}
                        </p>
                        <p className="break-words">
                            <strong>Batch:</strong> {student.batch}
                        </p>
                        <p className="break-words">
                            <strong>Year:</strong> {student.year}
                        </p>
                        <p className="break-words">
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
                <div className="flex flex-col p-4 mb-6 border rounded-md shadow-md shadow-indigo-300 max-w-md mx-auto">
                    <div className="flex flex-col items-center">
                        <PiStudentBold size={30} />
                        <h2 className="text-xl font-semibold mb-4">
                            Add Student
                        </h2>
                    </div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newStudent.name}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    />
                    {formErrors.name && (
                        <p className="text-red-600 mb-2 -mt-2">
                            {formErrors.name}
                        </p>
                    )}
                    <input
                        type="text"
                        name="enroll"
                        placeholder="Enrollment Number"
                        value={newStudent.enroll}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded"
                        maxLength={15}
                        required
                    />
                    {formErrors.enroll && (
                        <p className="text-red-600 mb-2 -mt-2">
                            {formErrors.enroll}
                        </p>
                    )}
                    <select
                        name="batch"
                        value={newStudent.batch}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    >
                        <option value="">Select Batch</option>
                        {[...Array(9)].map((_, i) => (
                            <React.Fragment key={`batch-${i}`}>
                                <option value={`F${i + 1}`}>F{i + 1}</option>
                                <option value={`E${i + 1}`}>E{i + 1}</option>
                            </React.Fragment>
                        ))}
                    </select>
                    {formErrors.batch && (
                        <p className="text-red-600 mb-2 -mt-2">
                            {formErrors.batch}
                        </p>
                    )}
                    <select
                        name="year"
                        value={newStudent.year}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    >
                        <option value="">Select Year</option>
                        {[...Array(5)].map((_, i) => (
                            <option
                                key={i}
                                value={currentYear - i}
                            >
                                {currentYear - i}
                            </option>
                        ))}
                    </select>
                    {formErrors.year && (
                        <p className="text-red-600 mb-2 -mt-2">
                            {formErrors.year}
                        </p>
                    )}
                    <select
                        name="branch"
                        value={newStudent.branch}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    >
                        <option value="">Select Branch</option>
                        <option value="ECE">ECE</option>
                        <option value="CSE">CSE</option>
                    </select>
                    {formErrors.branch && (
                        <p className="text-red-600 mb-4 -mt-2">
                            {formErrors.branch}
                        </p>
                    )}
                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept=".png, .jpeg, .jpg"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="file-upload"
                        required
                    />
                    {/* Custom button to trigger file input */}
                    <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center bg-indigo-600 text-white py-2 rounded mb-2 cursor-pointer"
                    >
                        <FaFolderOpen
                            className="mr-2"
                            size={20}
                        />{" "}
                        Upload Images
                    </label>
                    {formErrors.images && (
                        <p className="text-red-600 mb-6 -mt-2">
                            {formErrors.images}
                        </p>
                    )}{" "}
                    {/* Error for images */}
                    <button
                        onClick={handleAdd}
                        className="w-full bg-indigo-600 text-white py-2 rounded "
                    >
                        Add
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
                    {students.length > 0 && (
                        <button
                            onClick={handleSubmit}
                            className="mt-12 mb-10 bg-indigo-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm lg:ml-1 hover:bg-indigo-700 "
                        >
                            Submit
                        </button>
                    )}
                </div>
            )}

            {/* Image Popup */}
            {showImagePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
                    <div className="bg-white p-6 rounded-md max-w-lg m-2">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            Image Preview
                        </h3>
                        <div className="flex flex-col gap-4  max-h-[500px] overflow-y-auto">
                            {selectedImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Student ${index}`}
                                        className="object-cover w-full rounded-md"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 text-red-600"
                                    >
                                        <AiFillCloseCircle size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={handleClosePopup}
                                className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddStudent;