import { z } from "zod";

export const personalInfoVal = z.object({
    title: z.string().min(1, "Vui lòng chọn danh xưng"),
    fullName: z.string().min(1, "Vui lòng nhập đầy đủ họ tên"),
    phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
    dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh"),
});

export type PersonalInfoForm = z.infer<typeof personalInfoVal>;