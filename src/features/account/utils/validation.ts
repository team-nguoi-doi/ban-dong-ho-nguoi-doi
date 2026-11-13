import { z } from "zod";

export const personalInfoVal = z.object({
    title: z.string().min(1, "Vui lòng chọn danh xưng"),
    fullName: z
        .string()
        .min(2, "Họ và tên phải có ít nhất 2 ký tự")
        .max(50, "Họ và tên không vượt quá 50 ký tự"),
    phone: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^(0[3|5|7|8|9][0-9]{8}|\+[1-9]\d{1,14})$/.test(val.trim()),
            {
                message: "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)",
            }
        ),

    dateOfBirth: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true; // Bỏ trống vẫn hợp lệ

                const birthDate = new Date(val);
                const today = new Date();

                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                return birthDate < today && age >= 16 && age <= 100;
            },
            {
                message: "Ngày sinh không hợp lệ (Bạn phải từ 16 tuổi trở lên)",
            }
        ),
});

export type PersonalInfoForm = z.infer<typeof personalInfoVal>;

export const changePasswordVal = z.object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type ChangePasswordForm = z.infer<typeof changePasswordVal>;

export const changeEmailVal = z.object({
    newEmail: z.string().min(1, "Vui lòng nhập email mới").email("Email không hợp lệ"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu để xác thực"),
});

export type ChangeEmailForm = z.infer<typeof changeEmailVal>;