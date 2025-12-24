
import React, { useState } from 'react';
import { TRANSLATIONS, Language, ICONS } from '../constants';
import { login as apiLogin } from '../services/api';

interface LoginPageProps {
  onLogin: (token: string) => void;
  currentLang: Language;
  onLangToggle: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, currentLang, onLangToggle }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = TRANSLATIONS[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiLogin(phone, password);
      // Based on the provided response structure: response.data.token
      const token = response?.data?.token;
      
      if (token) {
        onLogin(token);
      } else {
        throw new Error('Token not found in response');
      }
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Language Switcher */}
        <div className="absolute top-6 right-8">
          <button 
            onClick={onLangToggle}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-100 transition-all text-slate-600"
          >
            <ICONS.Globe className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase">{currentLang === 'en' ? 'AM' : 'EN'}</span>
          </button>
        </div>

        <div className="text-center mb-10">
          <div className="bg-emerald-500 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 rotate-[-3deg]">
             <ICONS.Cart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{t.brand}</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">{t.marketplace}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{t.phone}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:border-emerald-500 focus:bg-white transition-all outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:border-emerald-500 focus:bg-white transition-all outline-none"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <p className="text-rose-500 text-xs font-bold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-[24px] py-5 font-black text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? t.loading : t.login}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
