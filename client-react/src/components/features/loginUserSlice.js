/* eslint-disable no-throw-literal */
// login user slice redux 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_LOGIN_URL, API_USER_GOALS } from '../../url/url';
import { createSelector } from "@reduxjs/toolkit";
export const loginUser = createAsyncThunk(
    "loginUser",
    async ({ userName, password }) => {
        try {
            const response = await axios.post(API_LOGIN_URL, { userName, password });
            if (response?.status === 200) {
                // console.log("login redux--", response);
                return { user: response.data, token: response.data.token };
            } else {
                // console.log("Error--Redux");
                throw { message: "Incorrect userName or password" };
            }
        } catch (error) {
            throw error.response?.data || { message: "User Data Unavailable" };
        }
    }
);
// fetch goals based on users
export const fetchGoals = createAsyncThunk(
    'fetchGoals',
    async ({ userId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_USER_GOALS, {
                params: {
                    userId,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            });
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 401) {
                console.error("Unauthorized error. Redirect to login.");
            }
            return rejectWithValue(error.response?.data || 'Failed to fetch goals');
        }
    }
);

export const selectUser = (state) => state.loginDetail.user;

export const selectIsAuthenticated = createSelector(
    selectUser,
    (user) => !!user
);
// Function to load goals from local storage
const loadGoalsFromLocalStorage = () => {
    const storedGoals = localStorage.getItem('goals');
    return storedGoals ? JSON.parse(storedGoals) : [];
};

const loadUserNameFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : "User";
}

const loginDetail = createSlice({
    name: "loginDetail",
    initialState: {
        goals: loadGoalsFromLocalStorage(),
        user: loadUserNameFromLocalStorage(),
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            // Clear local storage 
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('goals');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setGoals: (state, action) => {
            state.goals.push(action.payload);
        },

    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Unknown error occured";
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.goals = action.payload;
            })
    }
})
export const { login, logout, setUser, setToken, setGoals } = loginDetail.actions;
export const selectToken = (state) => state.loginDetail.token;
export const selectGoals = (state) => state.loginDetail.goals;
export default loginDetail.reducer;


