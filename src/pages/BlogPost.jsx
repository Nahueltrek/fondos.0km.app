import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/blogPosts";

function renderInline(text) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) document.title = `${post.title} — fondos.0km.app`;
  }, [post]);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-slate-400">No encontramos este artículo.</p>
        <Link to="/blog" className="text-brand font-medium">Volver al blog</Link>
      </div>
    );
  }

  const paragraphs = post.content.split(/\n\n+/);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <span className="text-xs text-brand font-medium">{post.category}</span>
      <h1 className="text-2xl font-bold text-white mt-1 mb-6">{post.title}</h1>

      <div className="prose-sm text-slate-300 space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {renderInline(p.replace(/\n/g, " "))}
          </p>
        ))}
      </div>

      <div className="mt-10 bg-brand text-slate-900 rounded-xl p-6 text-center">
        <p className="mb-3 font-medium">¿Quieres evaluar tu propio proyecto?</p>
        <Link
          to="/diagnostico"
          className="inline-block bg-slate-950 text-brand font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-light transition"
        >
          Evaluar mi proyecto
        </Link>
      </div>
    </div>
  );
}
