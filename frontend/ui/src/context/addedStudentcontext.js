import { createContext,useState } from "react";

export const AddedStudentContext = createContext(null);

export default function AddedStudentState({ children }) {
  
  return (
    <AddedStudentContext.Provider value={null}>{children}</AddedStudentContext.Provider>
  );
}
