
export interface User {
    id: string;
    fullName: string;
    email: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface BackLinkProps {
    to: string;
    label: string;
    corner: boolean;
}