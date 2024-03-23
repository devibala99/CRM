import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_CREATE_INVOICE,
    API_SHOW_INVOICES,
    API_UPDATE_INVOICE,
    API_DELETE_INVOICE
} from "../../url/url";

export const createInvoice = createAsyncThunk(
    "invoices/createInvoice",
    async (invoiceData) => {
        try {
            const response = await axios.post(API_CREATE_INVOICE, invoiceData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const showInvoice = createAsyncThunk(
    "invoices/showInvoice",
    async () => {
        try {
            const response = await axios.get(API_SHOW_INVOICES);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);
export const updateInvoice = createAsyncThunk(
    "invoices/updateInvoice",
    async ({ id, updatedData }) => {
        try {
            const response = await axios.put(`${API_UPDATE_INVOICE}/${id}`, updatedData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);


export const deleteInvoice = createAsyncThunk(
    "invoices/deleteInvoice",
    async (invoiceId) => {
        try {
            console.log(invoiceId);
            const response = await axios.delete(`${API_DELETE_INVOICE}/${invoiceId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const invoicesSlice = createSlice({
    name: "invoices",
    initialState: {
        invoiceEntries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.invoiceEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(showInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.invoiceEntries = action.payload;
                state.error = null;
            })
            .addCase(showInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateInvoice.fulfilled, (state, action) => {
                state.loading = false;
                const updatedIndex = state.invoiceEntries.findIndex((invoice) => invoice.id === action.payload.id);
                if (updatedIndex !== -1) {
                    state.invoiceEntries[updatedIndex] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.invoiceEntries = state.invoiceEntries.filter((invoice) => invoice.id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default invoicesSlice.reducer;
