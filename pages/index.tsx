// pages/index.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Recommendation } from "@/types/supabase";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [entryAuthor, setEntryAuthor] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      const { data, error } = await supabase.from("recommendations").select("*");
      if (error) console.error("Veri çekme hatası:", error);
      else setRecommendations(data as Recommendation[]);
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!selectedRecommendation) return;
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("recommendation_id", selectedRecommendation.id);
      if (error) console.error("Entry çekme hatası:", error);
      else setEntries(data);
    };
    fetchEntries();
  }, [selectedRecommendation]);

  const handleRecommendationSubmit = async (e: React.FormEvent) => {
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

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryContent || !entryAuthor || !selectedRecommendation) return;
    const { error } = await supabase.from("entries").insert({
      content: entryContent,
      author: entryAuthor,
      recommendation_id: selectedRecommendation.id,
    });
    if (error) console.error("Entry ekleme hatası:", error);
    else {
      setEntryContent("");
      setEntryAuthor("");
      location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col border border-black">
      {/* Üst Blok */}
      <div className="h-[120px] border border-black flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">Üst Blok</h1>

        {/* Arama ve Form */}
        <div className="flex items-start space-x-4">
          <input
            type="text"
            placeholder="Tavsiye ara..."
            className="border px-2 py-1 rounded w-48"
          />

          <form onSubmit={handleRecommendationSubmit} className="flex space-x-2">
            <input
              type="text"
              placeholder="Başlık"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-2 py-1 rounded w-32"
            />
            <input
              type="text"
              placeholder="Tavsiye"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border px-2 py-1 rounded w-72"
            />
            <input
              type="text"
              placeholder="Yazar"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border px-2 py-1 rounded w-24"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded"
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
          {recommendations.length === 0 ? (
            <p>Veri bulunamadı.</p>
          ) : (
            <ul className="space-y-4">
              {recommendations.map((item) => (
                <li
                  key={item.id}
                  className="border p-2 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedRecommendation(item)}
                >
                  <p className="font-semibold">{item.title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Orta Blok */}
        <div className="w-1/3 border border-black p-4">
          {selectedRecommendation ? (
            <div>
              <h2 className="font-bold text-xl mb-2">{selectedRecommendation.title}</h2>

              <ul className="space-y-2">
                {entries.map((entry, index) => (
                  <li key={index} className="border p-2 rounded">
                    <p>{entry.content}</p>
                    <p className="text-xs text-gray-600">Yazar: {entry.author}</p>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleEntrySubmit} className="mt-4 space-y-2">
                <input
                  type="text"
                  placeholder="Yorum"
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Yazar"
                  value={entryAuthor}
                  onChange={(e) => setEntryAuthor(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Entry Ekle
                </button>
              </form>
            </div>
          ) : (
            <p>Bir başlık seçin.</p>
          )}
        </div>

        {/* Sağ Blok */}
        <div className="w-1/3 border border-black p-4">
          Sağ Blok
        </div>
      </div>
    </div>
  );
}
