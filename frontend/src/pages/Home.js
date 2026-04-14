/**
 * Página Home - Página inicial da aplicação
 * 
 * ALTERAÇÕES:
 * - Adicionado botão para acessar página de Ranking
 * - Mais cores azuis no design
 * - Todos os elementos comentados
 */

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
  // Hooks de contexto e navegação
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { isLevelUnlocked, isLevelCompleted, getBestScore } = useProgress();
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  // Carregar níveis ao montar
  useEffect(() => {
    fetchLevels();
  }, []);

  /**
   * Busca os níveis disponíveis do backend
   */
  const fetchLevels = async () => {
    try {
      const response = await axios.get(`${API}/quiz/levels`, { withCredentials: true });
      setLevels(response.data);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  /**
   * Handler para clique em um nível
   * Redireciona para quiz se logado, senão para login
   */
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
      
      {/* ============================================
          SEÇÃO HERO
          Banner principal com imagem de fundo
          ============================================ */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        {/* Imagem de fundo - Cartagena */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1656130727374-e99edc2b8ba4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwyfHxjb2xvbWJpYSUyMGNhcnRhZ2VuYXxlbnwwfHx8fDE3NzQ2MTQxMzV8MA&ixlib=rb-4.1.0&q=85')`
          }}
        />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#003893]/70 via-[#003893]/50 to-[#FFFDF7]" />
        
        {/* Conteúdo do hero */}
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge do título */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-[#FFD100] border-2 border-[#0F172A] rounded-full px-4 py-2 mb-6 shadow-[3px_3px_0px_#0F172A]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Trophy className="w-5 h-5 text-[#0F172A]" />
              <span className="font-bold text-[#0F172A]">Quiz Colômbia 🇨🇴</span>
            </motion.div>

            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              {t('heroTitle')}
            </h1>
            
            {/* Subtítulo */}
            <p className="text-lg md:text-xl text-white/90 mb-8 font-medium">
              {t('heroSubtitle')}
            </p>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                /* Botão para começar (usuário não logado) */
                <Link to="/login">
                  <motion.button
                    className="btn-primary text-lg flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="start-playing-button"
                  >
                    {t('startPlaying')}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              ) : (
                /* Mensagem de boas-vindas (usuário logado) */
                <motion.div
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl px-6 py-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-white font-bold">
                    {lang === 'es' ? '¡Bienvenido de nuevo' : 'Bem-vindo de volta'}, {user.name}! 🎉
                  </p>
                </motion.div>
              )}

              {/* ALTERAÇÃO: Botão para ver ranking */}
              <Link to="/ranking">
                <motion.button
                  className="btn-secondary text-lg flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="view-ranking-button"
                >
                  <Trophy className="w-5 h-5" />
                  {lang === 'es' ? 'Ver Ranking' : 'Ver Ranking'}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SEÇÃO DE NÍVEIS
          Grid com os cards de cada nível
          ============================================ */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16" data-testid="levels-section">
        {/* Título da seção */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-3">
            {t('selectLevel')}
          </h2>
          {/* Subtítulo com informações */}
          <div className="flex items-center justify-center gap-2 text-[#003893]">
            <Star className="w-5 h-5 text-[#FFD100]" />
            <span className="font-medium">5 {t('levels')} • 50 {t('questions')}</span>
            <Star className="w-5 h-5 text-[#FFD100]" />
          </div>
        </motion.div>

        {/* Grid de cards de níveis */}
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

      {/* ============================================
          FOOTER
          Rodapé com créditos
          ============================================ */}
      <footer className="border-t-2 border-[#0F172A] bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* ALTERAÇÃO: Decoração com cores da bandeira */}
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-12 h-2 bg-[#FFD100] rounded-full"></div>
            <div className="w-12 h-2 bg-[#003893] rounded-full"></div>
            <div className="w-12 h-2 bg-[#CE1126] rounded-full"></div>
          </div>
          <p className="text-[#475569] font-medium flex items-center justify-center gap-2">
            {t('madeWith')} <Heart className="w-4 h-4 text-[#CE1126] fill-[#CE1126]" /> {t('forColombia')} 🇨🇴
          </p>
        </div>
      </footer>
    </div>
  );
}
