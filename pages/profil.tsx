import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Profil() {
  const router = useRouter();

  useEffect(() => {
    router.push("/yazar");
  }, []);

  return null;
}
