/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║           js/components/ResultsScreen.js                        ║
  ║                Ecrã de Resultados Finais                        ║
  ║  ACTUALIZADO:                                                   ║
  ║    • Botão "Voltar ao Início"                                    ║
  ║    • Guarda automaticamente o score se logado                   ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const { useEffect: useEffectResults } = React;

const ResultsScreen = ({ t, lang, score, total, totalTime, maxStreak, onRestart, onNavigate, user }) => {
  const pct = score / total;

  let level, label;
  if (pct >= 0.8) {
    level = t.levelLegend;
    label = t.expertLabel;
  } else if (pct >= 0.5) {
    level = t.levelPro;
    label = t.goodLabel;
  } else {
    level = t.levelStudent;
    label = t.okLabel;
  }

  /* Guardar score automaticamente ao montar o ecrã */
  useEffectResults(() => {
    Auth.saveScore(score, total, totalTime, maxStreak);
  }, []);

  return (
      <div className="flex flex-col min-h-screen relative overflow-hidden">

        {/* Decorações de fundo */}
        <div className="absolute inset-0 confetti-pattern pointer-events-none z-0"></div>
        <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-40 z-0"
            style={{ background: 'rgba(252,209,22,0.25)' }}
        ></div>
        <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 z-0"
            style={{ background: 'rgba(192,0,31,0.15)' }}
        ></div>

        <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 pb-28 md:pb-16 relative z-10">
          <section className="flex flex-col items-center text-center max-w-2xl w-full">

            {/* Imagem de celebração com nível */}
            <div className="relative mb-10 anim-scale" style={{ transform: 'rotate(2deg)' }}>
              <div
                  className="absolute inset-0 rounded-xl blur-xl opacity-40"
                  style={{ background: '#ffe17b' }}
              ></div>
              <img
                  src={IMAGES.celebration}
                  alt="Celebration"
                  className="relative w-52 h-52 md:w-64 md:h-64 object-cover rounded-xl editorial-shadow"
                  style={{ border: '4px solid white' }}
                  onError={e => e.target.style.display = 'none'}
              />
              <div
                  className="absolute -bottom-5 -right-5 text-on-secondary px-5 py-2 rounded-full font-headline font-bold text-base shadow-lg"
                  style={{ background: '#335ab4', transform: 'rotate(3deg)' }}
              >
                {level}
              </div>
            </div>

            {/* Pontuação e mensagem */}
            <div className="mb-12 anim-fade-up delay-1">
              <h2 className="font-label text-xs font-bold tracking-[0.2em] uppercase text-secondary mb-3">
                {t.finalResult}
              </h2>
              <h1
                  className="font-headline font-extrabold tracking-tighter mb-4"
                  style={{ fontSize: 'clamp(4rem,12vw,7rem)', lineHeight: 1 }}
              >
                {score}
                <span style={{ color: '#fcd116' }}>/</span>
                {total}
              </h1>
              <p className="font-headline text-2xl md:text-3xl font-bold text-primary leading-tight max-w-xl mx-auto">
                {label}
              </p>
              {user && (
                  <p className="mt-3 text-sm text-on-surface-variant font-medium">
                    +{score * 100 + Math.max(0, 600 - totalTime) * 5} XP guardados no teu perfil!
                  </p>
              )}
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12 anim-fade-up delay-2">
              <div
                  className="md:col-span-2 bg-surface-container-low p-6 rounded-xl flex flex-col justify-between items-start text-left"
                  style={{ borderLeft: '4px solid #715c00' }}
              >
                <span className="font-label text-xs uppercase tracking-widest text-outline mb-2">{t.streak}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline font-extrabold text-on-surface">{maxStreak}</span>
                  <span className="text-sm text-on-surface-variant">{t.streakSuffix}</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-highest rounded-full mt-3 overflow-hidden">
                  <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(maxStreak / total) * 100}%`,
                        background: 'linear-gradient(90deg,#715c00,#c0001f)'
                      }}
                  ></div>
                </div>
              </div>

              <div
                  className="glass p-6 rounded-xl flex flex-col justify-center items-center text-center"
                  style={{ background: 'rgba(51,90,180,0.12)' }}
              >
                <Icon name="timer" fill className="text-secondary mb-2" style={{ fontSize: '32px' }} />
                <span className="text-xl font-headline font-bold text-secondary">{formatTime(totalTime)}</span>
                <span className="font-label text-xs text-secondary/70 mt-1">{t.totalTime}</span>
              </div>
            </div>

            {/* Botões de acção */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto anim-fade-up delay-3">

              {/* Jogar novamente */}
              <button
                  onClick={onRestart}
                  className="group inline-flex items-center justify-center px-9 py-4 font-headline font-bold btn-shadow hover:shadow-xl transition-all active:scale-95 rounded-full gap-2"
                  style={{ background: 'linear-gradient(135deg,#715c00,#fcd116)', color: '#1f1b11' }}
              >
                {t.playAgain}
                <Icon name="refresh" className="group-hover:rotate-180 transition-transform duration-500" style={{ fontSize: '20px' }} />
              </button>

              {/* Voltar ao início — NOVO */}
              <button
                  onClick={() => onNavigate('home')}
                  className="inline-flex items-center justify-center px-9 py-4 font-headline font-bold bg-surface-container-highest text-on-surface rounded-full transition-all hover:bg-outline-variant/20 active:scale-95 gap-2"
              >
                <Icon name="home" style={{ fontSize: '20px' }} />
                {t.goHome}
              </button>

              {/* Ver ranking */}
              <button
                  onClick={() => onNavigate('ranking')}
                  className="inline-flex items-center justify-center px-9 py-4 font-headline font-bold bg-secondary text-on-secondary rounded-full transition-all hover:opacity-90 active:scale-95 gap-2"
              >
                <Icon name="leaderboard" style={{ fontSize: '20px' }} />
                Ranking
              </button>
            </div>

          </section>
        </main>

        <Footer t={t} />
        <BottomNav t={t} screen="quiz" onNavigate={onNavigate} />
      </div>
  );
};
