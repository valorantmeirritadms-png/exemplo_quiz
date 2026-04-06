import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import Header from '../components/Header';
import LevelCard from '../components/LevelCard';
import { ArrowRight, Trophy, Star, Heart } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Home() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { isLevelUnlocked, isLevelCompleted, getBestScore } = useProgress();
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await axios.get(`${API}/quiz/levels`);
      setLevels(response.data);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const handleLevelClick = (level) => {
    if (user) {
      navigate(`/quiz/${level.level}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7]" data-testid="home-page">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1656130727374-e99edc2b8ba4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwyfHxjb2xvbWJpYSUyMGNhcnRhZ2VuYXxlbnwwfHx8fDE3NzQ2MTQxMzV8MA&ixlib=rb-4.1.0&q=85')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#FFFDF7]" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-[#FFD100] border-2 border-[#0F172A] rounded-full px-4 py-2 mb-6 shadow-[3px_3px_0px_#0F172A]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Trophy className="w-5 h-5 text-[#0F172A]" />
              <span className="font-bold text-[#0F172A]">Quiz Colômbia 🇨🇴</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              {t('heroTitle')}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 font-medium">
              {t('heroSubtitle')}
            </p>

            {!user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/login">
                  <motion.button
                    className="btn-primary text-lg flex items-center gap-3 mx-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="start-playing-button"
                  >
                    {t('startPlaying')}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16" data-testid="levels-section">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-3">
            {t('selectLevel')}
          </h2>
          <div className="flex items-center justify-center gap-2 text-[#475569]">
            <Star className="w-5 h-5 text-[#FFD100]" />
            <span className="font-medium">5 {t('levels')} • 50 {t('questions')}</span>
            <Star className="w-5 h-5 text-[#FFD100]" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <LevelCard
              key={level.level}
              level={level}
              tema={level.tema}
              isUnlocked={isLevelUnlocked(level.level)}
              isCompleted={isLevelCompleted(level.level)}
              bestScore={getBestScore(level.level)}
              onClick={() => handleLevelClick(level)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#0F172A] bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#475569] font-medium flex items-center justify-center gap-2">
            {t('madeWith')} <Heart className="w-4 h-4 text-[#CE1126] fill-[#CE1126]" /> {t('forColombia')} 🇨🇴
          </p>
        </div>
      </footer>
    </div>
  );
}
