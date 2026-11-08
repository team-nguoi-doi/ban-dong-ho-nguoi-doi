import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { addToCart } from './CartSlice';
import type { AddToCartPayload } from './utils/types';


export function useAddToCart() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

    return (payload: AddToCartPayload): boolean => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return false;
        }
        dispatch(addToCart(payload));
        return true;
    };
}
