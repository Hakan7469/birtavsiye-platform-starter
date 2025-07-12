import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RegisterModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          nickname,
          birthdate
        },
        emailRedirectTo: 'https://birtavsiye-platform-starter.vercel.app/auth/callback' // 🔁 Doğrulama sonrası yönlendirme
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);

      // ✅ 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        onClose(); // modal kapansın
        router.push('/login'); // login sayfasına yönlendir
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Kayıt Ol</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {success ? (
          <p className="text-green-600 font-semibold">
            Kayıt başarılı! Lütfen e-posta adresinizi kontrol edin.
          </p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Nick"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              type="date"
              placeholder="Doğum Tarihi"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Şifre Tekrarı"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              required
            />

            <div className="flex justify-between">
              <button
                onClick={handleRegister}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Kayıt Ol
              </button>
              <button
                onClick={onClose}
                className="text-gray-600 underline"
              >
                İptal
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
