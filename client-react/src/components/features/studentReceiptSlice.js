import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_FETCH_STUDENT_RECEIPT,
    API_CREATE_STUDENT_RECEIPT,
    API_UPDATE_STUDENT_RECEIPT,
    API_DELETE_STUDENT_RECEIPT,
} from "../../url/url";

export const createReceipt = createAsyncThunk(
    "studentReceipts/createReceipt",
    async (receiptData) => {
        try {
            const response = await axios.post(API_CREATE_STUDENT_RECEIPT, receiptData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const getStudentReceipts = createAsyncThunk(
    "studentReceipts/getStudentReceipts",
    async () => {
        try {
            const response = await axios.get(API_FETCH_STUDENT_RECEIPT);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const updateReceipt = createAsyncThunk(
    "studentReceipts/updateReceipt",
    async ({ receiptId, updatedData }) => {
        try {
            const response = await axios.put(`${API_UPDATE_STUDENT_RECEIPT}/${receiptId}`, updatedData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const deleteReceipt = createAsyncThunk(
    "studentReceipts/deleteReceipt",
    async (receiptId) => {
        try {
            const response = await axios.delete(`${API_DELETE_STUDENT_RECEIPT}/${receiptId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const studentReceiptsSlice = createSlice({
    name: "studentReceipts",
    initialState: {
        studentReceiptEntries: [],
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
                state.studentReceiptEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getStudentReceipts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentReceipts.fulfilled, (state, action) => {
                state.loading = false;
                state.studentReceiptEntries = action.payload;
                state.error = null;
            })
            .addCase(getStudentReceipts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(updateReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReceipt.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.studentReceiptEntries.findIndex((receipt) => receipt.id === action.payload.id);
                if (index !== -1) {
                    state.studentReceiptEntries[index] = action.payload;
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
                state.studentReceiptEntries = state.studentReceiptEntries.filter((receipt) => receipt.id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default studentReceiptsSlice.reducer;
