import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_ADD_STUDENT, API_GET_STUDENT, API_UPDATE_STUDENT,
    API_DELETE_STUDENT, API_CONVERT_TO_EMPLOYEE
} from "../../url/url";

// create new student
export const createStudent = createAsyncThunk(
    "createStudent",
    async (data) => {
        try {
            const response = await axios.post(API_ADD_STUDENT, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        }
        catch (error) {
            alert("Some Internal Error Occured, Please Try Again");
            throw new Error(error.response.data.error || "Some of your data's are not correctly entered. Please try again");
        }
    }
)

// get all student -read 
export const showStudents = createAsyncThunk(
    'showStudents',
    async () => {
        try {
            const response = await axios.get(API_GET_STUDENT);
            return response.data;
        }
        catch (error) {
            throw error.response.data;
        }
    }
)

// delete student -delete
export const deleteStudent = createAsyncThunk(
    "deleteStudent",
    async (id) => {
        try {
            const response = await axios.delete(API_DELETE_STUDENT + `/${id}`);
            return response.data;
        }
        catch (error) {
            throw error.response.data;
        }
    }
);

// update student - put
export const updateStudent = createAsyncThunk(
    "updateStudent",
    async ({ id, data }) => {
        try {
            const response = await axios.put(API_UPDATE_STUDENT + `/${id}`, data);
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            alert("Error Occured, Please Try Again!!!")
            throw error.response.data;
        }
    }
);
export const convertStudentToEmployeeData = createAsyncThunk(
    "convertStudentToEmployeeData",
    async (studentData, { rejectWithValue }) => {
        try {
            const employeeId = localStorage.getItem('currentEmployeeId');
            const response = await axios.post(API_CONVERT_TO_EMPLOYEE, { employeeId, studentData });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const students = createSlice({
    name: 'students',
    initialState: {
        entries: [],
        loading: false,
        error: null,
    },
    reducers: {
        searchStudent: (state, action) => {
            state.entries = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // createStudent status

            .addCase(createStudent.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.entries.push(action.payload);
                state.error = null;
            })
            .addCase(createStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // showStudent status

            .addCase(showStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(showStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.entries = action.payload;
                state.error = null;
            })
            .addCase(showStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // deleteStudent status
            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
                state.error = null; // Resetting error state on pending action
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = false;
                const { id } = action.payload;
                if (id) {
                    state.entries = state.entries.filter((element) => element.id !== id);
                }
                state.error = null;
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // updateStudent status
            .addCase(updateStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.entries = state.entries.map((element) =>
                    element.id === action.payload.id ? action.payload : element
                );
                state.error = null;
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // convertStudent to employee
            .addCase(convertStudentToEmployeeData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(convertStudentToEmployeeData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(convertStudentToEmployeeData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        return builder;
    },
})

export const { searchStudent } = students.actions;
export default students.reducer;