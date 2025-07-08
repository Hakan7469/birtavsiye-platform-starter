// pages/index.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Recommendation } from "@/types/supabase";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Home() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("recommendations").select("*");
      if (error) console.error("Veri çekme hatası:", error);
      else setData(data as Recommendation[]);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author) return;

    const { error } = await supabase.from("recommendations").insert({
      title,
      content,
      author,
    });

    if (error) console.error("Ekleme hatası:", error);
    else {
      setTitle("");
      setContent("");
      setAuthor("");
      location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col border border-black">
      {/* Üst Blok */}
      <div className="h-[120px] border border-black flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">Üst Blok</h1>

        {/* Arama ve Form */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Tavsiye ara..."
            className="border px-2 py-1 rounded"
          />

          <form onSubmit={handleSubmit} className="flex flex-col space-y-1">
            <input
              type="text"
              placeholder="Başlık"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <textarea
              placeholder="Tavsiye"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Yazar"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>

      {/* Alt Blok: Sol - Orta - Sağ */}
      <div className="flex flex-grow border-t border-black">
        {/* Sol Blok */}
        <div className="w-1/3 border border-black p-4 overflow-auto">
          <h2 className="font-bold text-lg mb-2">Tavsiyeler</h2>
          {data.length === 0 ? (
            <p>Veri bulunamadı.</p>
          ) : (
            <ul className="space-y-4">
              {data.map((item) => (
                <li key={item.id} className="border p-2 rounded">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm">{item.content}</p>
                  <p className="text-xs text-gray-600">Yazar: {item.author}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Orta Blok */}
        <div className="w-1/3 border border-black p-4">
          Orta Blok
        </div>

        {/* Sağ Blok */}
        <div className="w-1/3 border border-black p-4">
          Sağ Blok
        </div>
      </div>
    </div>
  );
}
