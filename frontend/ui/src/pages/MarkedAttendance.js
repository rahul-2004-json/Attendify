import React, { useContext } from "react";
import { ImageContext } from "../context/imageContext";
import { Hourglass } from "react-loader-spinner";
import { RecognizedContext } from './../context/recognizedStudentcontext';

const MarkedAttendance = () => {
  const { isLoading } = useContext(ImageContext);
  const { recognizedStudents } = useContext(RecognizedContext);
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
          <h1 className="flex flex-col text-center text-2xl font-bold mt-5">
            Marking Attendance...
            <span>Blazing fast⚡</span>
          </h1>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
};

export default MarkedAttendance;
