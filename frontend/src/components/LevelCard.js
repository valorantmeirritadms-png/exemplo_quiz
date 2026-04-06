import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Music, Palette, UtensilsCrossed, BookOpen, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const levelImages = {
  1: "https://static.prod-images.emergentagent.com/jobs/815d05f6-6b0c-435d-a5b7-570387e8474f/images/b3e1b274fb6ad2834fa3fbef25d6b1798b34cbc58b599ae7b01015ef8bf3711d.png",
  2: "https://static.prod-images.emergentagent.com/jobs/815d05f6-6b0c-435d-a5b7-570387e8474f/images/ce83d750bfa4b16cf7cfdc51e41da91bd39d47a5cd0088ce62a935fd31adc1c4.png",
  3: "https://images.unsplash.com/photo-1644753787071-8933b5daed2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwyfHxjb2xvbWJpYW4lMjBmb29kJTIwYXJlcGF8ZW58MHx8fHwxNzc0NjE0MTM2fDA&ixlib=rb-4.1.0&q=85",
  4: "https://images.pexels.com/photos/1684081/pexels-photo-1684081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  5: "https://static.prod-images.emergentagent.com/jobs/815d05f6-6b0c-435d-a5b7-570387e8474f/images/617299a5c4b2be473e875b17d191d849290d2faacabea52e26db0e5db5c86572.png"
};

const levelIcons = {
  1: Music,
  2: Palette,
  3: UtensilsCrossed,
  4: BookOpen,
  5: AlertTriangle
};

const levelColors = {
  1: '#FFD100',
  2: '#003893',
  3: '#CE1126',
  4: '#FFD100',
  5: '#0F172A'
};

export default function LevelCard({ level, tema, isUnlocked, isCompleted, bestScore, onClick }) {
  const { t, lang } = useLanguage();
  const Icon = levelIcons[level.level] || Music;
  const bgColor = levelColors[level.level];
  const image = levelImages[level.level];

  const themeName = lang === 'es' && level.tema_es ? level.tema_es : level.tema;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: level.level * 0.1 }}
      whileHover={isUnlocked ? { y: -6 } : {}}
      onClick={isUnlocked ? onClick : undefined}
      className={`level-card ${!isUnlocked ? 'locked' : ''}`}
      data-testid={`level-card-${level.level}`}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image} 
          alt={themeName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div 
          className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A]"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className={`w-5 h-5 ${level.level === 2 || level.level === 5 ? 'text-white' : 'text-[#0F172A]'}`} />
        </div>

        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white/90 border-2 border-[#0F172A] rounded-xl px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_#0F172A]">
              <Lock className="w-5 h-5 text-[#0F172A]" />
              <span className="font-bold text-[#0F172A]">{t('locked')}</span>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="absolute top-3 right-3 bg-[#22C55E] border-2 border-[#0F172A] rounded-xl px-3 py-1 flex items-center gap-1 shadow-[2px_2px_0px_#0F172A]">
            <CheckCircle className="w-4 h-4 text-white" />
            <span className="font-bold text-white text-sm">{bestScore}/10</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <p className="text-sm font-semibold text-[#475569] uppercase tracking-wide mb-1">
            {t('level')} {level.level}
          </p>
          <h3 className="font-black text-xl text-[#0F172A]">{themeName}</h3>
        </div>
        <p className="text-sm text-[#475569] mt-2">
          {level.total_questions} {t('questions')}
        </p>
      </div>
    </motion.div>
  );
}
