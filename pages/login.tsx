import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Login() {
  const [hata, setHata] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://birtavsiye.vercel.app/profil",
      },
    });

    if (error) {
      setHata("Google ile giriş yapılamadı.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Google ile Giriş Yap
        </button>
        {hata && <p className="text-red-500 mt-2">{hata}</p>}
      </div>
    </div>
  );
}
