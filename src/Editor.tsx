import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createArticle, updateArticle, getArticle } from "./api";

export default function Editor() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [result, setResult] = useState<{ slug: string; token: string } | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const isEditMode = Boolean(slug);

    useEffect(() => {
        if (!slug) return;
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");
        const savedToken = urlToken || localStorage.getItem(`edit_token:${slug}`);

        if (!savedToken) {
            navigate(`/${slug}`);
            return;
        }

        if (urlToken) localStorage.setItem(`edit_token:${slug}`, urlToken);

        setToken(savedToken);
        getArticle(slug).then((article) => {
            if (article) {
                setTitle(article.title);
                setContent(article.content_md);
            }
        });
    }, [slug]);

    async function handlePublish() {
        if (isEditMode && slug && token) {
            await updateArticle(slug, token, title, content);
            navigate(`/${slug}`);
        } else {
            const res = await createArticle(title, content);
            localStorage.setItem(`edit_token:${res.slug}`, res.token);
            setResult(res);
        }
    }

    if (result) {
        const editUrl = `${window.location.origin}/edit/${result.slug}?token=${result.token}`;
        return (
            <div className="container">
                <p>Статья опубликована!</p>
                <p>Ссылка для чтения: <a href={`/${result.slug}`}>{window.location.origin}/{result.slug}</a></p>
                <p>
                    Ссылка для редактирования (сохраните — она больше нигде не покажется):
                    <br />
                    <code>{editUrl}</code>
                </p>
            </div>
        );
    }

    return (
        <div className="container">
            <input
                className="editor-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Заголовок"
            />
            <textarea
                className="editor-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                placeholder="Расскажите свою историю..."
            />
            <button className="publish-btn" onClick={handlePublish}>
                {isEditMode ? "Сохранить изменения" : "Опубликовать"}
            </button>
        </div>
    );
}