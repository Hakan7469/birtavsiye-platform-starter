// pages/yazar.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ypyadzojzjjmldtosnhm.supabase.co",
  "public-api-key" // bu key gizli olmayan, supabase'ın client tarafında kullanılması gereken key'dir
);

export default function Yazar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login"); // giriş yapılmamışsa login'e at
      }
    });
  }, []);

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Yazar Sayfası</h1>
      <p>Kullanıcı ID: {user.id}</p>
      <p>E-posta: {user.email}</p>
    </div>
  );
}
