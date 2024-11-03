import { configureStore } from "@reduxjs/toolkit";
import newClassReducer from "./slices/newClass" ;

export const store = configureStore({
    reducer : {
        newClass : newClassReducer ,
    } ,
})