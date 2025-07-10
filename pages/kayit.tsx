import { useState } from "react";

export default function Kayit() {
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [dogumGun, setDogumGun] = useState("");
  const [dogumAy, setDogumAy] = useState("");
  const [dogumYil, setDogumYil] = useState("");
  const [cinsiyet, setCinsiyet] = useState("");
  const [sifre, setSifre] = useState("");
  const [sifreTekrar, setSifreTekrar] = useState("");
  const [sozlesme, setSozlesme] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada form doğrulama ve kayıt işlemleri yapılabilir
    console.log({ nick, email, dogumGun, dogumAy, dogumYil, cinsiyet, sifre, sifreTekrar, sozlesme });
  };

  return (
    <div className="flex justify-center py-12 bg-white min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 border rounded-lg p-6 shadow"
      >
        <h2 className="text-xl font-bold text-gray-700">yeni kullanıcı kaydı</h2>

        <input
          type="text"
          placeholder="nick"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          placeholder="e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-2">
          <select
            value={dogumGun}
            onChange={(e) => setDogumGun(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">gün</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <select
            value={dogumAy}
            onChange={(e) => setDogumAy(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">ay</option>
            {["ocak","şubat","mart","nisan","mayıs","haziran","temmuz","ağustos","eylül","ekim","kasım","aralık"].map((ay, i) => (
              <option key={i + 1} value={i + 1}>{ay}</option>
            ))}
          </select>

          <select
            value={dogumYil}
            onChange={(e) => setDogumYil(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">yıl</option>
            {[...Array(70)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <div className="flex gap-2">
          {['kadın', 'erkek', 'başka', 'boşver'].map((secenek) => (
            <button
              type="button"
              key={secenek}
              onClick={() => setCinsiyet(secenek)}
              className={`flex-1 py-2 rounded border ${cinsiyet === secenek ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
            >
              {secenek}
            </button>
          ))}
        </div>

        <input
          type="password"
          placeholder="şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-gray-500">
          şifre en az 8 karakter <br />
          en az bir büyük harf <br />
          bir küçük harf <br />
          rakam içermelidir.
        </p>

        <input
          type="password"
          placeholder="şifre (tekrar)"
          value={sifreTekrar}
          onChange={(e) => setSifreTekrar(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-gray-500">
          en az 1 küçük harf <br />
          en az 1 büyük harf <br />
          en az 1 rakam <br />
          en az 8 karakter
        </p>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sozlesme}
            onChange={(e) => setSozlesme(e.target.checked)}
          />
          <span className="text-sm">
            kullanıcı sözleşmesini okudum ve kabul ediyorum
          </span>
        </label>

        <button
          type="submit"
          className="w-full bg-green-500 text-white font-semibold py-2 rounded"
        >
          kayıt ol işte böyle
        </button>
      </form>
    </div>
  );
}
