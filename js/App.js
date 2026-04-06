/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║                          App.js                                 ║
  ║              Componente Raiz da Aplicação                       ║
  ║  ACTUALIZADO:                                                   ║
  ║    • Sistema de navegação expandido                             ║
  ║    • Suporte a login/registro (opcional)                        ║
  ║    • Ecrãs: home, invite, login, register, question,            ║
  ║             feedback, results, ranking, profile                 ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const { useState, useEffect, useRef, useCallback } = React;

const App = () => {

  /* ── ESTADO GLOBAL ──────────────────────────────────────────────── */

  const [lang,    setLang]    = useState('es');
  const [screen,  setScreen]  = useState('home');
  const [user,    setUser]    = useState(Auth.getUser());
  const [authErr, setAuthErr] = useState(null);

  /* Estado do quiz */
  const [questionIdx,      setQuestionIdx]      = useState(0);
  const [answers,          setAnswers]          = useState(Array(questions.length).fill(null));
  const [currentSelected,  setCurrentSelected]  = useState(null);
  const [answered,         setAnswered]         = useState(false);
  const [timeLeft,         setTimeLeft]         = useState(QUESTION_TIME);
  const [totalTime,        setTotalTime]        = useState(0);

  const timerRef      = useRef(null);
  const totalTimerRef = useRef(null);

  const t        = i18n[lang];
  const question = questions[questionIdx];


  /* ── NAVEGAÇÃO CENTRALIZADA ────────────────────────────────────── */
  /*
    Função única para mudar de ecrã.
    Garante que o scroll vai sempre para o topo ao navegar.
  */
  const navigate = (target) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScreen(target);
    setAuthErr(null);
  };


  /* ── TEMPORIZADOR POR PERGUNTA ─────────────────────────────────── */
  useEffect(() => {
    if (screen !== 'question') return;
    clearInterval(timerRef.current);
    setTimeLeft(QUESTION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!answered) handleNext(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, questionIdx]);


  /* ── TEMPORIZADOR TOTAL ────────────────────────────────────────── */
  useEffect(() => {
    if (screen === 'question' || screen === 'feedback') {
      totalTimerRef.current = setInterval(() => setTotalTime(p => p + 1), 1000);
    } else {
      clearInterval(totalTimerRef.current);
    }
    return () => clearInterval(totalTimerRef.current);
  }, [screen]);


  /* ── ACÇÕES DO QUIZ ────────────────────────────────────────────── */

  /*
    startQuiz — Inicia ou reinicia o quiz.
    Se o utilizador NÃO está logado, mostra o ecrã de convite primeiro.
    Se já está logado (ou veio do convite como convidado), vai directamente.
  */
  const startQuiz = () => {
    setQuestionIdx(0);
    setAnswers(Array(questions.length).fill(null));
    setCurrentSelected(null);
    setAnswered(false);
    setTotalTime(0);
    navigate('question');
  };

  /*
    handleStartClick — Chamado quando o utilizador clica "Começar" no HomeScreen.
    Mostra o ecrã de convite se não estiver logado.
  */
  const handleStartClick = () => {
    if (!user) {
      navigate('invite');
    } else {
      startQuiz();
    }
  };

  const handleSelect = (idx) => {
    if (answered) return;
    setCurrentSelected(idx);
  };

  const handleNext = useCallback((timedOut = false) => {
    clearInterval(timerRef.current);
    const sel = timedOut ? -1 : currentSelected;
    if (sel === null) return;
    const newAnswers = [...answers];
    newAnswers[questionIdx] = sel;
    setAnswers(newAnswers);
    setAnswered(true);
    setScreen('feedback');
  }, [currentSelected, answers, questionIdx]);

  const handleFeedbackNext = () => {
    if (questionIdx + 1 >= questions.length) {
      setScreen('results');
    } else {
      setQuestionIdx(q => q + 1);
      setCurrentSelected(answers[questionIdx + 1]);
      setAnswered(false);
      setScreen('question');
    }
  };

  const handlePrev = () => {
    if (questionIdx === 0) return;
    setQuestionIdx(q => q - 1);
    setCurrentSelected(answers[questionIdx - 1]);
    setAnswered(false);
  };


  /* ── ACÇÕES DE AUTH ────────────────────────────────────────────── */

  const handleLogin = (email, password) => {
    const result = Auth.login(email, password);
    if (result.ok) {
      setUser(result.user);
      navigate('home');
    } else {
      setAuthErr(result.error);
    }
  };

  const handleRegister = (name, email, password) => {
    const result = Auth.register(name, email, password);
    if (result.ok) {
      setUser(result.user);
      navigate('home');
    } else {
      setAuthErr(result.error);
    }
  };

  const handleLogout = () => {
    Auth.logout();
    setUser(null);
    navigate('home');
  };


  /* ── CÁLCULO DOS RESULTADOS ───────────────────────────────────── */
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const maxStreak = (() => {
    let max = 0, cur = 0;
    answers.forEach((a, i) => {
      if (a === questions[i].answer) { cur++; max = Math.max(max, cur); }
      else cur = 0;
    });
    return max;
  })();


  /* ── PROPS PARTILHADAS ────────────────────────────────────────── */
  const sharedProps = { t, lang, user, onNavigate: navigate };


  /* ── RENDERIZAÇÃO ─────────────────────────────────────────────── */
  return (
      <div className="bg-background text-on-surface font-body" style={{ minHeight: '100vh' }}>

        {/* Header aparece em todos os ecrãs excepto quiz */}
        {!['question', 'feedback'].includes(screen) && (
            <Header
                lang={lang}
                setLang={setLang}
                t={t}
                currentScreen={screen}
                user={user}
                onNavigate={navigate}
            />
        )}

        {/* ── Ecrã Inicial ── */}
        {screen === 'home' && (
            <HomeScreen
                {...sharedProps}
                onStart={handleStartClick}
            />
        )}

        {/* ── Ecrã de Convite (antes de jogar sem conta) ── */}
        {screen === 'invite' && (
            <InviteScreen
                t={t}
                onLogin={()   => navigate('login')}
                onRegister={() => navigate('register')}
                onGuest={startQuiz}
            />
        )}

        {/* ── Ecrã de Login ── */}
        {screen === 'login' && (
            <LoginScreen
                t={t}
                onLogin={handleLogin}
                onRegister={() => navigate('register')}
                onGuest={startQuiz}
                error={authErr}
            />
        )}

        {/* ── Ecrã de Registro ── */}
        {screen === 'register' && (
            <RegisterScreen
                t={t}
                onRegister={handleRegister}
                onLogin={() => navigate('login')}
                onGuest={startQuiz}
                error={authErr}
            />
        )}

        {/* ── Ecrã de Perguntas ── */}
        {screen === 'question' && (
            <QuestionScreen
                t={t}
                lang={lang}
                question={question}
                questionIdx={questionIdx}
                total={questions.length}
                selected={currentSelected}
                onSelect={handleSelect}
                onNext={() => handleNext(false)}
                onPrev={handlePrev}
                timeLeft={timeLeft}
                answered={answered}
                onNavigate={navigate}
            />
        )}

        {/* ── Ecrã de Feedback ── */}
        {screen === 'feedback' && (
            <FeedbackScreen
                t={t}
                lang={lang}
                question={question}
                selected={answers[questionIdx]}
                onNext={handleFeedbackNext}
                onNavigate={navigate}
            />
        )}

        {/* ── Ecrã de Resultados ── */}
        {screen === 'results' && (
            <ResultsScreen
                t={t}
                lang={lang}
                score={score}
                total={questions.length}
                totalTime={totalTime}
                maxStreak={maxStreak}
                onRestart={startQuiz}
                onNavigate={navigate}
                user={user}
            />
        )}

        {/* ── Ecrã de Ranking ── */}
        {screen === 'ranking' && (
            <RankingScreen
                {...sharedProps}
            />
        )}

        {/* ── Ecrã de Perfil ── */}
        {screen === 'profile' && (
            <ProfileScreen
                {...sharedProps}
                onLogout={handleLogout}
            />
        )}
      </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
