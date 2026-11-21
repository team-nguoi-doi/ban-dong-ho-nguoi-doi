import {createSlice, nanoid, type PayloadAction} from "@reduxjs/toolkit";

export interface Toast {
    id: string;
    message: string;
    type: 'warning' | 'success' | 'info';
}

const toastSlice = createSlice({
    name: 'toast',
    initialState: { items: [] as Toast[] },
    reducers: {
        addToast: {
            reducer(state, action: PayloadAction<Toast>) {
                state.items.push(action.payload);
            },

            prepare(message: string, type: Toast['type'] = 'warning') {
                return { payload: { id: nanoid(), message, type }}
            },
        },
        removeToast(state, action: PayloadAction<string>) {
            state.items = state.items.filter((t) => t.id !== action.payload);
        }
    }
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;