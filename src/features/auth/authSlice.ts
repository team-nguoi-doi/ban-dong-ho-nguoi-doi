import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { User, RegisterPayload, LoginPayload } from "./index.ts";
import { authApi } from './api/authApi.ts';
import { updateUserProfile, changeEmail, updateUserAddresses } from '../account/accountSlice';

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

export const initAuth = createAsyncThunk(
    'auth/init',
    async () : Promise<User | null> => {
        const id = localStorage.getItem(STORAGE_KEY);
        if(!id) return null;
        try {
            return await authApi.getProfile(id);
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(initAuth.fulfilled, (state, action) => {
            state.isInitialized = true;
            if (action.payload) {
                const user = action.payload;
                const addresses = user.addresses || [];
                const defaultShipping = addresses.find((a) => a.isDefaultShipping) || addresses[0];

                state.user = {
                    ...user,
                    addresses,
                    shippingAddress: user.shippingAddress || defaultShipping,
                };
            } else {
                state.user = null;
            }
            state.isAuthenticated = action.payload !== null;
        });

        builder.addCase(login.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            const user = action.payload;
            const addresses = user.addresses || [];
            const defaultShipping = addresses.find((a) => a.isDefaultShipping) || addresses[0];

            state.user = {
                ...user,
                addresses,
                shippingAddress: defaultShipping,
            };
        });

        builder.addCase(logout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.user = null;
        });

        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            if (state.user) {
                Object.assign(state.user, action.payload);
            }
        });

        builder.addCase(changeEmail.fulfilled, (state, action) => {
            if (state.user) {
                state.user.email = action.payload.newEmail;
            }
        });

        builder.addCase(updateUserAddresses.fulfilled, (state, action) => {
            if (state.user) {
                const newAddresses = Array.isArray(action.payload) ? action.payload : [];
                const defaultShipping = newAddresses.find((addr) => addr.isDefaultShipping) || newAddresses[0];

                state.user = {
                    ...state.user,
                    addresses: newAddresses,
                    shippingAddress: defaultShipping,
                };
            }
        });
    },
});

export default authSlice.reducer;