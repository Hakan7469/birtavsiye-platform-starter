// pages/index.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Recommendation } from "@/types/supabase";
import { Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Giriş başarısız: " + error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col border border-black">
      {/* Üst Blok */}
      <div className="h-[120px] border border-black flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">Üst Blok</h1>

        {/* Giriş/Kayıt Alanı */}
        <div className="flex items-center space-x-2">
          {session ? (
            <>
              <span className="text-sm">{session.user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Giriş Yap
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alt Blok */}
      <div className="flex flex-grow border-t border-black">
        {/* Sol */}
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

        {/* Orta */}
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

              {session && (
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
              )}
            </div>
          ) : (
            <p>Bir başlık seçin.</p>
          )}
        </div>

        {/* Sağ */}
        <div className="w-1/3 border border-black p-4">
          Sağ Blok
        </div>
      </div>
    </div>
  );
}
