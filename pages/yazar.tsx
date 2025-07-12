import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Yazar() {
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        const meta = data.user.user_metadata;
        setNickname(meta?.nickname || "");
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Yazar Sayfası</h1>

      {user ? (
        <div className="space-y-3 text-center">
          <p className="text-gray-700">Hoş geldin, <strong>{nickname || user.email}</strong></p>
          <p className="text-gray-600">Buradan yeni tavsiye yazabilir ya da mevcut başlıklara ekleme yapabilirsin.</p>

          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow"
          >
            Ana Sayfaya Git
          </button>
          <button
            onClick={handleLogout}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded shadow"
          >
            Çıkış Yap
          </button>
        </div>
      ) : (
        <p className="text-red-500">Kullanıcı bilgisi alınamadı.</p>
      )}
    </div>
  );
}
