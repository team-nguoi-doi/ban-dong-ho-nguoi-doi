
function Register() {
    return (
        <div className="register">
            <form className="register__form" method="POST">
                <h3 className="register__heading">Thành viên đăng ký</h3>
                <p className="register__desc">
                    Tận hưởng khoảnh khắc mua sắm tại đồng hồ Người Dơi ❤️
                </p>

                <div className="register__spacer"></div>

                <div className="register__group">
                    <label htmlFor="fullname" className="register__label">
                        Tên đầy đủ
                    </label>
                    <input
                        id="fullname"
                        name="fullname"
                        type="text"
                        placeholder="VD: Hân Hân"
                        className="register__control"
                        data-rules="required"
                    />
                    <span className="register__message"></span>
                </div>

                <div className="register__group">
                    <label htmlFor="email" className="register__label">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        placeholder="VD: hanhan@domain.com"
                        className="register__control"
                        data-rules="required|email"
                    />
                    <span className="register__message"></span>
                </div>

                <div className="register__group">
                    <label htmlFor="password" className="register__label">
                        Mật khẩu
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="register__control"
                        data-rules="required|min:6"
                    />
                    <span className="register__message"></span>
                </div>

                <button type="submit" className="register__submit">
                    Đăng ký
                </button>
            </form>
        </div>
    );
}

export default Register;