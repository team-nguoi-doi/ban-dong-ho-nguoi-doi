
export interface ProductComment {
    id: string;
    productId: string;
    userName: string;
    content: string;
    createdAt: string;
}

const eventName = (productId: string | number) => `comment:${productId}`;

// phát bình luận tới những ai đang nghe sp này
export const emitComment = (c: ProductComment) => {
    window.dispatchEvent(new CustomEvent<ProductComment>(eventName(c.productId), { detail: c }));
}

// đăng ký nghe
export const subscribeComment = (
    productId: string,
    callback: (c: ProductComment) => void,
) => {
    const listener = (e: Event) => {
        callback((e as CustomEvent<ProductComment>).detail);
    }
    window.addEventListener(eventName(productId), listener);
    return () => window.removeEventListener(eventName(productId), listener);
}