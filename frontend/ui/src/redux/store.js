import { configureStore } from "@reduxjs/toolkit";
import newClassReducer from "./slices/newClass" ;
import newStudentReducer from "./slices/newStudent"

export const store = configureStore({
    reducer : {
        students : newClassReducer ,
        newStudent : newStudentReducer ,
    } ,
})