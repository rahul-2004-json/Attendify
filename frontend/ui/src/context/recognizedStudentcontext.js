import { React, createContext, useState } from "react";

export const RecognizedContext = createContext(null);

export default function RecognizedStudentState({ children }) {
  const [recognizedStudents, setRecognizedStudents] = useState([]);
  console.log("From context:",recognizedStudents);
  return (
    <RecognizedContext.Provider
      value={{ recognizedStudents, setRecognizedStudents }}
    >
      {children}
    </RecognizedContext.Provider>
  );
}
