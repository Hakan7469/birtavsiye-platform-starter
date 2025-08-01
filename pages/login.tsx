import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient"; // ✅ BURASI

import RegisterModal from "../components/RegisterModal";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: sifre,
    });

    if (error) {
      setHata("Giriş başarısız: " + error.message);
    } else {
      router.push("/yazar");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://birtavsiye-platform-starter.vercel.app/yazar",
      },
    });

    if (error) {
      setHata("Google ile giriş yapılamadı.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Oturum Aç</h2>

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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Giriş Yap
        </button>

        <div className="text-center text-sm text-gray-600">veya</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Google ile Giriş Yap
        </button>

        <button
          type="button"
          onClick={() => setShowRegister(true)}
          className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 mt-2"
        >
          Kayıt Ol
        </button>
      </form>

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </div>
  );
}
