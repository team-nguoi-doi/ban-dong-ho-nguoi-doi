import {Link} from "react-router-dom";
import type {BackLinkProps} from "../utils/types.ts";
import '../css/BackLink.css';

function BackLink({ to = '/', label = 'Trang chủ', corner = false }: BackLinkProps) {
    return (
        <Link to={to} className={`back-link ${corner ? 'back-link--corner' : ''}`}>
            <svg
                className="back-link__icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M19 12H5" />
                <path d="M11 6l-6 6 6 6" />
            </svg>
            <span className="back-link__text">{label}</span>
        </Link>
    )
}

export default BackLink