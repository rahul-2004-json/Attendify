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
import {RecognizedContext} from "../context/recognizedStudentcontext";

const DetectedFaces = () => {
  const { isLoading, detectedFaces, forwardImages, imageLinks, setIsLoading } =
    useContext(ImageContext);
  const {setRecognizedStudents} = useContext(RecognizedContext);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {}, [isLoading]);

  const notifySuccess = () => {
    toast.success("Attendance Marked successfully!");
  };
  const notifyFailure = () => {
    toast.error("Failed to mark attendance!");
  };

  // Function to handle image click
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc); // Set the clicked image as selected
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedImage(null); // Clear the selected image
  };

  //-> This Function Needs to be changed , to retake the selected image
  // const handleImageRetake = (img) => {
  //   setImages(forwardImages.filter((image) => image !== img));
  // };

  const markattendance = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/markAttendance/mark_attendance/", {
        image_urls: imageLinks,
      });
      console.log(res.data);
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
      {isLoading ? (
        <div className="flex flex-col justify-center min-h-screen items-center">
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={["#3949ab", "#667eea"]}
          />
          <h1 className="text-center text-2xl font-bold mt-5">Detecting Faces...</h1>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <div className="flex flex-col container mx-auto gap-5 md:p-12 mt-8">
            <h1 className="text-center text-2xl font-bold">Detected Faces</h1>
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
                    onClick={() => handleImageClick(URL.createObjectURL(image))} // Trigger zoom on click
                  />
                  <button
                    className=" text-white bg-red-500 rounded-full p-1"
                    onClick={() => {}}
                  >
                    <IoCameraReverse />
                  </button>
                </div>
              ))}
          </div>
          <div className="flex justify-center">
            <Link to={"/attendance"}>
              <button
                onClick={() => {
                  markattendance();
                }}
                className="mt-12 mb-10 bg-indigo-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm lg:ml-1 hover:bg-indigo-700"
              >
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
      )}
    </>
  );
};

export default DetectedFaces;
