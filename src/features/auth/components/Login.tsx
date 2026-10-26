
function Login() {
    return (
        <div className="login">
            <form className="login__form" method="POST">
                <h3 className="login__heading">Đăng nhập</h3>
                <p className="login__desc">
                    Chào mừng bạn quay lại, đăng nhập để tiếp tục mua sắm
                </p>

                <div className="login__spacer"></div>

                <div className="login__group">
                    <label htmlFor="login-email" className="login__label">
                        Email
                    </label>
                    <input
                        id="login-email"
                        name="email"
                        type="text"
                        placeholder="VD: email@domain.com"
                        className="login__control"
                        data-rules="required|email"
                    />
                    <span className="login__message"></span>
                </div>

                <div className="login__group">
                    <label htmlFor="login-password" className="login__label">
                        Mật khẩu
                    </label>
                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="login__control"
                        data-rules="required|min:6"
                    />
                    <span className="login__message"></span>
                </div>

                <button type="submit" className="login__submit">
                    Đăng nhập
                </button>

                <p className="login__footer">
                    Chưa có tài khoản?{' '}
                    <a href="/register" className="login__link">
                        Đăng ký
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Login;