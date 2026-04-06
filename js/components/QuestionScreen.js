/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║           js/components/QuestionScreen.js                       ║
  ║              Ecrã de Perguntas do Quiz                          ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const QuestionScreen = ({
                          t, lang, question, questionIdx, total,
                          selected, onSelect, onNext, onPrev,
                          timeLeft, answered, onNavigate
                        }) => {

  const pct  = (questionIdx / total) * 100;
  const opts = question.options[lang];

  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow max-w-3xl mx-auto w-full px-4 md:px-6 py-10 md:py-16 pb-28 md:pb-16">

          {/* Barra de progresso + relógio */}
          <div className="mb-10 anim-fade">
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                  {question.category[lang]}
                </span>
                <h2 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface mt-1">
                  {t.question} {questionIdx + 1} {t.of} {total}
                </h2>
              </div>
              <div
                  className="glass px-4 py-2 rounded-full flex items-center gap-2"
                  style={{ background: 'rgba(51,90,180,0.12)' }}
              >
                <Icon name="timer" className="text-secondary" style={{ fontSize: '18px' }} />
                <span className="font-bold text-secondary text-sm font-label">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div
                  className="h-full rounded-full progress-bar"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #715c00, #c0001f)' }}
              ></div>
            </div>
          </div>

          {/* Cartão da pergunta */}
          <div className="relative group mb-8 anim-scale">
            <div
                className="absolute -inset-1 rounded-[2rem] blur opacity-10"
                style={{ background: 'linear-gradient(135deg,#fcd116,#7da0ff)' }}
            ></div>

            <div
                className="relative bg-surface-container-lowest rounded-[1.5rem] p-7 md:p-10 overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(113,92,0,0.06)' }}
            >
              <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none p-4">
                <Icon name={question.icon} style={{ fontSize: '80px' }} />
              </div>

              <h1 className="font-headline text-xl md:text-2xl font-bold leading-snug text-on-surface mb-8">
                {question.q[lang]}
              </h1>

              <div className="flex flex-col gap-3">
                {opts.map((opt, i) => {
                  let bg     = 'bg-surface-container-low';
                  let text   = 'text-on-surface';
                  let border = 'border border-outline-variant/10';
                  let icon   = null;

                  if (answered) {
                    if (i === question.answer) {
                      bg = ''; text = 'text-white'; border = '';
                      icon = <Icon name="check_circle" fill className="text-white" style={{ fontSize: '22px' }} />;
                    } else if (i === selected && selected !== question.answer) {
                      bg = 'bg-error/10'; text = 'text-error'; border = 'border border-error/20';
                      icon = <Icon name="cancel" fill className="text-error" style={{ fontSize: '22px' }} />;
                    }
                  } else if (selected === i) {
                    bg = ''; text = 'text-white'; border = '';
                  }

                  const isCorrectSelected = answered && i === question.answer;

                  return (
                      <button
                          key={i}
                          className={`option-btn flex items-center justify-between p-5 rounded-xl ${bg} ${text} ${border} text-left w-full`}
                          style={
                            isCorrectSelected             ? { background: '#335ab4' } :
                                (!answered && selected === i) ? { background: '#335ab4' } :
                                    undefined
                          }
                          onClick={() => !answered && onSelect(i)}
                          disabled={answered}
                      >
                        <div className="flex items-center gap-3">
                          <span
                              className="w-9 h-9 rounded-full flex items-center justify-center font-bold font-headline text-sm flex-shrink-0"
                              style={{
                                background: (isCorrectSelected || (!answered && selected === i))
                                    ? 'rgba(255,255,255,0.2)'
                                    : '#eae2d0'
                              }}
                          >
                            {LETTERS[i]}
                          </span>
                          <span className={`font-body ${answered || selected === i ? 'font-semibold' : 'font-medium'} text-base`}>
                            {opt}
                          </span>
                        </div>
                        {icon}
                      </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navegação anterior / próxima */}
          <div className="flex justify-between items-center anim-fade delay-4">
            <button
                onClick={onPrev}
                disabled={questionIdx === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-label text-sm"
            >
              <Icon name="arrow_back" style={{ fontSize: '20px' }} />
              {t.prev}
            </button>

            <button
                onClick={onNext}
                disabled={selected === null}
                className="px-8 py-3.5 rounded-full font-bold text-on-primary-fixed font-label btn-shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: selected !== null ? 'linear-gradient(135deg,#715c00,#fcd116)' : '#eae2d0',
                  color:      selected !== null ? '#1f1b11' : '#7f7760'
                }}
            >
              {t.next}
            </button>
          </div>
        </main>

        <div className="hidden lg:block fixed bottom-24 -right-16 w-64 h-64 bg-surface-container rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="hidden lg:block fixed top-32 -left-16 w-52 h-52 bg-primary-container rounded-full blur-3xl opacity-20 -z-10"></div>

        <BottomNav t={t} screen="quiz" onNavigate={onNavigate} />
      </div>
  );
};
