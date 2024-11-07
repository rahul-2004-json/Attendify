import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { IoCameraReverse } from "react-icons/io5";
import { Link } from "react-router-dom";

const DetectedFaces = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([
    "/DetectedImages/Image1.jpg",
    "/DetectedImages/images2.jpeg",
    "/DetectedImages/images3.png",
  ]);

  // Function to handle image click
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc); // Set the clicked image as selected
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedImage(null); // Clear the selected image
  };

  //-> This Function Needs to be changed , to retake the selected image
  const handleImageRetake = (img) => {
    setImages(images.filter((image) => image !== img));
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col container mx-auto gap-5 md:p-12 mt-8">
        <h1 className="text-center text-2xl font-bold">Detected Faces</h1>
        {images &&
          images.map((image) => (
            <div className="flex border p-4 rounded-md shadow-md shadow-indigo-300 items-center justify-between mx-4">
              <img
                src={image}
                alt="detected-face"
                className="w-25 h-20 cursor-pointer"
                onClick={() => handleImageClick(image)} // Trigger zoom on click
              />
              <button
                className=" text-white bg-red-500 rounded-full p-1"
                onClick={() => handleImageRetake(image)}
              >
                <IoCameraReverse />
              </button>
            </div>
          ))}
      </div>
      <div className="flex justify-center">
        <Link to={"/markedAttendance"}>
          <button className="mt-12 mb-10 bg-indigo-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm lg:ml-1 hover:bg-indigo-700">
            Mark Attendance
          </button>
        </Link>
      </div>

      {/* Modal to display zoomed image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="relative bg-white p-4 rounded-2xl mx-3"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
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
              <IoCloseOutline size={20} style={{ fontWeight: "bold" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectedFaces;


