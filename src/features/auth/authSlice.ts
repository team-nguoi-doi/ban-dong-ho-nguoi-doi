import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { User, RegisterPayload, LoginPayload } from "./index.ts";
import { authApi } from './api/authApi.ts';
import { updateUserProfile } from '../account/accountSlice';

const STORAGE_KEY = "user_id";

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
);

// đn action login
export const login = createAsyncThunk<User, LoginPayload, {rejectValue: string}>(
    'auth/login',
    async (form, {rejectWithValue}) => {
        try {
            const user = await authApi.login(form);
            localStorage.setItem(STORAGE_KEY, String(user.id));
            return user;
        } catch (error) {
            return rejectWithValue(getMessage(error));
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem(STORAGE_KEY);
    }
);

const authSlice = createSlice({
    initialState,
    name: 'auth',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        });

        builder.addCase(logout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.user = null;
        });

        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload,
                };
            }
        });
    },
});

export default authSlice.reducer;