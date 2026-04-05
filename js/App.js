/* ─── App Root ────────────────────────────────────────────────────── */
const { useState, useEffect, useRef, useCallback } = React;

const App = () => {
  const [lang, setLang]                   = useState('es');
  const [screen, setScreen]               = useState('home'); // home | question | feedback | results
  const [questionIdx, setQuestionIdx]     = useState(0);
  const [answers, setAnswers]             = useState(Array(questions.length).fill(null));
  const [currentSelected, setCurrentSelected] = useState(null);
  const [answered, setAnswered]           = useState(false);
  const [timeLeft, setTimeLeft]           = useState(QUESTION_TIME);
  const [totalTime, setTotalTime]         = useState(0);

  const timerRef      = useRef(null);
  const totalTimerRef = useRef(null);

  const t        = i18n[lang];
  const question = questions[questionIdx];

  /* ── Per-question countdown timer ─────────────────────────────── */
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

  /* ── Total elapsed time tracker ───────────────────────────────── */
  useEffect(() => {
    if (screen === 'question' || screen === 'feedback') {
      totalTimerRef.current = setInterval(() => setTotalTime(p => p + 1), 1000);
    } else {
      clearInterval(totalTimerRef.current);
    }
    return () => clearInterval(totalTimerRef.current);
  }, [screen]);

  /* ── Quiz actions ─────────────────────────────────────────────── */
  const startQuiz = () => {
    setQuestionIdx(0);
    setAnswers(Array(questions.length).fill(null));
    setCurrentSelected(null);
    setAnswered(false);
    setTotalTime(0);
    setScreen('question');
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

  /* ── Computed results ─────────────────────────────────────────── */
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const maxStreak = (() => {
    let max = 0, cur = 0;
    answers.forEach((a, i) => {
      if (a === questions[i].answer) { cur++; max = Math.max(max, cur); }
      else cur = 0;
    });
    return max;
  })();

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <div className="bg-background text-on-surface font-body" style={{ minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} t={t} currentScreen={screen} />

      {screen === 'home' && (
        <HomeScreen t={t} lang={lang} onStart={startQuiz} />
      )}

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
        />
      )}

      {screen === 'feedback' && (
        <FeedbackScreen
          t={t}
          lang={lang}
          question={question}
          selected={answers[questionIdx]}
          onNext={handleFeedbackNext}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen
          t={t}
          lang={lang}
          score={score}
          total={questions.length}
          totalTime={totalTime}
          maxStreak={maxStreak}
          onRestart={startQuiz}
        />
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
