import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_FETCH_LEAD_DATA_DETAILS,
    API_CREATE_LEAD_DATA_DETAIL,
    API_UPDATE_LEAD_DATA_DETAIL,
    API_DELETE_LEAD_DATA_DETAIL,
} from "../../url/url";

export const createLeadExcelDetail = createAsyncThunk(
    "leadExcelDetails/createLeadExcelDetail",
    async (leadData) => {
        try {
            const response = await axios.post(API_CREATE_LEAD_DATA_DETAIL, leadData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const getleadExcelDetails = createAsyncThunk(
    "leadExcelDetails/getleadExcelDetails",
    async () => {
        try {
            const response = await axios.get(API_FETCH_LEAD_DATA_DETAILS);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const updateLeadExcelDetail = createAsyncThunk(
    "leadExcelDetails/updateLeadExcelDetail",
    async ({ leadId, updatedData }) => {
        try {
            const response = await axios.put(`${API_UPDATE_LEAD_DATA_DETAIL}/${leadId}`, updatedData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const deleteLeadExcelDetail = createAsyncThunk(
    "leadExcelDetails/deleteLeadExcelDetail",
    async (leadId) => {
        try {
            const response = await axios.delete(`${API_DELETE_LEAD_DATA_DETAIL}/${leadId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const leadExcelDetailsSlice = createSlice({
    name: "leadExcelDetails",
    initialState: {
        leadExcelDetailEntries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createLeadExcelDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLeadExcelDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.leadExcelDetailEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createLeadExcelDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getleadExcelDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getleadExcelDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.leadExcelDetailEntries = action.payload;
                state.error = null;
            })
            .addCase(getleadExcelDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateLeadExcelDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLeadExcelDetail.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.leadExcelDetailEntries.findIndex((lead) => lead.id === action.payload.id);
                if (index !== -1) {
                    state.leadExcelDetailEntries[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateLeadExcelDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteLeadExcelDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLeadExcelDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.leadExcelDetailEntries = state.leadExcelDetailEntries.filter((lead) => lead.id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteLeadExcelDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const selectleadExcelDetails = (state) => state.leadExcelDetails.leadExcelDetailEntries;

export default leadExcelDetailsSlice.reducer;
