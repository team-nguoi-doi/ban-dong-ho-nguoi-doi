import {useProductComments} from "../useProductComments.ts";
import {useRef, useState} from "react";
import {emitComment} from "../utils/commentEvents.ts";
import {useAppSelector} from "../../../hooks/hooks.ts";
import {Link} from "react-router-dom";
import './ProductComment.css';

export function ProductComments({ productId }: { productId: string }) {

    const comments = useProductComments(productId);
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const user = useAppSelector(state => state.auth.user);

    const handleSubmit = async () => {
        if(!user) return;
        if(!text.trim()) return;

        const body = {
            productId: productId,
            userId: user.id,
            userName: user.fullName,
            content: text.trim(),
            createdAt: new Date().toISOString(),
        };

        const res = await fetch('http://localhost:3001/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const saved = await res.json(); // json-server thêm id
        emitComment(saved); // phát

        setText('');
        inputRef.current?.focus();
    }

    return (
        <section className="product-comments" id="comments" aria-labelledby="comments-title">
            <h2 className="product-comments__title" id="comments-title">
                Bình luận <span className="product-comments__count">({comments.length})</span>
            </h2>

            {user ? (
                <div className="product-comments__composer">
                    <span className="product-comments__avatar" aria-hidden="true">
                        {user.fullName.charAt(0)}
                    </span>
                    <input
                        ref={inputRef}
                        className="product-comments__input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        aria-label="Viết bình luận"
                    />
                    <button
                        type="button"
                        className="product-comments__submit"
                        onClick={handleSubmit}
                        disabled={!text.trim()}
                    >
                        Gửi
                    </button>
                </div>
            ) : (
                <p className="product-comments__login">
                    Vui lòng{' '}
                    <Link to="/login" state={{ from: location.pathname }} className="product-comments__login-link">
                        đăng nhập
                    </Link>{' '}
                    để bình luận.
                </p>
            )}

            {comments.length === 0 ? (
                <p className="product-comments__empty">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            ) : (
                <ul className="product-comments__list">
                    {comments.map((c) => (
                        <li key={c.id} className="product-comments__item">
                            <span className="product-comments__avatar" aria-hidden="true">
                                {c.userName.charAt(0)}
                            </span>
                            <div className="product-comments__body">
                                <div className="product-comments__head">
                                    <strong className="product-comments__author">{c.userName}</strong>
                                    <time className="product-comments__time" dateTime={c.createdAt}>
                                        {new Date(c.createdAt).toLocaleString('vi-VN')}
                                    </time>
                                </div>
                                <p className="product-comments__content">{c.content}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}