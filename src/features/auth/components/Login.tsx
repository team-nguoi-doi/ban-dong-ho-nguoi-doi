import {useState} from "react";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {type LoginForm, loginVal} from "../utils/validation.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import { login as loginUser } from "../authSlice.ts";
import { useAppDispatch } from "../../../hooks/hooks.ts";
import BackLink from "./BackLink.tsx";

function Login() {

    const [serverError, setServerError] = useState("");
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({ resolver: zodResolver(loginVal) });

    const onSubmit = async (values: LoginForm) => {
        setServerError("");
        try {
            await dispatch(loginUser(values)).unwrap();
        } catch (message) {
            setServerError(typeof message === "string" ? message : "Có lỗi xảy ra");
        }
    }

    return (

        <div className="login">
            <BackLink corner />
            <form className="login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <h3 className="login__heading">Đăng nhập</h3>
                <p className="login__desc">
                    Chào mừng bạn quay lại, đăng nhập để tiếp tục mua sắm
                </p>

                <div className="login__spacer"></div>

                {serverError && <p className="login__error">{serverError}</p>}

                <div className={`login__group ${errors.email ? 'login__group--invalid' : ''}`}>
                    <label htmlFor="login-email" className="login__label">
                        Email
                    </label>
                    <input
                        id="login-email"
                        type="text"
                        placeholder="VD: hanhan@domain.com"
                        className="login__control"
                        data-rules="required|email"
                        {...register('email')}
                    />
                    <span className="login__message">{errors.email?.message}</span>
                </div>

                <div className={`login__group ${errors.password ? 'login__group--invalid' : ''}`}>
                    <label htmlFor="login-password" className="login__label">
                        Mật khẩu
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="login__control"
                        data-rules="required|min:6"
                        {...register('password')}
                    />
                    <span className="login__message">{errors.password?.message}</span>
                </div>

                <button type="submit" className="login__submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                <p className="login__footer">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="login__link">
                        Đăng ký
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;