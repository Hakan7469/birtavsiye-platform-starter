import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Recommendation, Entry } from "../types/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [newRecommendation, setNewRecommendation] = useState("");
  const session = useSession();
  const router = useRouter();

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
      if (selectedRecommendation) {
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("recommendation_id", selectedRecommendation.id);
        if (error) console.error("Entry çekme hatası:", error);
        else setEntries(data as Entry[]);
      }
    };
    fetchEntries();
  }, [selectedRecommendation]);

  const handleAddEntry = async () => {
    if (!newEntry.trim() || !selectedRecommendation) return;
    const { data, error } = await supabase.from("entries").insert([
      {
        content: newEntry,
        recommendation_id: selectedRecommendation.id,
        author: session?.user?.user_metadata?.nickname || "Anonim",
      },
    ]);
    if (error) {
      console.error("Entry ekleme hatası:", error);
    } else {
      setNewEntry("");
      setEntries((prev) => [...prev, ...(data as Entry[])]);
    }
  };

  const handleAddRecommendation = async () => {
    if (!newRecommendation.trim()) return;
    const { data, error } = await supabase.from("recommendations").insert([
      {
        title: newRecommendation,
        content: "",
        author: session?.user?.user_metadata?.nickname || "Anonim",
      },
    ]);
    if (error) {
      console.error("Başlık ekleme hatası:", error);
    } else {
      setNewRecommendation("");
      setRecommendations((prev) => [...prev, ...(data as Recommendation[])]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.reload();
  };

  const filteredRecommendations = recommendations.filter((rec) => rec.title);

  return (
    <div className="flex flex-col h-screen">
      {/* Üst bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h1 className="text-xl font-bold">Birtavsiye</h1>
        <input
          type="text"
          placeholder="Tavsiye ara..."
          className="border px-2 py-1 rounded w-1/3"
        />
        {session ? (
          <div className="text-sm text-gray-600">
            {session.user.email} —
            <button onClick={handleLogout} className="text-red-500 ml-2">
              Çıkış Yap
            </button>
          </div>
        ) : (
          <a href="/giris" className="text-blue-500 text-sm">
            Oturum Aç
          </a>
        )}
      </div>

      {/* Ana içerik */}
      <div className="flex flex-1">
        {/* Sol blok */}
        <div className="w-1/4 border-r p-2 overflow-y-auto">
          <h2 className="font-bold mb-2">Tavsiyeler</h2>
          {filteredRecommendations.map((rec) => (
            <button
              key={rec.id}
              className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                selectedRecommendation?.id === rec.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedRecommendation(rec)}
            >
              {rec.title}
            </button>
          ))}
        </div>

        {/* Orta blok */}
        <div className="flex-1 p-4 overflow-y-auto border-r">
          {selectedRecommendation ? (
            <>
              <h2 className="text-lg font-semibold mb-2">{selectedRecommendation.title}</h2>
              {selectedRecommendation.content && (
                <p className="mb-4 text-gray-700 text-sm">{selectedRecommendation.content}</p>
              )}
              {entries.map((entry) => (
                <div key={entry.id} className="mb-2 border p-2 rounded">
                  {entry.content} —{" "}
                  <span className="text-sm text-gray-500">{entry.author}</span>
                </div>
              ))}
              {session && (
                <div className="mt-4">
                  <textarea
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Tavsiyeni yaz..."
                  />
                  <button
                    onClick={handleAddEntry}
                    className="bg-green-500 text-white px-4 py-1 rounded mt-2"
                  >
                    Ekle
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">Bir başlık seçin.</p>
          )}
        </div>

        {/* Sağ blok */}
        <div className="w-1/4 p-2">
          <h2 className="text-sm text-gray-600">Yan içerik veya reklam alanı</h2>
        </div>
      </div>

      {/* Tavsiye ekle butonu */}
      {session && (
        <div className="p-2 border-t">
          <input
            value={newRecommendation}
            onChange={(e) => setNewRecommendation(e.target.value)}
            placeholder="Yeni başlık..."
            className="border px-2 py-1 rounded w-2/3"
          />
          <button
            onClick={handleAddRecommendation}
            className="bg-blue-500 text-white px-4 py-1 rounded ml-2"
          >
            Tavsiye Ekle
          </button>
        </div>
      )}
    </div>
  );
}
