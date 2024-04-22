import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_ADD_CLIENT, API_DELETE_CLIENT, API_GET_CLIENT
} from "../../url/url";

export const createClient = createAsyncThunk(
    "createClient",
    async (data) => {
        try {
            const response = await axios.post(API_ADD_CLIENT, data);
            return response.data;
        }
        catch (error) {
            throw error.response.data;
        }
    }
);

export const showClients = createAsyncThunk(
    "showClients",
    async () => {
        try {
            const response = await axios.get(API_GET_CLIENT);
            return response.data;
        }
        catch (error) {
            throw error.response.data;

        }
    }
);

export const deleteClient = createAsyncThunk(
    "deleteClient",
    async (id) => {
        try {
            const response = await axios.delete(API_DELETE_CLIENT + `/${id}`);
            return response.data;
        }
        catch (error) {
            throw error.response.data;
        }
    }
)

export const clients = createSlice({
    name: "clients",
    initialState: {
        clientEntries: [],
        loading: false,
        error: null,
    },
    reducers: {
        searchClient: (state, action) => {
            state.clientEntries = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createClient.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.loading = false;
                const newClient = action.payload;
                state.clientEntries = [...state.clientEntries, newClient];
                state.error = null;
            })

            .addCase(createClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(showClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(showClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clientEntries = action.payload;
                state.error = null;
            })
            .addCase(showClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = false;
                const { id } = action.payload;
                if (id) {
                    state.clientEntries = state.clientEntries.filter((element) => element.id !== id);
                }
                state.error = null;
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        return builder;
    }
})

export const { searchClient } = clients.actions;
export default clients.reducer;