import React, { useState, useContext, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import * as XLSX from "xlsx";
import { StudentsContext } from "../context/fetchStudentcontext";
import { RecognizedContext } from "../context/recognizedStudentcontext";
import { ImageContext } from "../context/ImageContext";
import { Hourglass } from "react-loader-spinner";


const Attendance = () => {
  const { students } = useContext(StudentsContext);
  const { recognizedStudents } = useContext(RecognizedContext);
  const { isLoading } = useContext(ImageContext);
  const [presentStudents, setPresentStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);

  useEffect(() => {
    filterStudents();
  }, [students, recognizedStudents]);


  //Very Important function to filter students
  const filterStudents = () => {
    const present = students.filter((student) =>
      recognizedStudents.some(
        (recognized) => recognized.enrollment === student.enrollment
      )
    );
    const absent = students.filter(
      (student) =>
        !recognizedStudents.some(
          (recognized) => recognized.enrollment === student.enrollment
        )
    );
    setPresentStudents(present);
    setAbsentStudents(absent);
  };

  console.log("Present:", presentStudents);
  console.log("Absent:", absentStudents);

  // Function to move student from present to absent
  const moveToAbsent = (student) => {
    setPresentStudents(
      presentStudents.filter((s) => s.enrollment !== student.enrollment)
    );
    setAbsentStudents([...absentStudents, student]);
  };

  // Function to move student from absent to present
  const moveToPresent = (student) => {
    setAbsentStudents(
      absentStudents.filter((s) => s.enrollment !== student.enrollment)
    );
    setPresentStudents([...presentStudents, student]);
  };

  // Generate Excel sheet with attendance data
  const handleCreateExcel = () => {
    const data = [
      ...presentStudents.map((student) => ({
        Enrollment: student.enrollment,
        Name: student.name,
        Batch: student.batch,
        Status: "Present",
      })),
      ...absentStudents.map((student) => ({
        Enrollment: student.enrollment,
        Name: student.name,
        Batch: student.batch,
        Status: "Absent",
      })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Save the file
    XLSX.writeFile(workbook, "Attendance_Sheet.xlsx");
  };

  // StudentCard component with swipe functionality
  const StudentCard = ({ student, isPresent }) => {
    const handlers = useSwipeable({
      onSwipedLeft: () => isPresent && moveToAbsent(student),
      onSwipedRight: () => !isPresent && moveToPresent(student),
    });

    return (
      <div
        {...handlers}
        className={`${
          isPresent
            ? "bg-green-100 border-green-500"
            : "bg-red-100 border-red-500"
        } border-l-4 shadow-md rounded-lg p-4 flex flex-col`}
      >
        <p className="text-lg font-medium">
          {student.name}{" "}
          <span className="text-gray-600">({student.enrollment})</span>
        </p>
        <p className="text-sm text-gray-500">Batch: {student.batch}</p>
        <p
          className={`text-sm font-semibold ${
            isPresent ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPresent ? "Present" : "Absent"}
        </p>
      </div>
    );
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
          <h1 className="flex flex-col text-center text-2xl font-bold mt-5">
            Marking Attendance...
            <span>Blazing fast⚡</span>
          </h1>
        </div>
      ) : (
        <>
          <div className="p-4 min-h-screen">
            <h2 className="text-2xl font-bold text-center mb-6">Attendance</h2>

            {/* Present Students Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Present Students</h3>
              <div className="flex flex-col gap-3">
                {presentStudents.length > 0 ? (
                  presentStudents.map((student, index) => (
                    <StudentCard
                      key={index}
                      student={student}
                      isPresent={true}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 italic">
                    Looks like no one showed up to class!
                  </p>
                )}
              </div>
            </div>

            {/* Absent Students Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Absent Students</h3>
              <div className="flex flex-col gap-3">
                {absentStudents.length > 0 ? (
                  absentStudents.map((student, index) => (
                    <StudentCard
                      key={index}
                      student={student}
                      isPresent={false}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 italic">
                    Wow! Everyone made it to class today!
                  </p>
                )}
              </div>
            </div>

            {/* Create Excel Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleCreateExcel}
                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:bg-blue-600"
              >
                Generate Excel Sheet
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Attendance;
