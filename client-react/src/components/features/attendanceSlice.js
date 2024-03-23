import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_ADD_ATTENDANCE, API_GET_ATTENDANCE, API_UPDATE_ATTENDANCE,
    API_DELETE_ATTENDANCE
} from "../../url/url"

export const createAttendance = createAsyncThunk(
    "createAttendance",
    async (data) => {
        try {
            const response = await axios.post(API_ADD_ATTENDANCE, data);
            return response.data;
        }
        catch (error) {
            // alert("Something Went Wrong");
            throw error.response.data;
        }
    }
)

export const fetchAttendance = createAsyncThunk(
    "getAttendance",
    async () => {
        try {
            const response = await axios.get(API_GET_ATTENDANCE);
            return response.data;
        }
        catch (error) {
            alert("Something Went Wrong");
            throw error.response.data;
        }
    }
);
export const updateAttendance = createAsyncThunk(
    'attendance/updateAttendance',
    async ({ id, updatedData }) => {
        try {
            const response = await axios.put(`${API_UPDATE_ATTENDANCE}/${id}`, updatedData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

export const deleteAttendance = createAsyncThunk(
    'attendance/deleteAttendance',
    async (id) => {
        try {
            const response = await axios.delete(`${API_DELETE_ATTENDANCE}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        empAttendance: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        searchAttedance: (state, action) => {
            state.empAttendance = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchAttendance status
            .addCase(fetchAttendance.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAttendance.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.empAttendance = action.payload;
            })
            .addCase(fetchAttendance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(createAttendance.fulfilled, (state, action) => {
                state.empAttendance.push(action.payload);
            })


            .addCase(updateAttendance.fulfilled, (state, action) => {
                const updatedIndex = state.empAttendance.findIndex(att => att.id === action.payload.id);
                state.empAttendance[updatedIndex] = action.payload.updatedData;
            })

            .addCase(deleteAttendance.fulfilled, (state, action) => {
                state.empAttendance = state.empAttendance.filter(att => att.id !== action.payload.id);
            });
        return builder;
    },


});
export const { searchAttedance } = attendanceSlice.actions;
export default attendanceSlice.reducer;