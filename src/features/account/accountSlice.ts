import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PersonalInfoForm, ChangePasswordForm, ChangeEmailForm } from './utils/validation';
import type { Address, PersonalInfo } from './utils/types';
import { accountApi } from './api/accountApi';
import type { RootState } from '../../store/store.ts';

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
    { state: RootState; rejectValue: string }
>(
    'account/updateUserProfile',
    async (form, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id;
            if (!userId) throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");

            await accountApi.updateProfile(userId, form);
            return form;
        } catch (error: any) {
            return rejectWithValue(error.message || "Cập nhật thất bại!");
        }
    }
);

export const changePassword = createAsyncThunk<
    void,
    ChangePasswordForm,
    { state: RootState; rejectValue: string }
>(
    'account/changePassword',
    async (form, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id;
            if (!userId) throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");

            await accountApi.changePassword(userId, form.newPassword);
        } catch (error: any) {
            return rejectWithValue(error.message || "Đổi mật khẩu thất bại!");
        }
    }
);

export const changeEmail = createAsyncThunk<
    ChangeEmailForm,
    ChangeEmailForm,
    { state: RootState; rejectValue: string }
>(
    'account/changeEmail',
    async (form, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id;
            if (!userId) throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");

            await accountApi.changeEmail(userId, form.newEmail);
            return form;
        } catch (error: any) {
            return rejectWithValue(error.message || "Đổi email thất bại!");
        }
    }
);

export const updateUserAddresses = createAsyncThunk<
    Address[],
    Address[],
    { state: RootState; rejectValue: string }
>(
    'account/updateUserAddresses',
    async (addresses, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id;
            if (!userId) throw new Error("Phiên đăng nhập đã hết hạn");

            await accountApi.updateAddresses(userId, addresses);
            return addresses;
        } catch (error: any) {
            return rejectWithValue(error.message || "Không thể cập nhật địa chỉ!");
        }
    }
);

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Update Profile
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

            // Change Password
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

            // Change Email
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
            })

            // Update Addresses (Đã thêm đầy đủ)
            .addCase(updateUserAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserAddresses.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUserAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Lưu địa chỉ thất bại";
            });
    },
});

export default accountSlice.reducer;