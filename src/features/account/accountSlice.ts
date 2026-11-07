import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PersonalInfoForm } from './utils/validation.ts';
import type { PersonalInforType } from './utils/types.ts';

export const updateUserProfile = createAsyncThunk<
    PersonalInforType,
    PersonalInfoForm,
    { rejectValue: string }
>(
    'account/updateUserProfile',
    async (form, { rejectWithValue }) => {
        try {
            return form as unknown as PersonalInforType;
        } catch (error: any) {
            return rejectWithValue(error.message || "Cập nhật thất bại!");
        }
    }
);

const accountSlice = createSlice({
    name: 'account',
    initialState: {},
    reducers: {},
});

export default accountSlice.reducer;