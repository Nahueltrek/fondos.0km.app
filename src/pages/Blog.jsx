import { useState } from "react";
import { Link } from "react-router-dom";
import { BLOG_POSTS, BLOG_CATEGORIAS } from "../data/blogPosts";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export default function Blog() {
  useDocumentTitle("Blog");
  const [categoria, setCategoria] = useState("");

  const filtered = categoria
    ? BLOG_POSTS.filter((p) => p.category === categoria)
    : BLOG_POSTS;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-2">Blog</h1>
      <p className="text-slate-400 mb-6">
        Fondos, digitalización y proyectos tecnológicos, explicados simple.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategoria("")}
          className={`text-xs px-3 py-1.5 rounded-full border ${
            categoria === "" ? "bg-brand text-slate-900 border-brand" : "border-slate-800 text-slate-400"
          }`}
        >
          Todas
        </button>
        {BLOG_CATEGORIAS.map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              categoria === c ? "bg-brand text-slate-900 border-brand" : "border-slate-800 text-slate-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-brand transition"
          >
            <span className="text-xs text-brand font-medium">{post.category}</span>
            <h2 className="font-semibold text-white mt-1 mb-1">{post.title}</h2>
            <p className="text-sm text-slate-400">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
