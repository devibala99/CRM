import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_FETCH_LEAD_DETAILS,
    API_CREATE_LEAD_DETAIL,
    API_UPDATE_LEAD_DETAIL,
    API_DELETE_LEAD_DETAIL,
} from "../../url/url";

export const createLeadDetail = createAsyncThunk(
    "leadDetails/createLeadDetail",
    async (leadData) => {
        try {
            const response = await axios.post(API_CREATE_LEAD_DETAIL, leadData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const getLeadDetails = createAsyncThunk(
    "leadDetails/getLeadDetails",
    async () => {
        try {
            const response = await axios.get(API_FETCH_LEAD_DETAILS);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const updateLeadDetail = createAsyncThunk(
    "leadDetails/updateLeadDetail",
    async ({ leadId, updatedData }) => {
        try {
            const response = await axios.put(`${API_UPDATE_LEAD_DETAIL}/${leadId}`, updatedData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const deleteLeadDetail = createAsyncThunk(
    "leadDetails/deleteLeadDetail",
    async (leadId) => {
        try {
            const response = await axios.delete(`${API_DELETE_LEAD_DETAIL}/${leadId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const leadDetailsSlice = createSlice({
    name: "leadDetails",
    initialState: {
        leadDetailEntries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createLeadDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLeadDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.leadDetailEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createLeadDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getLeadDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLeadDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.leadDetailEntries = action.payload;
                state.error = null;
            })
            .addCase(getLeadDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateLeadDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLeadDetail.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.leadDetailEntries.findIndex((lead) => lead.id === action.payload.id);
                if (index !== -1) {
                    state.leadDetailEntries[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateLeadDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteLeadDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLeadDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.leadDetailEntries = state.leadDetailEntries.filter((lead) => lead.id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteLeadDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default leadDetailsSlice.reducer;
