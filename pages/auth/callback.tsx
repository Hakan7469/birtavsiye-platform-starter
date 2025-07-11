// pages/auth/callback.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        // Oturum varsa yazar sayfasına yönlendir
        router.push("/yazar");
      } else {
        // Oturum yoksa login sayfasına yönlendir
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  return <p className="text-center mt-10">Giriş yapılıyor...</p>;
}
