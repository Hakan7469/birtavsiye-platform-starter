// pages/kayit.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Kayit() {
  const router = useRouter();
  const [adSoyad, setAdSoyad] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");

  const handleKayit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: sifre,
      options: {
        data: {
          ad_soyad: adSoyad,
          telefon,
        },
      },
    });

    if (error) {
      setHata(error.message);
    } else {
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleKayit} className="bg-white p-8 rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Yazar Kaydı</h2>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={adSoyad}
          onChange={(e) => setAdSoyad(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Telefon"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        {hata && <p className="text-red-500 text-sm">{hata}</p>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}
