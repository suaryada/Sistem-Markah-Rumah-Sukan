
import React, { useState } from 'react';
import { Lock, AlertCircle, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
  role: 'Admin' | 'Guru';
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, role }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Log Masuk {role === 'Admin' ? 'Pentadbir' : 'Guru'}
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Sila masukkan kata laluan untuk mengakses fungsi {role === 'Admin' ? 'admin' : 'guru'}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Kata Laluan</label>
            <div className="relative">
              <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••••••"
                className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold ${
                  error ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-100 text-slate-800 focus:border-indigo-500'
                }`}
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 animate-bounce">
                <AlertCircle size={14} /> Kata laluan tidak sah!
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
          >
            Sahkan Identiti
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
