import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { User, RegisterPayload } from "./index.ts";
import { authApi } from './api/authApi.ts';

interface AuthState {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: AuthState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
}

const authSlice = createSlice({
    initialState,
    name: 'auth',
    reducers: {},
})

const getMessage = (e: unknown) =>
    e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại';

// định nghĩa action register
export const register = createAsyncThunk<void, RegisterPayload, {rejectValue: string}>(
    'auth/register', // tiền tố action
    async (form, {rejectWithValue}) => {
        try {
            await authApi.register(form);
        } catch (error) {
            return rejectWithValue(getMessage(error));
        }
    }
)

export default authSlice.reducer;