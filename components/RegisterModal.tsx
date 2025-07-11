import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RegisterModal({ isOpen, onClose }: Props) {
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
      setError('Şifreler uyuşmuyor');
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          birthdate,
        },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Kayıt Ol</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success ? (
          <p className="text-green-500">Kayıt başarılı! Lütfen e-postanızı kontrol edin.</p>
        ) : (
          <>
            <input type="text" placeholder="Nick" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input type="date" placeholder="Doğum Tarihi" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input type="password" placeholder="Şifre Tekrarı" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <div className="flex justify-between mt-4">
              <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Kayıt Ol</button>
              <button onClick={onClose} className="text-gray-600 underline">İptal</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
