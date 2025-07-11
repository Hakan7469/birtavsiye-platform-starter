// pages/profil.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWFkem9qempqbWxkdG9zbmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDEwODUsImV4cCI6MjA2NjQxNzA4NX0.tbEwxQ0Osj6gKwrXASh7AjKw-8silIOZ3z3Feymao1Q"
);

export default function Profil() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Profil Sayfası</h1>
      {user ? (
        <div className="space-y-2">
          <p><strong>Kullanıcı ID:</strong> {user.id}</p>
          <p><strong>E-posta:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
}
