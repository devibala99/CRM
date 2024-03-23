import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./components/features/rootReducer";
export const store = configureStore({
    devTools: true,
    reducer: rootReducer,
})