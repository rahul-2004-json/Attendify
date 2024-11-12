import React, { useState, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { StudentsContext } from "../context/fetchStudentcontext";

const FetchStudent = () => {
  const {
    handleCsvChange,
    handleNextform,
    handleNextCSV,
    loading,
    csvFile,
    setCsvFile,
    selectedBatches,
    setSelectedBatches,
    selectedYear,
    setSelectedYear,
    selectedBranch,
    setSelectedBranch,
    inputMethod,
    setInputMethod,
    parsedData,
  } = useContext(StudentsContext);

  const years = [2024, 2023, 2022, 2021, 2020];
  const branches = ["CSE", "ECE"];
  const csebatches = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"];
  const ecebatches = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"];

  const handleBatchChange = (event) => {
    const value = event.target.value;
    if (selectedBatches.includes(value)) {
      setSelectedBatches(selectedBatches.filter((batch) => batch !== value));
    } else {
      setSelectedBatches([...selectedBatches, value]);
    }
  };

  // This triggers the click event of input field when the user clicks on image
  const handleClick = (e) => {
    document.getElementById("fileInput").click();
  };

  const handleDeleteCSV = (index) => {
    setCsvFile(csvFile.filter((_, ind) => ind !== index));
  };

  const handleInputMethodChange = (event) => {
    setInputMethod(event.target.value);
  };

  return (
    <div className="flex flex-col container mx-auto md:p-12 ">
      <div className="flex flex-col font-semibold mt-12 ml-6 mb-8 md:p-12 md:flex-row md:justify-between  ">
        <label className="flex items-center">
          <input
            type="checkbox"
            value="database"
            checked={inputMethod === "database"}
            onChange={handleInputMethodChange}
            className="form-checkbox h-5 w-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500 transition-all duration-200"
          />
          <img
            src="/images/db.png"
            alt="upload-excel-file"
            className="w-30 h-10"
          />{" "}
          Select from database
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            value="upload"
            checked={inputMethod === "upload"}
            onChange={handleInputMethodChange}
            className="form-checkbox h-5 w-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500 transition-all duration-200"
          />
          <img
            src="/images/excel-icon.png"
            alt="upload-excel-file"
            className="w-30 h-10"
          />{" "}
          Upload csv
        </label>
      </div>

      {inputMethod === "database" ? (
        <>
          <div className="border p-4 rounded-2xl shadow-lg shadow-indigo-400 m-4 bg-white">
            <h1 className="font-bold mb-4 mt-3 text-center text-2xl flex gap-1 items-center justify-center">
              <img
                src="/images/db.png"
                alt="upload-excel-file"
                className="w-10 h-10"
              />
              Select From Database
            </h1>

            {/* Branch Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Select Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="border rounded-lg p-2 w-full bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-indigo-500"
              >
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Select Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border rounded-lg p-2 w-full bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-indigo-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Selection */}
            <div className="mb-4 mt-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Select Batches
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(selectedBranch === "CSE" ? csebatches : ecebatches).map(
                  (batch) => (
                    <div key={batch} className="flex items-center">
                      <input
                        type="checkbox"
                        value={batch}
                        checked={selectedBatches.includes(batch)}
                        onChange={handleBatchChange}
                        className="form-checkbox h-5 w-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500 transition-all duration-200"
                      />
                      <label className="ml-2 text-gray-700">{batch}</label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="border p-4 rounded-2xl shadow-lg  shadow-indigo-400 m-4">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-4 mt-3 text-center">
                Upload Enrolled Students List
              </h1>
              <input
                id="fileInput"
                type="file"
                accept=".csv, .xls, .xlsx"
                onChange={handleCsvChange}
                style={{ display: "none" }}
                className="border rounded-md p-2 w-full"
              />
              <div className="icon p-10" onClick={handleClick}>
                <div className="p-10 flex justify-center border-4 border-indigo-500 border-dashed rounded-lg">
                  <img
                    src="/images/excel-icon.png"
                    alt="upload-excel-file"
                    className="w-30 h-20"
                  />
                </div>
              </div>

              {csvFile.length > 0 && (
                <div className="file-names p-4">
                  <div className="font-bold">
                    <h3 className="text-center">Selected File</h3>
                  </div>
                  <ul className="mt-4">
                    <div className="flex flex-col gap-2">
                      {csvFile.map((file, index) => (
                        <div key={index} className="flex border p-2 rounded-md shadow-md shadow-indigo-300 items-center justify-between">
                          <li key={index}>{file.name}</li>
                          <button
                            className=" text-white bg-red-500 rounded-full p-1 cursor-pointer"
                            onClick={() => handleDeleteCSV(index)}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      ))}
                    </div>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10  md:mt-20 p-6"> */}
      {/* First Option */}
      {/* Second Option */}
      {/* </div> */}

      <div className="flex justify-center">
        <Link
          to={
            inputMethod !== "database" && parsedData.length === 0
              ? "/takeattendance"
              : "/uploadImage"
          }
        >
          <button
            onClick={
              inputMethod === "database" ? handleNextform : handleNextCSV
            }
            className="mt-12 mb-10 bg-indigo-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm lg:ml-1 hover:bg-indigo-700"
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FetchStudent;