import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PersonalInfoForm, ChangePasswordForm, ChangeEmailForm } from './utils/validation';
import type { PersonalInfo } from './utils/types';

interface AccountState {
    profile: PersonalInfo | null;
    loading: boolean;
    error: string | null;
}

const initialState: AccountState = {
    profile: null,
    loading: false,
    error: null,
};

export const updateUserProfile = createAsyncThunk<
    PersonalInfoForm,
    PersonalInfoForm,
    { rejectValue: string }
>(
    'account/updateUserProfile',
    async (form, { rejectWithValue }) => {
        try {
            const storedUser = localStorage.getItem('user');
            const currentUser = storedUser ? JSON.parse(storedUser) : {};
            const updatedUser = { ...currentUser, ...form };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            return form;
        } catch (error: any) {
            return rejectWithValue(error.message || "Cập nhật thất bại!");
        }
    }
);

export const changePassword = createAsyncThunk<
    void,
    ChangePasswordForm,
    { rejectValue: string }
>(
    'account/changePassword',
    async (form, { rejectWithValue }) => {
        try {
            const storedUser = localStorage.getItem('user');
            const currentUser = storedUser ? JSON.parse(storedUser) : {};

            // Giả lập lưu mật khẩu mới
            const updatedUser = { ...currentUser, password: form.newPassword };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error: any) {
            return rejectWithValue(error.message || "Đổi mật khẩu thất bại!");
        }
    }
);

export const changeEmail = createAsyncThunk<
    ChangeEmailForm,
    ChangeEmailForm,
    { rejectValue: string }
>(
    'account/changeEmail',
    async (form, { rejectWithValue }) => {
        try {
            const storedUser = localStorage.getItem('user');
            const currentUser = storedUser ? JSON.parse(storedUser) : {};

            const updatedUser = { ...currentUser, email: form.newEmail };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return form;
        } catch (error: any) {
            return rejectWithValue(error.message || "Đổi email thất bại!");
        }
    }
);

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (state.profile) {
                    Object.assign(state.profile, action.payload);
                }
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Cập nhật thất bại";
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Đổi mật khẩu thất bại";
            })
            .addCase(changeEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeEmail.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changeEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Đổi email thất bại";
            });
    },
});

export default accountSlice.reducer;