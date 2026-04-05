/* ─── Utility Functions & Global Constants ────────────────────────── */

/**
 * Formats a number of seconds into MM:SS string.
 * @param {number} s - Total seconds
 * @returns {string} Formatted time string
 */
const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/** Answer option letter labels */
const LETTERS = ['A', 'B', 'C', 'D'];

/** Remote image URLs used throughout the app */
const IMAGES = {
  hero:        "https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=800&q=80",
  coffee:      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  condor:      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&q=80",
  celebration: "https://images.unsplash.com/photo-1567942712661-82b9b407abbf?w=600&q=80",
  orchid:      "https://images.unsplash.com/photo-1490750967868-88df5691cc7b?w=600&q=80",
};

/** Per-question countdown duration in seconds */
const QUESTION_TIME = 60;
