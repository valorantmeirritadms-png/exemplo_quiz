/**
 * Página do Quiz
 * 
 * ALTERAÇÕES:
 * - Perguntas são embaralhadas aleatoriamente pelo backend
 * - Feedback enriquecido com curiosidades sobre cada pergunta
 * - Design mais vivo com animações
 * - Submissão de pontuação para o ranking
 * - Todos os elementos comentados
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../hooks/useProgress';
import Header from '../components/Header';
import { ArrowRight, CheckCircle, XCircle, ArrowLeft, Lightbulb, PartyPopper, Frown } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Quiz() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { completeLevel, isLevelUnlocked } = useProgress();

  // Estados do quiz
  const [questions, setQuestions] = useState([]);
  const [tema, setTema] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [curiosidade, setCuriosidade] = useState(''); // ALTERAÇÃO: Estado para curiosidade
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);
  const [newLevelUnlocked, setNewLevelUnlocked] = useState(false);

  const level = parseInt(levelId);

  // Carregar perguntas ao montar
  useEffect(() => {
    if (!isLevelUnlocked(level)) {
      navigate('/');
      return;
    }
    fetchQuestions();
  }, [level, lang]);

  /**
   * Busca as perguntas do nível
   * ALTERAÇÃO: Backend agora retorna perguntas embaralhadas
   */
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API}/quiz/level/${level}?lang=${lang}`, { withCredentials: true });
      setQuestions(response.data.questions);
      setTema(response.data.tema);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      navigate('/');
    }
  };

  /**
   * Handler para seleção de resposta
   * ALTERAÇÃO: Agora recebe curiosidade do backend
   */
  const handleAnswerSelect = async (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    
    try {
      // ALTERAÇÃO: Passando lang para receber curiosidade no idioma correto
      const response = await axios.post(`${API}/quiz/check-answer?lang=${lang}`, {
        question_id: questions[currentIndex].id,
        answer: answer
      }, { withCredentials: true });
      
      setIsCorrect(response.data.correct);
      setCorrectAnswer(response.data.correct_answer);
      setCuriosidade(response.data.curiosidade); // ALTERAÇÃO: Guardar curiosidade
      
      if (response.data.correct) {
        setScore(prev => prev + 1);
      }
      
      setShowResult(true);
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  /**
   * Avança para a próxima pergunta ou finaliza o quiz
   */
  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      // Próxima pergunta
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      setCorrectAnswer('');
      setCuriosidade(''); // ALTERAÇÃO: Limpar curiosidade
    } else {
      // Quiz completo
      const finalScore = score;
      const wasNextLevelLocked = level < 5 && !isLevelUnlocked(level + 1);
      completeLevel(level, finalScore, questions.length);
      
      // ALTERAÇÃO: Submeter pontuação para o ranking
      try {
        await axios.post(`${API}/ranking/submit`, {
          level: level,
          score: finalScore,
          total: questions.length
        }, { withCredentials: true });
      } catch (error) {
        console.log('Could not submit score to ranking');
      }
      
      if (wasNextLevelLocked && finalScore >= 6) {
        setNewLevelUnlocked(true);
      }
      setQuizComplete(true);
    }
  };

  /**
   * Retorna a classe CSS para a opção baseado no estado
   */
  const getOptionClass = (option) => {
    if (!showResult) {
      return selectedAnswer === option ? 'quiz-option selected' : 'quiz-option';
    }
    
    if (option === correctAnswer) {
      return 'quiz-option correct';
    }
    
    if (option === selectedAnswer && !isCorrect) {
      return 'quiz-option incorrect';
    }
    
    return 'quiz-option';
  };

  // Loading state
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

  // Tela de resultados finais
  if (quizComplete) {
    const percentage = (score / questions.length) * 100;
    const isPassing = percentage >= 60;

    return (
      <div className="min-h-screen bg-[#FFFDF7]" data-testid="quiz-results-page">
        <Header />
        
        <div className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            className="auth-card text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Ícone de resultado com animação */}
            <motion.div
              className={`w-24 h-24 mx-auto mb-6 rounded-2xl border-2 border-[#0F172A] flex items-center justify-center shadow-[4px_4px_0px_#0F172A] ${isPassing ? 'bg-[#22C55E]' : 'bg-[#CE1126]'}`}
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {isPassing ? (
                <PartyPopper className="w-12 h-12 text-white" />
              ) : (
                <Frown className="w-12 h-12 text-white" />
              )}
            </motion.div>

            <h1 className="text-3xl font-black text-[#0F172A] mb-2">
              {isPassing ? t('congratulations') : t('tryAgain')}
            </h1>
            
            <p className="text-[#475569] font-medium mb-6">
              {t('levelCompleted')}: {tema}
            </p>

            {/* Card de pontuação */}
            <div className="bg-[#E8F4FD] border-2 border-[#003893] rounded-2xl p-6 mb-6 shadow-[4px_4px_0px_#003893]">
              <p className="text-sm font-semibold text-[#003893] uppercase tracking-wide mb-2">
                {t('yourScore')}
              </p>
              <p className="text-5xl font-black text-[#003893]">
                {score}/{questions.length}
              </p>
              <div className="mt-4 progress-bar-blue">
                <div 
                  className="progress-fill-blue"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Mensagem de nível desbloqueado */}
            {newLevelUnlocked && (
              <motion.div
                className="bg-[#FFD100]/20 border-2 border-[#FFD100] rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-bold text-[#0F172A]">🎉 {t('levelUnlocked')}</p>
              </motion.div>
            )}

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={() => navigate('/')}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
                data-testid="back-to-levels-button"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('backToLevels')}
              </motion.button>
              
              <motion.button
                onClick={() => {
                  // Reset do quiz
                  setCurrentIndex(0);
                  setScore(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                  setQuizComplete(false);
                  setNewLevelUnlocked(false);
                  setCuriosidade('');
                  fetchQuestions(); // ALTERAÇÃO: Recarregar perguntas (novo shuffle)
                }}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
                data-testid="play-again-button"
              >
                {t('playAgain')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* ALTERAÇÃO: Link para ranking */}
            <button
              onClick={() => navigate('/ranking')}
              className="mt-4 text-[#003893] font-bold hover:underline"
            >
              📊 Ver Ranking Global
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#FFFDF7]" data-testid="quiz-page">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Barra de progresso e navegação */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 bg-white border-2 border-[#0F172A] rounded-lg hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_#0F172A]"
                data-testid="back-button"
              >
                <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
              </button>
              <div>
                <p className="text-sm font-semibold text-[#003893] uppercase tracking-wide">
                  {t('level')} {level} • {tema}
                </p>
              </div>
            </div>
            <div className="bg-[#003893] text-white border-2 border-[#0F172A] rounded-lg px-4 py-2 shadow-[2px_2px_0px_#0F172A]">
              <span className="font-bold">
                {t('question')} {currentIndex + 1} {t('of')} {questions.length}
              </span>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Pergunta e opções com animação */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Card da pergunta */}
            <div className="bg-white border-2 border-[#0F172A] rounded-2xl p-6 md:p-8 mb-6 shadow-[6px_6px_0px_#003893]">
              <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] text-center">
                {currentQuestion.pergunta}
              </h2>
            </div>

            {/* Grid de opções */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuestion.opcoes.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={getOptionClass(option)}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  disabled={showResult}
                  data-testid={`quiz-option-${index}`}
                >
                  {/* Badge da letra */}
                  <span className="mr-3 w-8 h-8 flex-shrink-0 bg-[#E8F4FD] border-2 border-[#003893] rounded-lg flex items-center justify-center font-bold text-sm text-[#003893]">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </motion.button>
              ))}
            </div>

            {/* ALTERAÇÃO: Card de feedback com curiosidade */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`curiosity-card ${isCorrect ? 'correct' : 'incorrect'} mb-6`}
                >
                  {/* Ícone e status */}
                  <div className="flex items-start gap-4">
                    <div className={`curiosity-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`font-bold text-lg mb-1 ${isCorrect ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
                        {isCorrect ? t('correct') : t('incorrect')}
                      </p>
                      
                      {/* Resposta correta se errou */}
                      {!isCorrect && (
                        <p className="text-[#0F172A] font-medium mb-3">
                          {t('theCorrectAnswer')} <strong>{correctAnswer}</strong>
                        </p>
                      )}
                      
                      {/* ALTERAÇÃO: Curiosidade sobre a pergunta */}
                      {curiosidade && (
                        <div className="mt-3 p-3 bg-white/50 rounded-xl">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-[#FFD100] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-[#475569] uppercase mb-1">
                                {lang === 'es' ? 'Curiosidad' : 'Curiosidade'}
                              </p>
                              <p className="text-sm text-[#0F172A]">{curiosidade}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botão próxima/terminar */}
            {showResult && (
              <motion.button
                onClick={handleNext}
                className="btn-primary w-full flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.98 }}
                data-testid="next-button"
              >
                {currentIndex < questions.length - 1 ? t('next') : t('finish')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicador de pontuação flutuante */}
        <div className="fixed bottom-6 right-6 bg-[#003893] text-white border-2 border-[#0F172A] rounded-xl px-4 py-2 shadow-[4px_4px_0px_#0F172A]">
          <p className="font-bold">
            {t('score')}: {score}/{currentIndex + (showResult ? 1 : 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
