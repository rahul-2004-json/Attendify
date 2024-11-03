import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    sections : "axios call api for fetching existing records of classes into redux state" , 
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
  
        const response = await axios.post(
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
          state.loading = false;
          state.product = action.payload.product || {};
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
  