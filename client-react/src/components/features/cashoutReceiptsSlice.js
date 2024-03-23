import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_FETCH_CASHOUT_RECEIPT,
    API_CREATE_CASHOUT_RECEIPT,
    API_UPDATE_CASHOUT_RECEIPT,
    API_DELETE_CASHOUT_RECEIPT,
} from "../../url/url";

export const createCashoutReceipt = createAsyncThunk(
    "cashoutReceipts/createCashoutReceipt",
    async (receiptData) => {
        try {
            const response = await axios.post(API_CREATE_CASHOUT_RECEIPT, receiptData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const getCashoutReceipts = createAsyncThunk(
    "cashoutReceipts/getCashoutReceipts",
    async () => {
        try {
            const response = await axios.get(API_FETCH_CASHOUT_RECEIPT);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const updateCashoutReceipt = createAsyncThunk(
    "cashoutReceipts/updateCashoutReceipt",
    async ({ receiptId, updatedData }) => {
        try {
            const response = await axios.put(`${API_UPDATE_CASHOUT_RECEIPT}/${receiptId}`, updatedData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const deleteCashoutReceipt = createAsyncThunk(
    "cashoutReceipts/deleteCashoutReceipt",
    async (receiptId) => {
        try {
            const response = await axios.delete(`${API_DELETE_CASHOUT_RECEIPT}/${receiptId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const cashoutReceiptsSlice = createSlice({
    name: "cashoutReceipts",
    initialState: {
        cashoutReceiptEntries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCashoutReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCashoutReceipt.fulfilled, (state, action) => {
                state.loading = false;
                state.cashoutReceiptEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createCashoutReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCashoutReceipts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCashoutReceipts.fulfilled, (state, action) => {
                state.loading = false;
                state.cashoutReceiptEntries = action.payload;
                state.error = null;
            })
            .addCase(getCashoutReceipts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(updateCashoutReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCashoutReceipt.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.cashoutReceiptEntries.findIndex((receipt) => receipt.id === action.payload.id);
                if (index !== -1) {
                    state.cashoutReceiptEntries[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateCashoutReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteCashoutReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCashoutReceipt.fulfilled, (state, action) => {
                state.loading = false;
                state.cashoutReceiptEntries = state.cashoutReceiptEntries.filter((receipt) => receipt.id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteCashoutReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default cashoutReceiptsSlice.reducer;
