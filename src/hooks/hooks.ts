// hooks custom ở đây định nghĩa  kiểu dispatch vào useDispatch, tránh lỗi khi nhận một thunk function
                                // định nghĩa kiểu cho tham số state khi lấy nó bằng type interface
import {type TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import type { Dispatch, RootState } from "../store/store.ts";

export const useAppDispatch = () => useDispatch<Dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;