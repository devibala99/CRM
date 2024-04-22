import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_FETCH_STAFF_DETAILS,
    API_CREATE_STAFF_DETAIL,
    API_UPDATE_STAFF_DETAIL,
    API_DELETE_STAFF_DETAIL,
} from "../../url/url";

export const createStaffDetail = createAsyncThunk(
    "staffDetails/createStaffDetail",
    async (staffData) => {
        try {
            const response = await axios.post(API_CREATE_STAFF_DETAIL, staffData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const getStaffDetails = createAsyncThunk(
    "staffDetails/getStaffDetails",
    async () => {
        try {
            const response = await axios.get(API_FETCH_STAFF_DETAILS);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const updateStaffDetail = createAsyncThunk(
    "staffDetails/updateStaffDetail",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_UPDATE_STAFF_DETAIL}/${id}`, updatedData);
            // console.log(response.data, "staff-redux")
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteStaffDetail = createAsyncThunk(
    "staffDetails/deleteStaffDetail",
    async (staffId) => {
        try {
            const response = await axios.delete(`${API_DELETE_STAFF_DETAIL}/${staffId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const staffDetailsSlice = createSlice({
    name: "staffDetails",
    initialState: {
        staffDetailEntries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createStaffDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStaffDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.staffDetailEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createStaffDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getStaffDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStaffDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.staffDetailEntries = action.payload;
                state.error = null;
            })
            .addCase(getStaffDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateStaffDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStaffDetail.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.staffDetailEntries.findIndex((staff) => staff.id === action.payload.id);
                if (index !== -1) {
                    state.staffDetailEntries[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateStaffDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteStaffDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStaffDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.staffDetailEntries = state.staffDetailEntries.filter((staff) => staff.id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteStaffDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default staffDetailsSlice.reducer;
