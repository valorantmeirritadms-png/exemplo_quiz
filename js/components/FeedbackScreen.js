/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║          js/components/FeedbackScreen.js                        ║
  ║           Ecrã de Feedback (Resposta Certa ou Errada)           ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const FeedbackScreen = ({ t, lang, question, selected, onNext, onNavigate }) => {
  const isCorrect = selected === question.answer;

  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 pb-28 md:pb-12">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

            {/* Coluna da imagem */}
            <div className="md:col-span-5 relative anim-scale">
              <div className="absolute -top-8 -left-6 w-28 h-28 bg-primary-container opacity-20 rounded-full blur-3xl"></div>
              <div
                  className="relative z-10 rounded-3xl overflow-hidden editorial-shadow"
                  style={{ aspectRatio: '4/5', maxHeight: '400px' }}
              >
                <img
                    src={isCorrect ? IMAGES.condor : IMAGES.hero}
                    alt="Feedback"
                    className="w-full h-full object-cover"
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                    }}
                    onError={e => e.target.style.display = 'none'}
                />
                <div className="absolute bottom-5 left-5 right-5">
                  <span
                      className="inline-block px-3 py-1 text-on-secondary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-2"
                      style={{ background: '#335ab4' }}
                  >
                    {question.category[lang]}
                  </span>
                </div>
              </div>
            </div>

            {/* Coluna de conteúdo */}
            <div className="md:col-span-7 flex flex-col items-start text-left">

              {/* Crachá de resultado */}
              <div
                  className={`anim-bounce flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 font-headline font-extrabold tracking-tight text-lg ${
                      isCorrect
                          ? 'bg-primary-fixed text-on-surface'
                          : 'bg-tertiary-container text-on-tertiary-container'
                  }`}
                  style={isCorrect ? {} : { color: '#930015' }}
              >
                <Icon name={isCorrect ? 'check_circle' : 'cancel'} fill style={{ fontSize: '24px' }} />
                {isCorrect ? t.correct : t.incorrect}
              </div>

              <h1
                  className="anim-fade-up delay-1 font-headline font-extrabold leading-[1.1] mb-6 tracking-tighter text-primary"
                  style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)' }}
              >
                {isCorrect ? t.knowledgeTitle : t.almostTitle}
              </h1>

              {!isCorrect && (
                  <p className="anim-fade-up delay-2 text-sm font-label text-on-surface-variant mb-2">
                    {t.correctAnswer} <strong>{question.options[lang][question.answer]}</strong>
                  </p>
              )}

              {/* Facto curioso */}
              <div
                  className="anim-fade-up delay-2 w-full p-6 rounded-[1.5rem] mb-8 relative overflow-hidden"
                  style={{
                    background: 'rgba(252,243,225,0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(208,198,171,0.15)'
                  }}
              >
                <div className="absolute top-0 right-0 p-3 opacity-[0.08]">
                  <Icon name="lightbulb" style={{ fontSize: '60px' }} />
                </div>
                <p className="font-label text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  {t.funFact}
                </p>
                <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed font-medium italic">
                  "{question.fact[lang]}"
                </p>
              </div>

              {/* Botão próxima pergunta */}
              <button
                  onClick={onNext}
                  className="group flex items-center gap-3 px-9 py-4 rounded-full font-headline font-extrabold text-base btn-shadow hover:shadow-xl transition-all active:scale-95 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#715c00,#fcd116)', color: '#1f1b11' }}
              >
                <span>{t.nextQuestion}</span>
                <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }} />
              </button>
            </div>
          </div>
        </main>

        <BottomNav t={t} screen="quiz" onNavigate={onNavigate} />
      </div>
  );
};
