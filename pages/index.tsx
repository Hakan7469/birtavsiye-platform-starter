import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Recommendation } from "@/types/supabase";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Home() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("recommendations").select("*");
      if (error) console.error("Veri çekme hatası:", error);
      else setData(data as Recommendation[]);
    };

    fetchData();
  }, []);

  const filteredTitles = Array.from(
    new Set(
      data
        .map((item) => item.title)
        .filter((title) =>
          title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
  );

  const selectedEntries = data.filter((item) => item.title === selectedTitle);

  return (
    <div className="min-h-screen flex flex-col border border-black">
      {/* Üst Blok */}
      <div className="h-[120px] border border-black flex items-center justify-center gap-4 px-4">
        <input
          type="text"
          placeholder="Tavsiye ara..."
          className="border px-4 py-2 rounded w-[300px] text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="text-xl font-bold">Bir Tavsiye Platformu</span>
      </div>

      {/* Alt Blok: Sol - Orta - Sağ */}
      <div className="flex flex-grow border-t border-black">
        {/* Sol Blok */}
        <div className="w-1/3 border border-black p-4 overflow-auto">
          <h2 className="font-bold text-lg mb-2">Tavsiyeler</h2>
          {filteredTitles.length === 0 ? (
            <p>Başlık bulunamadı.</p>
          ) : (
            <ul className="space-y-4">
              {filteredTitles.map((title, index) => (
                <li
                  key={index}
                  className="border p-2 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedTitle(title || "")}
                >
                  <p className="font-semibold">{title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Orta Blok */}
        <div className="w-1/3 border border-black p-4">
          {selectedTitle ? (
            <>
              <h2 className="text-xl font-bold mb-2">{selectedTitle}</h2>
              <ul className="space-y-2">
                {selectedEntries.map((entry) => (
                  <li key={entry.id} className="border p-2 rounded">
                    <p className="text-sm">{entry.content}</p>
                    <p className="text-xs text-gray-600">Yazar: {entry.author}</p>
                  </li>
                ))}
              </ul>
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
