import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StudentState from "./context/fetchStudentcontext";
import AddedStudentState from "./context/addedStudentcontext";
import ImageState from "./context/imageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AddedStudentState>
      <ImageState>
        <StudentState>
          <App />
        </StudentState>
      </ImageState>
    </AddedStudentState>
  </React.StrictMode>
);
