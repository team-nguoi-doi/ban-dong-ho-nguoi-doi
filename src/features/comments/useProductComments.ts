import {useEffect, useState} from "react";
import {type ProductComment, subscribeComment} from "./utils/commentEvents.ts";

export function useProductComments(productId: string) {
    const [comments, setComments] = useState<ProductComment[]>([]);

    useEffect(() => {
        let ignore = false;
        setComments([]);

        fetch(`http://localhost:3001/comments?productId=${productId}`)
            .then((res) => res.json())
            .then((data) => {
                if(!ignore) setComments(data);
            });

        const unsubscribe = subscribeComment(productId, (c) => {
            setComments((prev) => prev.some((x) => x.id === c.id) ? prev : [c, ...prev]);
        });

        // khi đổi sp hoặc rời trang
        return () => {
            ignore = true;
            unsubscribe();
        }
    }, [productId]);

    return comments;
}