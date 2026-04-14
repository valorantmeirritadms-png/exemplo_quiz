import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import Header from '../components/Header';
import { ArrowRight, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Quiz() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { completeLevel, isLevelUnlocked } = useProgress();

  const [questions, setQuestions] = useState([]);
  const [tema, setTema] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);
  const [newLevelUnlocked, setNewLevelUnlocked] = useState(false);

  const level = parseInt(levelId);

  useEffect(() => {
    if (!isLevelUnlocked(level)) {
      navigate('/');
      return;
    }
    fetchQuestions();
  }, [level, lang]);

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

  const handleAnswerSelect = async (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    
    try {
      const response = await axios.post(`${API}/quiz/check-answer`, {
        question_id: questions[currentIndex].id,
        answer: answer
      });
      
      setIsCorrect(response.data.correct);
      setCorrectAnswer(response.data.correct_answer);
      
      if (response.data.correct) {
        setScore(prev => prev + 1);
      }
      
      setShowResult(true);
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      setCorrectAnswer('');
    } else {
      // Quiz complete
      const finalScore = score;
      const wasNextLevelLocked = level < 5 && !isLevelUnlocked(level + 1);
      completeLevel(level, finalScore, questions.length);
      
      if (wasNextLevelLocked && finalScore >= 6) {
        setNewLevelUnlocked(true);
      }
      setQuizComplete(true);
    }
  };

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
            <motion.div
              className={`w-24 h-24 mx-auto mb-6 rounded-2xl border-2 border-[#0F172A] flex items-center justify-center shadow-[4px_4px_0px_#0F172A] ${isPassing ? 'bg-[#22C55E]' : 'bg-[#CE1126]'}`}
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {isPassing ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : (
                <XCircle className="w-12 h-12 text-white" />
              )}
            </motion.div>

            <h1 className="text-3xl font-black text-[#0F172A] mb-2">
              {isPassing ? t('congratulations') : t('tryAgain')}
            </h1>
            
            <p className="text-[#475569] font-medium mb-6">
              {t('levelCompleted')}: {tema}
            </p>

            <div className="bg-[#FFFDF7] border-2 border-[#0F172A] rounded-2xl p-6 mb-6 shadow-[4px_4px_0px_#0F172A]">
              <p className="text-sm font-semibold text-[#475569] uppercase tracking-wide mb-2">
                {t('yourScore')}
              </p>
              <p className="text-5xl font-black text-[#0F172A]">
                {score}/{questions.length}
              </p>
              <div className="mt-4 progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

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
                  setCurrentIndex(0);
                  setScore(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                  setQuizComplete(false);
                  setNewLevelUnlocked(false);
                }}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
                data-testid="play-again-button"
              >
                {t('playAgain')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
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
        {/* Progress */}
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
                <p className="text-sm font-semibold text-[#475569] uppercase tracking-wide">
                  {t('level')} {level} • {tema}
                </p>
              </div>
            </div>
            <div className="bg-white border-2 border-[#0F172A] rounded-lg px-4 py-2 shadow-[2px_2px_0px_#0F172A]">
              <span className="font-bold text-[#0F172A]">
                {t('question')} {currentIndex + 1} {t('of')} {questions.length}
              </span>
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white border-2 border-[#0F172A] rounded-2xl p-6 md:p-8 mb-6 shadow-[6px_6px_0px_#0F172A]">
              <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] text-center">
                {currentQuestion.pergunta}
              </h2>
            </div>

            {/* Options */}
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
                  <span className="mr-3 w-8 h-8 flex-shrink-0 bg-[#FFFDF7] border-2 border-[#0F172A] rounded-lg flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Result feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-xl border-2 border-[#0F172A] mb-6 ${isCorrect ? 'bg-[#22C55E]/20' : 'bg-[#CE1126]/20'}`}
                >
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-6 h-6 text-[#CE1126]" />
                    )}
                    <div>
                      <p className={`font-bold ${isCorrect ? 'text-[#22C55E]' : 'text-[#CE1126]'}`}>
                        {isCorrect ? t('correct') : t('incorrect')}
                      </p>
                      {!isCorrect && (
                        <p className="text-[#0F172A] font-medium">
                          {t('theCorrectAnswer')} {correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
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

        {/* Score indicator */}
        <div className="fixed bottom-6 right-6 bg-white border-2 border-[#0F172A] rounded-xl px-4 py-2 shadow-[4px_4px_0px_#0F172A]">
          <p className="font-bold text-[#0F172A]">
            {t('score')}: {score}/{currentIndex + (showResult ? 1 : 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
