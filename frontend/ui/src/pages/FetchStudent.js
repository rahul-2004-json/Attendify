import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import {Link} from "react-router-dom"

const FetchStudent = () => {
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [csvFile, setCsvFile] = useState([]);
  const years = [1, 2, 3, 4];
  const branches = ["CSE", "ECE", "Biotech", "IT", "BBA"];
  const batches = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9"];

  const handleBatchChange = (event) => {
    const value = event.target.value;
    if (selectedBatches.includes(value)) {
      setSelectedBatches(selectedBatches.filter((batch) => batch !== value));
    } else {
      setSelectedBatches([...selectedBatches, value]);
    }
  };

  const handleCsvChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setCsvFile((prevFiles) => [...prevFiles, ...files]);
    } else {
      console.error("No files selected");
    }
  };

  // This triggers the click event of input field when the user clicks on image
  const handleClick = (e) => {
    document.getElementById("fileInput").click();
  };

  const handleDeleteCSV = (index) => {
    setCsvFile(csvFile.filter((_, ind) => ind !== index));
  };

  const handleNext = () => {
    // Handle next button action
    console.log("Next clicked", {
      selectedBatches,
      selectedYear,
      selectedBranch,
      csvFile,
    });
  };
  return (
    <div className="flex flex-col container mx-auto gap-5 md:p-12 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10  md:mt-20 p-6">
        {/* First Option */}
        <div className="border p-4 rounded-2xl shadow-lg shadow-indigo-400">
          <h1 className="text-2xl font-bold mb-4 mt-3 text-center">
            Select From Database
          </h1>
          <div className="mb-4 mt-4">
            <label className="block mb-1">Select Batches</label>
            <div className="grid grid-cols-2 gap-2">
              {batches.map((batch) => (
                <div key={batch} className="flex items-center">
                  <input
                    type="checkbox"
                    value={batch}
                    checked={selectedBatches.includes(batch)}
                    onChange={handleBatchChange}
                    className="mr-2"
                  />
                  <label>{batch}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Select Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Select Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Option */}
        <div className="border p-4 rounded-2xl shadow-lg  shadow-indigo-400">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-4 mt-3 text-center">
              Upload Enrolled Students List
            </h1>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
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
                  <h3 className="text-center">Selected Files</h3>
                </div>
                <ul className="mt-4">
                  <div className="flex flex-col gap-2">
                    {csvFile.map((file, index) => (
                      <div className="flex border p-2 rounded-md shadow-md shadow-indigo-300 items-center justify-between">
                        <li key={index}>{file.name}</li>
                        <button  className=" text-white bg-red-500 rounded-full p-1 cursor-pointer" onClick={() => handleDeleteCSV(index)}>
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
      </div>

      <div className="flex justify-center">
      <Link to={"/uploadImage"}>

        <button
          onClick={handleNext}
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
