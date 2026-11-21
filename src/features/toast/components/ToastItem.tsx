import {removeToast, type Toast} from "../toastSlice.ts";
import {useAppDispatch} from "../../../hooks/hooks.ts";
import {useEffect, useState} from "react";

function ToastItem({ toast }: { toast: Toast }) {
    const dispatch = useAppDispatch();
    const [leaving, setLeaving] = useState(false);

    const SHOW_MS = 3000;
    const LEAVE_MS = 400;

    useEffect(() => {
        const hide = setTimeout(() => setLeaving(true), SHOW_MS);
        const remove = setTimeout(() => dispatch(removeToast(toast.id)), SHOW_MS + LEAVE_MS);

        return () => {
            clearTimeout(hide);
            clearTimeout(remove);
        }
    }, [dispatch, toast.id]);

    return (
        <div className={`toast toast--${toast.type} ${leaving ? 'toast--leave' : ''}`}>
            <span className="toast__message">{toast.message}</span>
            <button type="button"
                    className="toast__close"
                    aria-label="Đóng thông báo"
                    onClick={() => dispatch(removeToast(toast.id))}>×</button>
        </div>
    )
}

export default ToastItem;