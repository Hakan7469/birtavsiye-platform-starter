// pages/index.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Recommendation } from "@/types/supabase";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

interface Entry {
  id: string;
  content: string;
  author: string;
  recommendation_id: string;
}

export default function Home() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

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

  const handleSelect = async (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    const { data: entriesData, error } = await supabase
      .from("entries")
      .select("*")
      .eq("recommendation_id", recommendation.id);
    if (error) console.error("Entry çekilemedi:", error);
    else setEntries(entriesData as Entry[]);
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

          <form onSubmit={handleSubmit} className="flex space-x-2">
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
          {data.length === 0 ? (
            <p>Veri bulunamadı.</p>
          ) : (
            <ul className="space-y-4">
              {data.map((item) => (
                <li
                  key={item.id}
                  className={`border p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedRecommendation?.id === item.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <p className="font-semibold">{item.title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Orta Blok */}
        <div className="w-1/3 border border-black p-4 overflow-auto">
          {selectedRecommendation ? (
            <>
              <h2 className="font-bold text-xl mb-4">{selectedRecommendation.title}</h2>

              {entries.length === 0 ? (
                <p>Bu başlık altında henüz entry yok.</p>
              ) : (
                <ul className="space-y-4 mb-4">
                  {entries.map((entry) => (
                    <li key={entry.id} className="border p-2 rounded">
                      <p className="text-sm">{entry.content}</p>
                      <p className="text-xs text-gray-600">Yazar: {entry.author}</p>
                    </li>
                  ))}
                </ul>
              )}

              {/* Entry ekleme formu */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newEntry || !newAuthor) return;

                  const { error } = await supabase.from("entries").insert({
                    recommendation_id: selectedRecommendation.id,
                    content: newEntry,
                    author: newAuthor,
                  });

                  if (error) {
                    console.error("Entry eklenemedi:", error);
                  } else {
                    setNewEntry("");
                    setNewAuthor("");
                    const { data: updatedEntries } = await supabase
                      .from("entries")
                      .select("*")
                      .eq("recommendation_id", selectedRecommendation.id);
                    setEntries(updatedEntries as Entry[]);
                  }
                }}
                className="space-y-2 mt-4"
              >
                <textarea
                  placeholder="Tavsiyeni yaz..."
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  className="w-full border px-2 py-1 rounded h-24"
                />
                <input
                  type="text"
                  placeholder="Yazar adı"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-1 rounded w-full"
                >
                  Entry Ekle
                </button>
              </form>
            </>
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
