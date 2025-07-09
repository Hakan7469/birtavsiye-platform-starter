// pages/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Kayıt başarılı. Giriş yapabilirsiniz.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4">Yazar Girişi</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form className="space-y-4 w-full max-w-sm">
        <input
          className="w-full border p-2 rounded"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="E-posta"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Şifre"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleLogin}
          >
            Giriş Yap
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleSignup}
          >
            Kayıt Ol
          </button>
        </div>
      </form>
    </div>
  );
}
