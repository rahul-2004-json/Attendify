import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    students : [] , 
    loading: false,
    error: null,
};

export const addStudents = createAsyncThunk(
    "/createClass",
    async (classData) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",  
          },
        };
  
        const response = await axios.get(
          "axios call api for making a new class",
          classData,
          config
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    }
  );

const newStudentSlice = createSlice({
    name: "newClass",
    initialState,
    reducers: {
      clearErrors: (state) => {
        state.error = null;
      },
      resetNewStudent: () => initialState,
    },
    extraReducers: (builder) => {
      builder
        .addCase(addStudents.pending, (state) => {
          state.loading = true;
        })
        .addCase(addStudents.fulfilled, (state, action) => {
          state.loading = false;
          state.students = action.payload.students.map(student => ({
            name: student.name,
            enroll: student.enroll,
            attendance: false ,
          })) || [] ;
        })
        .addCase(addStudents.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addDefaultCase((state) => state);
    },
  });

export const { clearErrors, resetNewStudent } = newStudentSlice.actions;
export default newStudentSlice.reducer;