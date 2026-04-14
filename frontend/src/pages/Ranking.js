/**
 * Página de Ranking Global
 * 
 * ALTERAÇÃO: Nova página para exibir ranking de utilizadores
 * - Mostra top jogadores por pontuação total
 * - Ranking por nível
 * - Estatísticas pessoais do utilizador
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Trophy, Medal, Star, ArrowLeft, Crown, Target, Gamepad2, TrendingUp } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * Componente principal da página de Ranking
 */
export default function Ranking() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  
  // Estados
  const [globalRanking, setGlobalRanking] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [levelRanking, setLevelRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  // Traduções específicas do ranking
  const translations = {
    pt: {
      globalRanking: "Ranking Global",
      yourStats: "Suas Estatísticas",
      totalScore: "Pontuação Total",
      gamesPlayed: "Jogos Jogados",
      bestScores: "Melhores Pontuações",
      position: "Posição",
      player: "Jogador",
      points: "Pontos",
      noRankingYet: "Ainda não há dados no ranking",
      playToRank: "Jogue para aparecer no ranking!",
      levelRanking: "Ranking por Nível",
      selectLevel: "Selecione um nível",
      backToHome: "Voltar",
      level: "Nível"
    },
    es: {
      globalRanking: "Ranking Global",
      yourStats: "Tus Estadísticas",
      totalScore: "Puntuación Total",
      gamesPlayed: "Juegos Jugados",
      bestScores: "Mejores Puntuaciones",
      position: "Posición",
      player: "Jugador",
      points: "Puntos",
      noRankingYet: "Aún no hay datos en el ranking",
      playToRank: "¡Juega para aparecer en el ranking!",
      levelRanking: "Ranking por Nivel",
      selectLevel: "Selecciona un nivel",
      backToHome: "Volver",
      level: "Nivel"
    }
  };
  
  const tr = (key) => translations[lang][key] || key;

  // Carregar dados ao montar
  useEffect(() => {
    fetchRankingData();
  }, [user]);

  /**
   * Busca dados do ranking global e estatísticas do utilizador
   */
  const fetchRankingData = async () => {
    try {
      setLoading(true);
      
      // Buscar ranking global
      const globalRes = await axios.get(`${API}/ranking/global`, { withCredentials: true });
      setGlobalRanking(globalRes.data);
      
      // Se utilizador logado, buscar suas stats
      if (user && user._id) {
        try {
          const userRes = await axios.get(`${API}/ranking/user/${user._id}`, { withCredentials: true });
          setUserStats(userRes.data);
        } catch (e) {
          console.log('Could not fetch user stats');
        }
      }
    } catch (error) {
      console.error('Error fetching ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca ranking de um nível específico
   */
  const fetchLevelRanking = async (level) => {
    try {
      const res = await axios.get(`${API}/ranking/level/${level}`, { withCredentials: true });
      setLevelRanking(res.data);
      setSelectedLevel(level);
    } catch (error) {
      console.error('Error fetching level ranking:', error);
    }
  };

  /**
   * Retorna a classe CSS para medalha baseado na posição
   */
  const getMedalClass = (position) => {
    switch (position) {
      case 1: return 'medal-gold';
      case 2: return 'medal-silver';
      case 3: return 'medal-bronze';
      default: return 'bg-[#E8F4FD] text-[#003893]';
    }
  };

  /**
   * Retorna o ícone para medalha baseado na posição
   */
  const getMedalIcon = (position) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5" />;
      case 2: return <Medal className="w-5 h-5" />;
      case 3: return <Medal className="w-5 h-5" />;
      default: return <span className="font-black">{position}</span>;
    }
  };

  // Nomes dos níveis
  const levelNames = {
    1: lang === 'es' ? 'Cantantes' : 'Cantores',
    2: 'Cultura',
    3: lang === 'es' ? 'Gastronomía' : 'Gastronomia',
    4: lang === 'es' ? 'Historia' : 'História',
    5: lang === 'es' ? 'Narcotráfico' : 'Narcotráfico'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#003893] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7]" data-testid="ranking-page">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Botão voltar e título */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-white border-2 border-[#0F172A] rounded-lg hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_#0F172A]"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#FFD100]" />
              {tr('globalRanking')}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal - Ranking Global */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white border-2 border-[#0F172A] rounded-2xl overflow-hidden shadow-[6px_6px_0px_#0F172A]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header do card */}
              <div className="bg-[#003893] p-4 border-b-2 border-[#0F172A]">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FFD100]" />
                  Top 50 {tr('player')}s
                </h2>
              </div>

              {/* Lista de ranking */}
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {globalRanking.length === 0 ? (
                  <div className="text-center py-12">
                    <Gamepad2 className="w-16 h-16 text-[#475569] mx-auto mb-4 opacity-50" />
                    <p className="text-[#475569] font-medium">{tr('noRankingYet')}</p>
                    <p className="text-sm text-[#94A3B8]">{tr('playToRank')}</p>
                  </div>
                ) : (
                  globalRanking.map((player, index) => (
                    <motion.div
                      key={index}
                      className="ranking-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {/* Posição */}
                      <div className={`position-badge ${getMedalClass(player.position)}`}>
                        {getMedalIcon(player.position)}
                      </div>
                      
                      {/* Info do jogador */}
                      <div className="flex-1">
                        <p className="font-bold text-[#0F172A]">{player.name}</p>
                        <p className="text-sm text-[#475569]">
                          {player.games_played} {tr('gamesPlayed').toLowerCase()}
                        </p>
                      </div>
                      
                      {/* Pontuação */}
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#003893]">{player.total_score}</p>
                        <p className="text-xs text-[#475569] uppercase">{tr('points')}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Ranking por Nível */}
            <motion.div
              className="mt-8 bg-white border-2 border-[#0F172A] rounded-2xl overflow-hidden shadow-[6px_6px_0px_#0F172A]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-[#FFD100] p-4 border-b-2 border-[#0F172A]">
                <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {tr('levelRanking')}
                </h2>
              </div>

              {/* Botões de nível */}
              <div className="p-4 flex flex-wrap gap-2 border-b-2 border-[#0F172A]">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => fetchLevelRanking(level)}
                    className={`px-4 py-2 rounded-lg font-bold border-2 border-[#0F172A] transition-all ${
                      selectedLevel === level
                        ? 'bg-[#003893] text-white shadow-[2px_2px_0px_#0F172A]'
                        : 'bg-white text-[#0F172A] hover:bg-[#E8F4FD] shadow-[2px_2px_0px_#0F172A]'
                    }`}
                    data-testid={`level-rank-btn-${level}`}
                  >
                    {tr('level')} {level}
                  </button>
                ))}
              </div>

              {/* Lista de ranking do nível */}
              <div className="p-4">
                {!selectedLevel ? (
                  <p className="text-center text-[#475569] py-8">{tr('selectLevel')}</p>
                ) : levelRanking.length === 0 ? (
                  <p className="text-center text-[#475569] py-8">{tr('noRankingYet')}</p>
                ) : (
                  <div className="space-y-2">
                    <p className="font-bold text-[#0F172A] mb-3">{levelNames[selectedLevel]}</p>
                    {levelRanking.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-[#E8F4FD] rounded-lg border border-[#003893]/20"
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getMedalClass(entry.position)}`}>
                          {entry.position}
                        </span>
                        <span className="flex-1 font-medium">{entry.user_name}</span>
                        <span className="font-bold text-[#003893]">{entry.score}/{entry.total}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Coluna lateral - Stats do utilizador */}
          <div className="space-y-6">
            {user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#003893]" />
                  {tr('yourStats')}
                </h3>

                {/* Cards de estatísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="stats-card">
                    <div className="stats-number">
                      {userStats?.user?.total_score || 0}
                    </div>
                    <div className="stats-label">{tr('totalScore')}</div>
                  </div>
                  <div className="stats-card">
                    <div className="stats-number">
                      {userStats?.user?.games_played || 0}
                    </div>
                    <div className="stats-label">{tr('gamesPlayed')}</div>
                  </div>
                </div>

                {/* Melhores pontuações por nível */}
                {userStats?.user?.best_scores && Object.keys(userStats.user.best_scores).length > 0 && (
                  <div className="mt-6 bg-white border-2 border-[#0F172A] rounded-xl p-4 shadow-[4px_4px_0px_#0F172A]">
                    <h4 className="font-bold text-[#0F172A] mb-3">{tr('bestScores')}</h4>
                    <div className="space-y-2">
                      {Object.entries(userStats.user.best_scores).map(([key, score]) => {
                        const level = parseInt(key.replace('level_', ''));
                        return (
                          <div key={key} className="flex items-center justify-between p-2 bg-[#FFFDF7] rounded-lg">
                            <span className="font-medium text-sm">{levelNames[level]}</span>
                            <span className="font-bold text-[#003893]">{score}/10</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Info box */}
            <motion.div
              className="bg-[#FFD100]/20 border-2 border-[#FFD100] rounded-xl p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-[#0F172A]">
                <strong>💡 Dica:</strong> Complete níveis com 6+ acertos para desbloquear o próximo e subir no ranking!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
