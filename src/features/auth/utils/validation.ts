import { z } from "zod";

export const loginVal = z.object({
    email: z.string().min(1, "Vui lòng nhập email").email('Email không hợp lệ'),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const registerVal = z.object({
    fullname: z.string().trim().min(1, "Vui lòng nhập họ tên"),
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ['confirmPassword'],
});

export type LoginForm = z.infer<typeof loginVal>;
export type RegisterForm = z.infer<typeof registerVal>;