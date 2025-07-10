import Link from "next/link";

type NavbarProps = {
  user?: any;
};

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="bg-gray-100 p-4 flex justify-end gap-4 text-sm">
      {!user ? (
        <>
          <Link href="/login" className="text-blue-600 hover:underline">giriş</Link>
          <Link href="/kayit" className="text-blue-600 hover:underline font-semibold">kayıt ol</Link>
        </>
      ) : (
        <Link href="/profil" className="text-blue-600 hover:underline">
          profilim
        </Link>
      )}
    </nav>
  );
}
