import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Birtavsiye Platformu</title>
      </Head>

      <Navbar />

      <main className="flex flex-col items-center justify-center py-20">
        <h1 className="text-3xl font-bold">Birtavsiye Platformuna Hoş Geldiniz</h1>
        <p className="text-gray-600 mt-2">Tavsiyelere göz atmak için oturum açın.</p>
      </main>
    </div>
  );
}
