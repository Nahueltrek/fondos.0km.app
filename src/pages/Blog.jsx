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
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Blog</h1>
      <p className="text-gray-600 mb-6">
        Fondos, digitalización y proyectos tecnológicos, explicados simple.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategoria("")}
          className={`text-xs px-3 py-1.5 rounded-full border ${
            categoria === "" ? "bg-brand text-white border-brand" : "border-gray-200 text-gray-600"
          }`}
        >
          Todas
        </button>
        {BLOG_CATEGORIAS.map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              categoria === c ? "bg-brand text-white border-brand" : "border-gray-200 text-gray-600"
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
            className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-brand transition"
          >
            <span className="text-xs text-brand font-medium">{post.category}</span>
            <h2 className="font-semibold text-brand-dark mt-1 mb-1">{post.title}</h2>
            <p className="text-sm text-gray-600">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
