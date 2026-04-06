import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import { Input } from '../components/ui/input';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7]" data-testid="login-page">
      <Header />
      
      <div className="flex items-center justify-center px-4 py-12 md:py-20">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FFD100] border-2 border-[#0F172A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#0F172A]">
              <span className="text-3xl">🇨🇴</span>
            </div>
            <h1 className="text-2xl font-black text-[#0F172A]">{t('welcomeBack')}</h1>
          </div>

          {error && (
            <motion.div
              className="bg-[#CE1126]/10 border-2 border-[#CE1126] rounded-xl p-4 mb-6 flex items-start gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 text-[#CE1126] flex-shrink-0 mt-0.5" />
              <p className="text-[#CE1126] font-medium text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#0F172A] mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enterEmail')}
                  className="input-brutalist pl-12"
                  required
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0F172A] mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('enterPassword')}
                  className="input-brutalist pl-12"
                  required
                  data-testid="password-input"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              data-testid="login-submit-button"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t('login')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-[#475569]">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-[#003893] font-bold hover:underline" data-testid="register-link">
              {t('register')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
