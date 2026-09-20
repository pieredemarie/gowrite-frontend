const BASE_URL = `${import.meta.env.VITE_API_URL}/api/articles`;

export interface Article {
    slug: string;
    title: string;
    content_md: string;
    created_at: string;
}

export async function createArticle(title: string, contentMd: string) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content_md: contentMd }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{ slug: string; token: string }>;
}

export async function getArticle(slug: string) {
    const res = await fetch(`${BASE_URL}/${slug}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<Article>;
}

export async function updateArticle(slug: string, token: string, title: string, contentMd: string) {
    const res = await fetch(`${BASE_URL}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Edit-Token": token },
        body: JSON.stringify({ title, content_md: contentMd }),
    });
    if (!res.ok) throw new Error(await res.text());
}