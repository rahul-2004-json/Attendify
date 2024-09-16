import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import "./App.css";

function App() {
  

  return (
    <div className="flex justify-center h-screen bg-blue-50  top-30px">
        <div className="flex-col justify-center ">
          <div className="pt-20 px-20 ">
            <div className="p-5 ">
              <h2>Upload Your Images</h2>
            </div>
            <input
              id="fileInput"
              type="file"
              multiple
              capture="environment" 
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
            <input
              id="fileInput2"
              type="file"
              multiple
              capture="environment" 
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="icon p-10" onClick={handleClick}>
            <div className="p-10 flex justify-center border-4 border-blue-500 border-dashed rounded-lg">
              <FaCloudUploadAlt style={{color: 'blue', fontSize: '100px' }} />
            </div>
            <div className="p-10">
              <p>Click to upload images</p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="file-names p-10">
              <h3>Selected Files:</h3>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <button onClick={handleUpload} className="upload-button">
              Upload Files
            </button>
          )}
        </div>
    </div>
  );
}

export default App;
