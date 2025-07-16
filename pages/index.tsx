import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { Recommendation } from "@/types/supabase";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoieXB5YWR6b2p6amptbGR0b3NuaG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc1MDg0MTA4NSwiZXhwIjoyMDY2NDE3MDg1fQ.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Home() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const fetchRecommendations = async () => {
      const { data, error } = await supabase.from("recommendations").select("*");
      console.log("Gelen başlıklar:", data);
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
    localStorage.removeItem("nickname");
    location.reload();
  };

  const handleRecommendationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nickname = localStorage.getItem("nickname");
    if (!title || !content || !nickname) return;

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
        .insert({ title, content, author: nickname })
        .select();

      if (insertError) {
        console.error("Başlık ekleme hatası:", insertError);
        return;
      }
      recommendationId = inserted[0].id;
    }

    const { error: entryError } = await supabase.from("entries").insert({
      content,
      author: nickname,
      recommendation_id: recommendationId,
    });

    if (entryError) {
      console.error("Entry ekleme hatası:", entryError);
    } else {
      setTitle("");
      setContent("");
      location.reload();
    }
  };

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryContent || !selectedRecommendation) return;

    const nickname = localStorage.getItem("nickname");
    if (!nickname) return;

    const { error } = await supabase.from("entries").insert({
      content: entryContent,
      author: nickname,
      recommendation_id: selectedRecommendation.id,
    });
    if (error) console.error("Entry ekleme hatası:", error);
    else {
      setEntryContent("");
      location.reload();
    }
  };

  const filteredRecommendations = recommendations.filter((rec) =>
    rec.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-softGray text-textDark">
      {/* Üst Blok */}
      <div className="h-[100px] flex items-center justify-between px-6 shadow bg-white">
        <h1 className="text-2xl font-bold">Birtavsiye</h1>

        <input
          type="text"
          placeholder="Tavsiye ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-borderSoft px-4 py-2 rounded-full w-64 text-sm"
        />

        <div className="text-sm">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-textDark">{user.email}</span>
              <button className="text-blue-600 underline" onClick={handleLogout}>
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
      <div className="flex flex-1">
        {/* Sol Blok */}
        <div className="w-1/4 p-4 bg-pastelLilac overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-textDark">Tavsiyeler</h2>
          {filteredRecommendations.map((rec) => (
            <button
              key={rec.id}
              className={`block w-full text-left px-3 py-2 mb-2 rounded-xl transition font-medium shadow ${
                selectedRecommendation?.id === rec.id
                  ? "bg-white text-textDark"
                  : "bg-pastelLilac hover:bg-white"
              }`}
              onClick={() => setSelectedRecommendation(rec)}
            >
              {rec.title}
            </button>
          ))}
        </div>

        {/* Orta Blok */}
        <div className="w-2/4 p-6">
          {selectedRecommendation ? (
            <>
              <h2 className="text-xl font-bold mb-4 text-textDark">
                {selectedRecommendation.title}
              </h2>
              <p className="mb-4 text-sm text-gray-700">
                {selectedRecommendation.content} — <span className="text-xs text-gray-500">{selectedRecommendation.author}</span>
              </p>
              {entries.length === 0 ? (
                <p className="text-gray-500">Bu başlık altında henüz entry yok.</p>
              ) : (
                <ul className="mb-4 space-y-2">
                  {entries.map((entry, index) => (
                    <li key={index} className="border border-borderSoft bg-white p-3 rounded-xl shadow-sm">
                      {entry.content} — <span className="text-sm text-gray-500">{entry.author}</span>
                    </li>
                  ))}
                </ul>
              )}
              {user && (
                <form onSubmit={handleEntrySubmit} className="space-y-2">
                  <textarea
                    value={entryContent}
                    onChange={(e) => setEntryContent(e.target.value)}
                    className="w-full border border-borderSoft p-3 rounded-xl"
                    placeholder="Tavsiyeni yaz..."
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-xl w-full hover:bg-green-600"
                  >
                    Entry Ekle
                  </button>
                </form>
              )}
            </>
          ) : (
            <p className="text-gray-500">Bir başlık seçin.</p>
          )}
        </div>

        {/* Sağ Blok */}
        <div className="w-1/4 p-6 bg-pastelBlue">
          <p className="text-textDark">Yan içerik veya reklam alanı</p>
        </div>
      </div>

      {/* Tavsiye Oluşturma Formu (sadece yazarlar için) */}
      {user && (
        <div className="border-t border-borderSoft p-6 bg-white">
          <form onSubmit={handleRecommendationSubmit} className="space-y-2 max-w-3xl mx-auto">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-borderSoft p-3 rounded-xl"
              placeholder="Yeni başlık"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-borderSoft p-3 rounded-xl"
              placeholder="İlk tavsiyeni yaz..."
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl w-full hover:bg-blue-700"
            >
              Tavsiye Ekle
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
