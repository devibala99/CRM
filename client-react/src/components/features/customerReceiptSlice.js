import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_FETCH_CUSTOMER_RECEIPT,
    API_CREATE_CUSTOMER_RECEIPT,
    API_UPDATE_CUSTOMER_RECEIPT,
    API_DELETE_CUSTOMER_RECEIPT,
} from "../../url/url";

export const createReceipt = createAsyncThunk(
    "customerReceipts/createReceipt",
    async (receiptData) => {
        try {
            const response = await axios.post(API_CREATE_CUSTOMER_RECEIPT, receiptData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const getReceipts = createAsyncThunk(
    "customerReceipts/getReceipts",
    async () => {
        try {
            const response = await axios.get(API_FETCH_CUSTOMER_RECEIPT);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const updateReceipt = createAsyncThunk(
    "customerReceipts/updateReceipt",
    async ({ receiptId, updatedData }) => {
        try {
            const response = await axios.put(`${API_UPDATE_CUSTOMER_RECEIPT}/${receiptId}`, updatedData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const deleteReceipt = createAsyncThunk(
    "customerReceipts/deleteReceipt",
    async (receiptId) => {
        try {
            const response = await axios.delete(`${API_DELETE_CUSTOMER_RECEIPT}/${receiptId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const customerReceiptsSlice = createSlice({
    name: "customerReceipts",
    initialState: {
        customerReceiptEntries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReceipt.fulfilled, (state, action) => {
                state.loading = false;
                state.customerReceiptEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getReceipts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReceipts.fulfilled, (state, action) => {
                state.loading = false;
                state.customerReceiptEntries = action.payload;
                state.error = null;
            })
            .addCase(getReceipts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReceipt.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.customerReceiptEntries.findIndex((receipt) => receipt.id === action.payload.id);
                if (index !== -1) {
                    state.customerReceiptEntries[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReceipt.fulfilled, (state, action) => {
                state.loading = false;
                state.customerReceiptEntries = state.customerReceiptEntries.filter((receipt) => receipt.id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default customerReceiptsSlice.reducer;
