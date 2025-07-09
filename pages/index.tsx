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
            <span>Giriş yapılmamış</span>
          )}
        </div>
      </div>
    </div>
  );
}
