// pages/index.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Recommendation } from "@/types/supabase";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Home() {
  const [allData, setAllData] = useState<Recommendation[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Recommendation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("recommendations").select("*");
      if (error) console.error("Veri çekme hatası:", error);
      else setAllData(data as Recommendation[]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      const entries = allData.filter((item) => item.title === selectedTopic);
      setFilteredData(entries);
    }
  }, [selectedTopic, allData]);

  const uniqueTitles = Array.from(new Set(allData.map((item) => item.title)));

  return (
    <div className="min-h-screen flex flex-col border border-black">
      {/* Üst Blok */}
      <div className="h-[120px] border border-black flex items-center justify-center text-xl font-bold">
        Üst Blok
      </div>

      {/* Alt Blok: Sol - Orta - Sağ */}
      <div className="flex flex-grow border-t border-black">
        {/* Sol Blok */}
        <div className="w-1/3 border border-black p-4 overflow-auto">
          <h2 className="font-bold text-lg mb-2">Başlıklar</h2>
          <ul className="space-y-2">
            {uniqueTitles.map((title, index) => (
              <li
                key={index}
                className="cursor-pointer hover:underline text-blue-600"
                onClick={() => setSelectedTopic(title || null)}
              >
                {title}
              </li>
            ))}
          </ul>
        </div>

        {/* Orta Blok */}
        <div className="w-1/3 border border-black p-4">
          {selectedTopic ? (
            <>
              <h2 className="text-xl font-bold mb-4">{selectedTopic}</h2>
              {filteredData.length > 0 ? (
                <ul className="space-y-4">
                  {filteredData.map((item) => (
                    <li key={item.id} className="border p-2 rounded">
                      <p className="text-sm">{item.content}</p>
                      <p className="text-xs text-gray-600">Yazar: {item.author}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Bu başlık altında henüz entry yok.</p>
              )}
            </>
          ) : (
            <p>Sol taraftan bir başlık seçin.</p>
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
