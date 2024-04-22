import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_CREATE_INTERVIEW_DETAIL,
    API_FETCH_INTERVIEW_DETAILS,
    API_UPDATE_INTERVIEW_DETAIL,
    API_DELETE_INTERVIEW_DETAIL
} from "../../url/url";

export const createInterview = createAsyncThunk(
    "createInterview",
    async (data) => {
        try {
            const response = await axios.post(API_CREATE_INTERVIEW_DETAIL, data);
            return response.data;
        } catch (error) {
            alert("Some Internal Error Occurred, Please Try Again");
            throw error.response.data;
        }
    }
);

export const fetchInterviews = createAsyncThunk(
    "fetchInterviews",
    async () => {
        try {
            const response = await axios.get(API_FETCH_INTERVIEW_DETAILS);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const updateInterview = createAsyncThunk(
    "updateInterview",
    async ({ id, data }) => {
        try {
            const response = await axios.put(`${API_UPDATE_INTERVIEW_DETAIL}/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const deleteInterview = createAsyncThunk(
    "deleteInterview",
    async (id) => {
        try {
            const response = await axios.delete(`${API_DELETE_INTERVIEW_DETAIL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const interviewSlice = createSlice({
    name: "interviews",
    initialState: {
        interviewEntries: [],
        loading: false,
        error: null,
    },
    reducers: {
        searchInterview: (state, action) => {
            state.interviewEntries = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createInterview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInterview.fulfilled, (state, action) => {
                state.loading = false;
                state.interviewEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createInterview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchInterviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInterviews.fulfilled, (state, action) => {
                state.loading = false;
                state.interviewEntries = action.payload;
                state.error = null;
            })
            .addCase(fetchInterviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateInterview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateInterview.fulfilled, (state, action) => {
                state.loading = false;
                const updatedInterview = action.payload;
                const index = state.interviewEntries.findIndex(interview => interview.id === updatedInterview.id);
                if (index !== -1) {
                    state.interviewEntries[index] = updatedInterview;
                }
                state.error = null;
            })
            .addCase(updateInterview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteInterview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteInterview.fulfilled, (state, action) => {
                state.loading = false;
                const { id } = action.payload;
                if (id) {
                    state.interviewEntries = state.interviewEntries.filter((element) => element.id !== id);
                }
                state.error = null;
            })
            .addCase(deleteInterview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { searchInterview } = interviewSlice.actions;
export default interviewSlice.reducer;
