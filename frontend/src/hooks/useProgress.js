import { useState, useEffect } from 'react';

const STORAGE_KEY = 'colombia_quiz_progress';

const defaultProgress = {
  unlocked_levels: [1],
  scores: {},
  best_scores: {}
};

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const isLevelUnlocked = (level) => {
    return progress.unlocked_levels.includes(level);
  };

  const isLevelCompleted = (level) => {
    return progress.scores[level] !== undefined;
  };

  const getLevelScore = (level) => {
    return progress.scores[level] || 0;
  };

  const getBestScore = (level) => {
    return progress.best_scores[level] || 0;
  };

  const completeLevel = (level, score, total) => {
    setProgress(prev => {
      const newUnlocked = [...prev.unlocked_levels];
      const nextLevel = level + 1;
      
      // Unlock next level if scored 6+ out of 10
      if (score >= 6 && nextLevel <= 5 && !newUnlocked.includes(nextLevel)) {
        newUnlocked.push(nextLevel);
      }

      const newBestScores = { ...prev.best_scores };
      if (!newBestScores[level] || score > newBestScores[level]) {
        newBestScores[level] = score;
      }

      return {
        ...prev,
        unlocked_levels: newUnlocked,
        scores: { ...prev.scores, [level]: score },
        best_scores: newBestScores
      };
    });
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  return {
    progress,
    isLevelUnlocked,
    isLevelCompleted,
    getLevelScore,
    getBestScore,
    completeLevel,
    resetProgress
  };
}
