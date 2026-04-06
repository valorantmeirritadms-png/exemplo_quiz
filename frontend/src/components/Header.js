import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, LogOut, User, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header-brutalist" data-testid="header">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-[#FFD100] border-2 border-[#0F172A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0F172A]">
              <Trophy className="w-5 h-5 text-[#0F172A]" />
            </div>
            <span className="font-black text-xl text-[#0F172A] hidden sm:block">{t('appTitle')}</span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-[#0F172A] rounded-lg font-bold text-sm shadow-[2px_2px_0px_#0F172A] hover:shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
            whileTap={{ scale: 0.95 }}
            data-testid="language-toggle"
          >
            <Globe className="w-4 h-4" />
            <span>{lang.toUpperCase()}</span>
          </motion.button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#003893] text-white border-2 border-[#0F172A] rounded-lg font-semibold text-sm shadow-[2px_2px_0px_#0F172A]">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </div>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-[#CE1126] text-white border-2 border-[#0F172A] rounded-lg font-bold text-sm shadow-[2px_2px_0px_#0F172A] hover:shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
                whileTap={{ scale: 0.95 }}
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" data-testid="login-link">
                <motion.button
                  className="px-4 py-2 bg-white border-2 border-[#0F172A] rounded-lg font-bold text-sm shadow-[2px_2px_0px_#0F172A] hover:shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
                  whileTap={{ scale: 0.95 }}
                >
                  {t('login')}
                </motion.button>
              </Link>
              <Link to="/register" data-testid="register-link">
                <motion.button
                  className="px-4 py-2 bg-[#FFD100] border-2 border-[#0F172A] rounded-lg font-bold text-sm shadow-[2px_2px_0px_#0F172A] hover:shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
                  whileTap={{ scale: 0.95 }}
                >
                  {t('register')}
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
