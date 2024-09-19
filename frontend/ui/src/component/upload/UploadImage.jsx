import React , {useState} from 'react' ;
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";

const UploadImage = () => {

    const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    } else {
      console.error("No files selected");
    }
  };

  const handleClick = (e) => {
    document.getElementById("fileInput").click();
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("YOUR_BACKEND_API_URL", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="flex-col itmes-center h-screen bg-blue-50  top-30px">
      <div class="text-4xl text-white font-bold font-sans bg-blue-400 p-5 border-blue-800 border-b-4 border-r-4">
        Attendify
      </div>
        <div className="flex-col justify-center ">
          <div className="pt-20 px-20 ">
            <div className="p-5 font-bold ">
              <h2>UPLAOD YOUR IMAGES</h2>
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
            <div className="p-10 font-bold">
              <p>CLICK TO UPLOAD IMAGES</p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="file-names p-10">
              <div className="font-bold">
                <h3>SELECTED FILES : </h3>
              </div>
              <ul>
                <div>
                  {selectedFiles.map((file, index) => (
                    <div className="border-4 border-blue-500 m-3 font-bold rounded-md p-2 uppercase">
                      <li key={index}>{file.name}</li>
                    </div>
                  ))}
                </div>
              </ul>
            </div>
          )}

          <div className="pl-10 font-bold">
            {selectedFiles.length > 0 && (
              <button onClick={handleUpload} className="upload-button">
                UPLOAD FILES
              </button>
            )}
          </div>
        </div>
    </div>
  )
}

export default UploadImage ;