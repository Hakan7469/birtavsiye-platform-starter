// pages/index.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Recommendation, Entry } from "@/types/supabase";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  // Tüm başlıkları çek
  useEffect(() => {
    const fetchRecommendations = async () => {
      const { data, error } = await supabase.from("recommendations").select("*");
      if (error) console.error("Başlık çekme hatası:", error);
      else setRecommendations(data as Recommendation[]);
    };

    fetchRecommendations();
  }, []);

  // Seçilen başlığa ait entry'leri çek
  useEffect(() => {
    if (!selectedRecommendation) return;

    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("recommendation_id", selectedRecommendation.id);

      if (error) console.error("Entry çekme hatası:", error);
      else setEntries(data as Entry[]);
    };

    fetchEntries();
  }, [selectedRecommendation]);

  return (
    <div className="min-h-screen flex flex-col border border-black">
      {/* Üst Blok */}
      <div className="h-[120px] border border-black flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">Tavsiye Platformu</h1>
      </div>

      {/* Alt Blok */}
      <div className="flex flex-grow border-t border-black">
        {/* Sol Blok: Başlıklar */}
        <div className="w-1/3 border border-black p-4 overflow-auto">
          <h2 className="font-bold text-lg mb-2">Başlıklar</h2>
          <ul className="space-y-2">
            {recommendations.map((rec) => (
              <li
                key={rec.id}
                onClick={() => setSelectedRecommendation(rec)}
                className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${
                  selectedRecommendation?.id === rec.id ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                {rec.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Orta Blok: Seçilen başlık ve entry'ler */}
        <div className="w-1/3 border border-black p-4 overflow-auto">
          {selectedRecommendation ? (
            <>
              <h2 className="font-bold text-xl mb-4">{selectedRecommendation.title}</h2>
              {entries.length === 0 ? (
                <p>Bu başlık altında henüz entry yok.</p>
              ) : (
                <ul className="space-y-4">
                  {entries.map((entry) => (
                    <li key={entry.id} className="border p-2 rounded">
                      <p className="text-sm">{entry.content}</p>
                      <p className="text-xs text-gray-600">Yazar: {entry.author}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p>Bir başlık seçin.</p>
          )}
        </div>

        {/* Sağ Blok (şimdilik boş) */}
        <div className="w-1/3 border border-black p-4">
          Sağ Blok
        </div>
      </div>
    </div>
  );
}
