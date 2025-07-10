// pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { Recommendation } from "@/types/supabase";
import Navbar from "@/components/Navbar"; // yol bileşen konumunuza göre değişebilir

export default function HomePage() {
  return (
    <>
      <Navbar />
      {/* diğer içerikler */}
    </>
  );
}

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Home() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [entryAuthor, setEntryAuthor] = useState("");
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  const handleRecommendationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author) return;

    const { data: existing, error: findError } = await supabase
      .from("recommendations")
      .select("*")
      .ilike("title", title);

    if (findError) {
      console.error("Arama hatası:", findError);
      return;
    }

    let recommendationId: string | null = null;

    if (existing && existing.length > 0) {
      recommendationId = existing[0].id;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("recommendations")
        .insert({ title, content, author })
        .select();

      if (insertError) {
        console.error("Başlık ekleme hatası:", insertError);
        return;
      }
      recommendationId = inserted[0].id;
    }

    const { error: entryError } = await supabase.from("entries").insert({
      content,
      author,
      recommendation_id: recommendationId,
    });

    if (entryError) {
      console.error("Entry ekleme hatası:", entryError);
    } else {
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

  const filteredRecommendations = recommendations.filter((rec) =>
    rec.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col border border-black">
      {/* Üst Blok */}
      <div className="h-[120px] border border-black flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">Birtavsiye</h1>

        <input
          type="text"
          placeholder="Tavsiye ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-48"
        />

        <div className="text-sm">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">{user.email}</span>
              <button className="text-red-500 underline" onClick={handleLogout}>
                Çıkış Yap
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-blue-600 underline"
            >
              Oturum Aç
            </button>
          )}
        </div>
      </div>

      {/* Alt Bloklar: Sol - Orta - Sağ */}
      <div className="flex flex-1 border border-black">
        {/* Sol Blok */}
        <div className="w-1/4 border border-black p-2 overflow-y-auto">
          <h2 className="font-bold mb-2">Tavsiyeler</h2>
          {filteredRecommendations.map((rec) => (
            <button
              key={rec.id}
              className={`block w-full text-left px-2 py-1 mb-1 rounded ${
                selectedRecommendation?.id === rec.id
                  ? "bg-gray-300 font-bold"
                  : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setSelectedRecommendation(rec)}
            >
              {rec.title}
            </button>
          ))}
        </div>

        {/* Orta Blok */}
        <div className="w-2/4 border border-black p-4">
          {selectedRecommendation ? (
            <>
              <h2 className="text-lg font-bold mb-2">{selectedRecommendation.title}</h2>
              {entries.length === 0 ? (
                <p className="text-gray-600">Bu başlık altında henüz entry yok.</p>
              ) : (
                <ul className="mb-4">
                  {entries.map((entry, index) => (
                    <li key={index} className="border p-2 mb-2 rounded">
                      {entry.content} — <span className="text-sm text-gray-600">{entry.author}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Entry Ekleme Formu */}
              <form onSubmit={handleEntrySubmit} className="space-y-2">
                <textarea
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Tavsiyeni yaz..."
                />
                <input
                  value={entryAuthor}
                  onChange={(e) => setEntryAuthor(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Yazar adı"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded w-full"
                >
                  Entry Ekle
                </button>
              </form>
            </>
          ) : (
            <p className="text-gray-600">Bir başlık seçin.</p>
          )}
        </div>

        {/* Sağ Blok */}
        <div className="w-1/4 border border-black p-4">
          <p>Sağ Blok</p>
        </div>
      </div>
    </div>
  );
}
