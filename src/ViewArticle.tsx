import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getArticle, type Article } from "./api";

export default function ViewArticle() {
    const { slug } = useParams();
    const [article, setArticle] = useState<Article | null | undefined>(undefined);

    useEffect(() => {
        if (slug) getArticle(slug).then(setArticle);
    }, [slug]);

    if (article === undefined) return <p>Загрузка...</p>;
    if (article === null) return <p>Статья не найдена. <a href="/">Создать новую</a></p>;

    return (
        <div className="container">
            <h1 style={{ fontSize: 38, marginBottom: 8 }}>{article.title}</h1>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>
                {new Date(article.created_at).toLocaleDateString("ru-RU")}
            </p>
            <div style={{ fontSize: 19 }}>
                <ReactMarkdown>{article.content_md}</ReactMarkdown>
            </div>
        </div>
    );
}