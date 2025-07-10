// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-100 p-4 flex justify-end gap-4 text-sm border-b">
      <Link href="/login" className="text-blue-600 hover:underline font-semibold">
        oturum aç
      </Link>
      <Link href="/kayit" className="text-blue-600 hover:underline">
        kayıt ol
      </Link>
    </nav>
  );
}
