
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