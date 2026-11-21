import {useAppSelector} from "../../../hooks/hooks.ts";
import ToastItem from "./ToastItem.tsx";
import '../css/Toast.css';

export default function ToastContainer() {
    const toasts = useAppSelector((state) => state.toast.items);
    return (
        <div className="toast-container" role="status" aria-live="polite">
            {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
        </div>
    )
}