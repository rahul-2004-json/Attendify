import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    students : [] , 
    loading: false,
    error: null,
};

export const createClass = createAsyncThunk(
    "/createClass",
    async (classData) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",  
          },
        };

      const batchParams = classData.selectedBatches.map(batch => `batch=${batch}`).join('&');
      const apiUrl = `http://127.0.0.1:8001/api/getAttendanceList/fetch_students/?year=2022&branch=${classData.selectedBranch}&${batchParams}`;

      const response = await axios.get(apiUrl, config);

        return  response.data ;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    }
  );

const newClassSlice = createSlice({
    name: "newClass",
    initialState,
    reducers: {
      clearErrors: (state) => {
        state.error = null;
      },
      resetNewClass: () => initialState,
    },
    extraReducers: (builder) => {
      builder
        .addCase(createClass.pending, (state) => {
          state.loading = true;
        })
        .addCase(createClass.fulfilled, (state, action) => {
          console.log("Fulfilled case triggered with data:", action.payload);
          state.loading = false;
          state.students = action.payload.students.map(student => ({
            name: student.name,
            enroll: student.enroll,
            attendance: false ,
          })) || [] ;
        })
        .addCase(createClass.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addDefaultCase((state) => state);
    },
  });
  
  export const { clearErrors, resetNewClass } = newClassSlice.actions;
  export default newClassSlice.reducer;
  