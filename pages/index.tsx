import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { Recommendation } from "@/types/supabase";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbGR0b3NuaG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc1MDg0MTA4NSwiZXhwIjoyMDY2NDE3MDg1fQ.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
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
    <div className="min-h-screen flex flex-col bg-pastelPurple text-textDark font-sans">
      {/* Üst Blok */}
      <div className="h-[100px] flex items-center justify-between px-6 border-b border-borderSoft bg-white shadow">
        <h1 className="text-2xl font-bold text-textDark">Birtavsiye</h1>

        <input
          type="text"
          placeholder="Tavsiye ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-borderSoft px-3 py-1 rounded-xl focus:outline-none w-64"
        />

        <div className="text-sm">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-gray-700">{user.email}</span>
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
      <div className="flex flex-1">
        {/* Sol Blok */}
        <div className="w-1/4 bg-pastelLilac p-4 overflow-y-auto border-r border-borderSoft">
          <h2 className="font-bold text-lg mb-3">Tavsiyeler</h2>
          {filteredRecommendations.map((rec) => (
            <button
              key={rec.id}
              className={`block w-full text-left px-3 py-2 mb-2 rounded-xl transition ${
                selectedRecommendation?.id === rec.id
                  ? "bg-white font-semibold shadow"
                  : "bg-pastelPurple hover:bg-white"
              }`}
              onClick={() => setSelectedRecommendation(rec)}
            >
              {rec.title}
            </button>
          ))}
        </div>

        {/* Orta Blok */}
        <div className="w-2/4 bg-white p-6 border-r border-borderSoft overflow-y-auto">
          {selectedRecommendation ? (
            <>
              <h2 className="text-xl font-bold mb-4">{selectedRecommendation.title}</h2>
              {entries.length === 0 ? (
                <p className="text-gray-500">Bu başlık altında henüz entry yok.</p>
              ) : (
                <ul className="mb-6 space-y-3">
                  {entries.map((entry, index) => (
                    <li key={index} className="bg-softGray p-3 rounded-xl shadow-sm">
                      <p>{entry.content}</p>
                      <span className="text-sm text-gray-600 block mt-1">{entry.author}</span>
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
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl w-full"
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
        <div className="w-1/4 bg-pastelBlue p-6">
          <p className="text-gray-700">Yan içerik veya reklam alanı</p>
        </div>
      </div>

      {/* Alt Tavsiye Formu */}
      {user && (
        <div className="border-t border-borderSoft bg-white p-6">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl w-full"
            >
              Tavsiye Ekle
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
