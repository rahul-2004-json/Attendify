import React, { useState, useContext, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoCameraReverse } from "react-icons/io5";
import { Link } from "react-router-dom";
import { ImageContext } from "../context/imageContext";
import { Hourglass } from "react-loader-spinner";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecognizedContext } from "../context/recognizedStudentcontext";

const DetectedFaces = () => {
  const { isLoading, detectedFaces, setIsLoading } = useContext(ImageContext);
  const { setRecognizedStudents } = useContext(RecognizedContext);
  const [scales, setScales] = useState({}); // Store scales for each image

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

  const markattendance = async () => {
    setIsLoading(true);
    try {
      const imageLinks = detectedFaces.map((face) => face.image_url);
      const res = await axios.post("/api/markAttendance/mark_attendance/", {
        image_urls: imageLinks,
      });
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
          <h1 className="text-center text-2xl font-bold mt-5">
            Detecting Faces...
          </h1>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <div className="flex flex-col container mx-auto gap-5 md:p-12 mt-8">
            <h1 className="text-center text-2xl font-bold">Detected Faces</h1>
            {detectedFaces &&
              detectedFaces.map((faceData, index) => (
                <div
                  key={index}
                  className="relative border p-4 rounded-md shadow-md shadow-indigo-300 items-center justify-between mx-4"
                >
                  <div className="relative">
                    <img
                      src={faceData.image_url}
                      alt="detected-face"
                      ref={(el) => (imageRefs.current[index] = el)} // Store ref for each image
                      onLoad={() => handleImageLoad(index)} // Pass the index for this image
                      style={{ transform: `rotate(${faceData.best_rotation_angle}deg)` }}
                      className="w-full h-auto"
                    />
                    {/* Bounding boxes */}
                    {scales[index] &&
                      faceData.face_locations.map((loc, i) => (
                        <div
                          key={i}
                          className="absolute border-2 border-green-500"
                          style={{
                            top: loc[0] * scales[index].scaleY,
                            left: loc[3] * scales[index].scaleX,
                            width:
                              (loc[1] - loc[3]) * scales[index].scaleX,
                            height:
                              (loc[2] - loc[0]) * scales[index].scaleY,
                          }}
                        ></div>
                      ))}
                  </div>
                  <button
                    className="text-white bg-red-500 rounded-full p-1 mt-2"
                    onClick={() => console.log("Retake image logic here")}
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
        </div>
      )}
    </>
  );
};

export default DetectedFaces;
