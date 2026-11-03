import {useState} from "react";
import {useForm} from "react-hook-form";
import {type RegisterForm, registerVal} from "../utils/validation.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../authSlice.ts";
import {useAppDispatch} from "../../../hooks/hooks.ts";

function Register() {
    const [serverError, setServerError] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({ resolver: zodResolver(registerVal) });

    const onSubmit = async ({fullName, email, password}: RegisterForm) => {
        setServerError("");
        try {
            await dispatch(registerUser({fullName, email, password})).unwrap();
            navigate("/login");
        } catch (message) {
            setServerError(typeof message === "string" ? message : "Có lỗi xảy ra");
        }
    }

    return (
        <div className="register">
            <form className="register__form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <h3 className="register__heading">Thành viên đăng ký</h3>
                <p className="register__desc">
                    Tận hưởng khoảnh khắc mua sắm tại đồng hồ Viren ❤️
                </p>

                <div className="register__spacer"></div>

                {serverError && <p className="register__error">{serverError}</p>}

                <div className={`register__group ${errors.fullName ? 'register__group--invalid' : ''}`}>
                    <label htmlFor="fullname" className="register__label">
                        Tên đầy đủ
                    </label>
                    <input
                        id="fullname"
                        type="text"
                        placeholder="VD: Hân Hân"
                        className="register__control"
                        data-rules="required"
                        {...register('fullName')}
                    />
                    <span className="register__message">{errors.fullName?.message}</span>
                </div>

                <div className={`register__group ${errors.email ? 'register__group--invalid' : ''}`}>
                    <label htmlFor="email" className="register__label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="text"
                        placeholder="VD: hanhan@domain.com"
                        className="register__control"
                        data-rules="required|email"
                        {...register('email')}
                    />
                    <span className="register__message">{errors.email?.message}</span>
                </div>

                <div className={`register__group ${errors.password ? 'register__group--invalid' : ''}`}>
                    <label htmlFor="password" className="register__label">
                        Mật khẩu
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="register__control"
                        data-rules="required|min:6"
                        {...register('password')}
                    />
                    <span className="register__message">{errors.password?.message}</span>
                </div>

                <div className={`register__group ${errors.confirmPassword ? 'register__group--invalid' : ''}`}>
                    <label htmlFor="confirmPassword" className="register__label">
                        Nhập lại mật khẩu
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="register__control"
                        data-rules="required|min:6"
                        {...register('confirmPassword')}
                    />
                    <span className="register__message">{errors.confirmPassword?.message}</span>
                </div>

                <button type="submit" className="register__submit">
                    Đăng ký
                </button>

                <p className="register__footer">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="register__link"></Link>
                </p>
            </form>
        </div>
    );
}

export default Register;