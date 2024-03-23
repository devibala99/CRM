import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    API_ADD_EMPLOYEE,
    API_GET_EMPLOYEE,
    API_DELETE_EMPLOYEE,
    API_UPDATE_EMPLOYEE
} from "../../url/url";

// create new Employee
export const createEmployee = createAsyncThunk(
    "createEmployee",
    async (data) => {
        try {
            const response = await axios.post(API_ADD_EMPLOYEE, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        }
        catch (error) {
            alert("Some Internal Error Occured, Please Try Again");
            throw error.response.data;
        }
    }
)

// get all Employee -read 
export const showEmployees = createAsyncThunk(
    'showEmployees',
    async () => {
        try {
            const response = await axios.get(API_GET_EMPLOYEE);
            return response.data;
        }
        catch (error) {
            if (error.response && error.response.status === 404) {
                return [];
            } else {
                throw error.response.data;
            }
        }
    }
)

// delete Employee -delete
export const deleteEmployee = createAsyncThunk(
    "deleteEmployee",
    async (id) => {
        try {
            const response = await axios.delete(API_DELETE_EMPLOYEE + `/${id}`);
            return response.data;
        }
        catch (error) {
            alert("Please Try Again. Something Went Wrong!!!");
            throw error.response.data;
        }
    }
);

// update Employee - put
export const updateEmployee = createAsyncThunk(
    "updateEmployee",
    async ({ id, data }) => {
        try {
            const response = await axios.put(API_UPDATE_EMPLOYEE + `/${id}`, data);
            return response.data;
        }
        catch (error) {
            alert("Please Try Again. Something Went Wrong!!!")
            throw error.response.data;
        }
    }
);
const initialState = {
    employeeEntries: [],
    loading: false,
    error: null,
}
export const Employees = createSlice({
    name: 'Employees',
    initialState,
    reducers: {
        searchEmployee: (state, action) => {
            state.employeeEntries = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // createEmployee status

            .addCase(createEmployee.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeEntries.push(action.payload);
                state.error = null;
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // showEmployee status

            .addCase(showEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(showEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeEntries = action.payload;
                state.error = null;
            })
            .addCase(showEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // deleteEmployee status
            .addCase(deleteEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.loading = false;
                const { id } = action.payload;
                if (id) {
                    state.employeeEntries = state.employeeEntries.filter((element) => element.id !== id);
                }
                state.error = null;
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // updateEmployee status
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeEntries = state.employeeEntries.map((element) =>
                    element.id === action.payload.id ? action.payload : element
                );
                state.error = null;
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        return builder;
    },
})

export const { searchEmployee } = Employees.actions;
export default Employees.reducer;