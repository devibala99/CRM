import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_FETCH_VENDOR_DETAILS,
    API_CREATE_VENDOR_DETAIL,
    API_UPDATE_VENDOR_DETAIL,
    API_DELETE_VENDOR_DETAIL,
} from "../../url/url";

export const createVendorDetail = createAsyncThunk(
    "vendorDetails/createVendorDetail",
    async (vendorData) => {
        try {
            const response = await axios.post(API_CREATE_VENDOR_DETAIL, vendorData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const getVendorDetails = createAsyncThunk(
    "vendorDetails/getVendorDetails",
    async () => {
        try {
            const response = await axios.get(API_FETCH_VENDOR_DETAILS);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const updateVendorDetail = createAsyncThunk(
    "vendorDetails/updateVendorDetail",
    async ({ vendorId, updatedData }) => {
        try {
            const response = await axios.put(`${API_UPDATE_VENDOR_DETAIL}/${vendorId}`, updatedData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const deleteVendorDetail = createAsyncThunk(
    "vendorDetails/deleteVendorDetail",
    async (vendorId) => {
        try {
            const response = await axios.delete(`${API_DELETE_VENDOR_DETAIL}/${vendorId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const vendorDetailsSlice = createSlice({
    name: "vendorDetails",
    initialState: {
        vendorDetailEntries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createVendorDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVendorDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorDetailEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createVendorDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getVendorDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVendorDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorDetailEntries = action.payload;
                state.error = null;
            })
            .addCase(getVendorDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateVendorDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVendorDetail.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.vendorDetailEntries.findIndex((vendor) => vendor.id === action.payload.id);
                if (index !== -1) {
                    state.vendorDetailEntries[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateVendorDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteVendorDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVendorDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorDetailEntries = state.vendorDetailEntries.filter((vendor) => vendor.id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteVendorDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default vendorDetailsSlice.reducer;
