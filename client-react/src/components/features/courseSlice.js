import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_FETCH_COURSE,
    API_CREATE_COURSE,
    API_UPDATE_COURSE,
    API_DELETE_COURSE
} from "../../url/url";

export const fetchCourse = createAsyncThunk(
    "fetchCourse",
    async () => {
        try {
            const response = await axios.get(API_FETCH_COURSE);
            return response.data;
        }
        catch (error) {
            throw error.response.data;
        }
    }
);

export const createCourse = createAsyncThunk(
    "createCourse",
    async (courseData) => {
        try {
            const response = await axios.post(API_CREATE_COURSE, courseData);
            return response.data;
        }
        catch (error) {
            throw error.response.data;
        }
    }
);

export const updateCourse = createAsyncThunk(
    "updateCourse",
    async ({ courseId, courseData }) => {
        try {
            const response = await axios.put(`${API_UPDATE_COURSE}/${courseId}`, courseData);
            // console.log("Redux--", response.data);
            return response.data;
        } catch (error) {
            // console.log("Redux--", error.response.data);
            throw error.response.data;
        }
    }
);


export const deleteCourse = createAsyncThunk(
    "deleteCourse",
    async (courseId) => {
        try {
            const response = await axios.delete(`${API_DELETE_COURSE}/${courseId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const courseSlice = createSlice({
    name: "courses",
    initialState: {
        courseEntries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courseEntries = action.payload;
                state.error = null;
            })
            .addCase(fetchCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    courseEntries: Array.isArray(state.courseEntries) ? [...state.courseEntries, action.payload] : [action.payload],
                    error: null,
                };
            })

            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(updateCourse.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.courseEntries = state.courseEntries ? state.courseEntries.map(course => course.courseId === action.payload.id ? action.payload : course) : [];
            //     state.error = null;
            // })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courseEntries = state.courseEntries?.map(course => course.courseId === action.payload.id ? action.payload : course) || [];
                state.error = null;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(deleteCourse.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.courseEntries = state.courseEntries.filter(course => course.id !== action.payload.id);
            //     state.error = null;
            // })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courseEntries = state.courseEntries?.filter(course => course.id !== action.payload.id) || [];
                state.error = null;
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

    }
})

export default courseSlice.reducer;
