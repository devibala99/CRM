import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_REGISTER_URL, API_GET_REGISTERED_USERS, API_CHECK_REGISTERD_USERS, API_UPDATE_USER } from '../../url/url';

// create action
export const createUser = createAsyncThunk(
    "createUser",
    async (data) => {
        try {
            const response = await axios.post(API_REGISTER_URL, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Unknown error occurred" };
        }
    }
);

// get user to check if user already exist
export const getUser = createAsyncThunk(
    "getUser",
    async () => {
        try {
            const response = await axios.get(API_GET_REGISTERED_USERS);
            // console.log(response.data, "redux-code");
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Unknown error in getting data" };
        }
    }
);


// check user existance
export const checkUser = createAsyncThunk(
    "checkUser",
    async (email) => {
        try {
            const response = await axios.post(API_CHECK_REGISTERD_USERS, { email });
            return response.data.exists;
        }
        catch (error) {
            throw error.response?.data || { message: "Unknown error in check user" }
        }
    }
)
export const updateUserDetails = createAsyncThunk(
    "updateUserDetails",
    async ({ userId, updatedData }) => {
        // console.log("userId", userId, updatedData, "Redux")
        try {
            const response = await axios.put(`${API_UPDATE_USER}/${userId}`, updatedData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Unknown error occurred" };
        }
    }
);


const registerDetail = createSlice({
    name: "registerDetail",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Unknown error occurred";

            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
            })

            .addCase(checkUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userExists = action.payload;
                state.error = null;
            })
            .addCase(checkUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Unknown error occurred";

            })
            .addCase(updateUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Unknown error occurred";
            });
    },
});

export default registerDetail.reducer;
