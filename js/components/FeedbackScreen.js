/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║          js/components/FeedbackScreen.js                        ║
  ║           Ecrã de Feedback (Resposta Certa ou Errada)           ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Mostrado APÓS o utilizador confirmar a resposta.               ║
  ║  Indica se acertou ou errou, mostra a resposta correcta         ║
  ║  (se errou) e apresenta um facto curioso sobre o tema.          ║
  ║                                                                 ║
  ║  Layout em duas colunas (em ecrã grande):                       ║
  ║    Esquerda — Imagem temática (cóndor se acertou, paisagem se errou) ║
  ║    Direita  — Resultado, título, facto curioso, botão avançar   ║
  ║                                                                 ║
  ║  Props recebidas:                                               ║
  ║    t        — Textos traduzidos                                 ║
  ║    lang     — Idioma activo                                     ║
  ║    question — Pergunta actual (para mostrar resposta correcta)  ║
  ║    selected — Índice da opção escolhida pelo utilizador         ║
  ║    onNext   — Função para avançar para a próxima pergunta       ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const FeedbackScreen = ({ t, lang, question, selected, onNext }) => {

  /*
    isCorrect — Boolean que diz se o utilizador acertou.
    Compara o índice da opção seleccionada com o índice da resposta correcta.
    Ex: selected = 2, question.answer = 2 → isCorrect = true
  */
  const isCorrect = selected === question.answer;

  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 pb-28 md:pb-12">
          {/* Grelha de 12 colunas: 5 para a imagem, 7 para o conteúdo */}
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">


            {/* ═══════════════════════════════════════════════════════
              COLUNA DA IMAGEM (5 colunas)
              ═══════════════════════════════════════════════════════ */}
            <div className="md:col-span-5 relative anim-scale">

              {/* Brilho decorativo atrás da imagem */}
              <div className="absolute -top-8 -left-6 w-28 h-28 bg-primary-container opacity-20 rounded-full blur-3xl"></div>

              <div
                  className="relative z-10 rounded-3xl overflow-hidden editorial-shadow"
                  style={{ aspectRatio: '4/5', maxHeight: '400px' }}
              >
                {/*
                Imagem diferente conforme o resultado:
                  Acertou → Imagem do Cóndor (símbolo de conquista)
                  Errou   → Imagem genérica de paisagem colombiana
              */}
                <img
                    src={isCorrect ? IMAGES.condor : IMAGES.hero}
                    alt="Feedback"
                    className="w-full h-full object-cover"
                    style={{
                      /*
                        maskImage cria um fade (desvanecer) na parte inferior da imagem.
                        "black 80%" = totalmente visível até 80% da altura.
                        "transparent 100%" = completamente invisível no fundo.
                        Cria um efeito elegante de transição imagem → fundo.
                        'WebkitMaskImage' é necessário para compatibilidade com Safari.
                      */
                      maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                    }}
                    onError={e => e.target.style.display = 'none'}
                />

                {/* Etiqueta de categoria sobreposta na imagem */}
                <div className="absolute bottom-5 left-5 right-5">
                <span
                    className="inline-block px-3 py-1 text-on-secondary text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-2"
                    style={{ background: '#335ab4' }}
                >
                  {question.category[lang]}  {/* Ex: "Música" / "História" */}
                </span>
                </div>
              </div>
            </div>


            {/* ═══════════════════════════════════════════════════════
              COLUNA DE CONTEÚDO (7 colunas)
              ═══════════════════════════════════════════════════════ */}
            <div className="md:col-span-7 flex flex-col items-start text-left">

              {/* ── Crachá de Resultado (✓ Correcto! ou ✗ Incorrecto!) ── */}
              <div
                  className={`anim-bounce flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 font-headline font-extrabold tracking-tight text-lg ${
                      isCorrect
                          ? 'bg-primary-fixed text-on-surface'           // Fundo amarelo claro se correcto
                          : 'bg-tertiary-container text-on-tertiary-container' // Fundo rosa se errado
                  }`}
                  style={isCorrect ? {} : { color: '#930015' }}  // Vermelho escuro se errado
              >
                {/* Ícone dinâmico: check se correcto, X se errado */}
                <Icon name={isCorrect ? 'check_circle' : 'cancel'} fill style={{ fontSize: '24px' }} />
                {isCorrect ? t.correct : t.incorrect}
              </div>

              {/* Título grande — diferente se acertou ou errou */}
              <h1
                  className="anim-fade-up delay-1 font-headline font-extrabold leading-[1.1] mb-6 tracking-tighter text-primary"
                  style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)' }}
              >
                {/* "Conhecimento de Altitude" se correcto, "Quase!" se errado */}
                {isCorrect ? t.knowledgeTitle : t.almostTitle}
              </h1>

              {/*
              Mostrar a resposta correcta APENAS se o utilizador errou.
              O operador '&&' em JSX: se a primeira parte for falsa, não renderiza nada.
            */}
              {!isCorrect && (
                  <p className="anim-fade-up delay-2 text-sm font-label text-on-surface-variant mb-2">
                    {t.correctAnswer} <strong>{question.options[lang][question.answer]}</strong>
                    {/* Ex: "A resposta correcta era: Cóndor dos Andes" */}
                  </p>
              )}

              {/* ── Cartão do Facto Curioso ────────────────────────── */}
              <div
                  className="anim-fade-up delay-2 w-full p-6 rounded-[1.5rem] mb-8 relative overflow-hidden"
                  style={{
                    background: 'rgba(252,243,225,0.85)',            // Bege translúcido
                    backdropFilter: 'blur(12px)',                    // Efeito de vidro (blur atrás)
                    border: '1px solid rgba(208,198,171,0.15)'       // Borda muito subtil
                  }}
              >
                {/* Ícone de lâmpada em marca d'água */}
                <div className="absolute top-0 right-0 p-3 opacity-[0.08]">
                  <Icon name="lightbulb" style={{ fontSize: '60px' }} />
                </div>

                {/* Etiqueta "Curiosidade" / "Dato Curioso" */}
                <p className="font-label text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  {t.funFact}
                </p>

                {/* Texto do facto curioso em itálico */}
                <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed font-medium italic">
                  "{question.fact[lang]}"
                  {/* Ex: "O Cóndor dos Andes pode ter uma envergadura de até 3,2 metros." */}
                </p>
              </div>

              {/* ── Botão "Próxima Pergunta" ─────────────────────── */}
              <button
                  onClick={onNext}  // Avança para a próxima pergunta (ou resultados)
                  className="group flex items-center gap-3 px-9 py-4 rounded-full font-headline font-extrabold text-base btn-shadow hover:shadow-xl transition-all active:scale-95 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#715c00,#fcd116)', color: '#1f1b11' }}
              >
                <span>{t.nextQuestion}</span>
                {/*
                'group-hover:translate-x-1' — quando o elemento pai (.group) está
                em hover, a seta desloca-se 1 unidade para a direita.
                Este padrão "group" do Tailwind permite estilizar filhos
                com base no hover do pai.
              */}
                <Icon
                    name="arrow_forward"
                    className="group-hover:translate-x-1 transition-transform"
                    style={{ fontSize: '20px' }}
                />
              </button>
            </div>
          </div>
        </main>

        <BottomNav t={t} screen="quiz" />
      </div>
  );
};