/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║               js/utils/helpers.js                               ║
  ║         Funções Auxiliares e Constantes Globais                 ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const LETTERS = ['A', 'B', 'C', 'D'];

const IMAGES = {
  hero:        "https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=800&q=80",
  coffee:      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  condor:      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&q=80",
  celebration: "https://images.unsplash.com/photo-1567942712661-82b9b407abbf?w=600&q=80",
  orchid:      "https://images.unsplash.com/photo-1490750967868-88df5691cc7b?w=600&q=80",
};

const QUESTION_TIME = 60;

/*
  ── SISTEMA DE AUTH LOCAL ──────────────────────────────────────────
  Simula autenticação com localStorage.
  Numa produção real, estas funções fariam chamadas ao servidor PHP/MySQL.
*/

const Auth = {
  /* Devolve o utilizador actual ou null se não logado */
  getUser: () => {
    try {
      const u = localStorage.getItem('quiz_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  },

  /* Faz login (simulado — verifica apenas que o email existe) */
  login: (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('quiz_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('quiz_user', JSON.stringify(user));
        return { ok: true, user };
      }
      return { ok: false, error: 'Credenciais inválidas' };
    } catch { return { ok: false, error: 'Erro interno' }; }
  },

  /* Regista novo utilizador */
  register: (name, email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('quiz_users') || '[]');
      if (users.find(u => u.email === email)) {
        return { ok: false, error: 'Email já registado' };
      }
      const user = { id: Date.now(), name, email, password, avatar: null, xp: 0, level: 1 };
      users.push(user);
      localStorage.setItem('quiz_users', JSON.stringify(users));
      localStorage.setItem('quiz_user', JSON.stringify(user));
      return { ok: true, user };
    } catch { return { ok: false, error: 'Erro interno' }; }
  },

  /* Termina sessão */
  logout: () => {
    localStorage.removeItem('quiz_user');
  },

  /* Guarda resultado do quiz para o ranking */
  saveScore: (score, total, totalTime, maxStreak) => {
    try {
      const user = Auth.getUser();
      const entry = {
        id: Date.now(),
        userId: user ? user.id : null,
        userName: user ? user.name : 'Convidado',
        score,
        total,
        totalTime,
        maxStreak,
        date: new Date().toISOString(),
      };
      const scores = JSON.parse(localStorage.getItem('quiz_scores') || '[]');
      scores.push(entry);
      localStorage.setItem('quiz_scores', JSON.stringify(scores));

      /* Actualizar XP do utilizador logado */
      if (user) {
        const pts = score * 100 + Math.max(0, 600 - totalTime) * 5;
        user.xp = (user.xp || 0) + pts;
        user.level = Math.floor(user.xp / 1000) + 1;
        /* Actualizar na lista de users */
        const users = JSON.parse(localStorage.getItem('quiz_users') || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx >= 0) users[idx] = user;
        localStorage.setItem('quiz_users', JSON.stringify(users));
        localStorage.setItem('quiz_user', JSON.stringify(user));
      }
      return entry;
    } catch { return null; }
  },

  /* Devolve ranking ordenado por score */
  getRanking: () => {
    try {
      const scores = JSON.parse(localStorage.getItem('quiz_scores') || '[]');
      /* Agrupa por utilizador — pega melhor score */
      const map = {};
      scores.forEach(s => {
        const key = s.userId || s.userName;
        if (!map[key] || s.score > map[key].score) map[key] = s;
      });
      return Object.values(map).sort((a, b) => b.score - a.score || a.totalTime - b.totalTime);
    } catch { return []; }
  },
};
