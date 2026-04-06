/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║           js/components/QuestionScreen.js                       ║
  ║              Ecrã de Perguntas do Quiz                          ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Este é o ecrã central do quiz — onde o utilizador lê a         ║
  ║  pergunta, selecciona uma resposta e avança.                    ║
  ║                                                                 ║
  ║  Estrutura visual:                                              ║
  ║    1. Barra de progresso com temporizador                       ║
  ║    2. Cartão da pergunta com 4 opções de resposta               ║
  ║    3. Botões de navegação (Anterior / Próxima Pergunta)         ║
  ║                                                                 ║
  ║  Props recebidas:                                               ║
  ║    t           — Textos traduzidos                              ║
  ║    lang        — Idioma activo                                  ║
  ║    question    — Objecto com a pergunta actual                  ║
  ║    questionIdx — Índice da pergunta (0 = primeira)              ║
  ║    total       — Total de perguntas                             ║
  ║    selected    — Opção actualmente seleccionada (ou null)       ║
  ║    onSelect    — Função ao clicar numa opção                    ║
  ║    onNext      — Função ao confirmar resposta                   ║
  ║    onPrev      — Função ao clicar "Anterior"                    ║
  ║    timeLeft    — Segundos restantes no temporizador             ║
  ║    answered    — Boolean: se já respondeu a esta pergunta       ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const QuestionScreen = ({
                          t, lang, question, questionIdx, total,
                          selected, onSelect, onNext, onPrev,
                          timeLeft, answered
                        }) => {

  /*
    pct — Percentagem de progresso no quiz (de 0% a 100%).
    Usada para a largura da barra de progresso.
    Nota: usa questionIdx (não questionIdx + 1), então começa em 0%
    e chega a quase 100% na última pergunta (não a 100%).
  */
  const pct = (questionIdx / total) * 100;

  /*
    opts — As opções de resposta no idioma actual.
    question.options é um objecto com 'es' e 'pt'.
    Ao aceder com [lang], obtemos o array correcto para o idioma activo.
    Ex: question.options['pt'] = ["Condor dos Andes", "Beija-flor", ...]
  */
  const opts = question.options[lang];

  return (
      <div className="flex flex-col min-h-screen">
        {/* pb-28 md:pb-16 = padding inferior extra no móvel para a BottomNav não cobrir o conteúdo */}
        <main className="flex-grow max-w-3xl mx-auto w-full px-4 md:px-6 py-10 md:py-16 pb-28 md:pb-16">


          {/* ═══════════════════════════════════════════════════════════
            ÁREA DE PROGRESSO — Categoria, título, relógio e barra
            ═══════════════════════════════════════════════════════════ */}
          <div className="mb-10 anim-fade">

            {/* Linha superior: categoria + relógio */}
            <div className="flex justify-between items-end mb-3">

              {/* Lado esquerdo: categoria e número da pergunta */}
              <div>
                {/* Nome da categoria — ex: "Música" / "Natureza" */}
                <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                {question.category[lang]}
              </span>
                {/* "Pergunta 3 de 10" */}
                <h2 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface mt-1">
                  {t.question} {questionIdx + 1} {t.of} {total}
                  {/* questionIdx + 1 porque os índices começam em 0 mas mostramos "1, 2, 3..." */}
                </h2>
              </div>

              {/* Lado direito: temporizador circular (pílula com ícone + tempo) */}
              <div
                  className="glass px-4 py-2 rounded-full flex items-center gap-2"
                  style={{ background: 'rgba(51,90,180,0.12)' }}
              >
                <Icon name="timer" className="text-secondary" style={{ fontSize: '18px' }} />
                {/*
                formatTime() converte segundos em formato MM:SS.
                Ex: formatTime(75) → "01:15"
                Definida em helpers.js.
              */}
                <span className="font-bold text-secondary text-sm font-label">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Barra de progresso horizontal */}
            <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div
                  className="h-full rounded-full progress-bar"  /* progress-bar = animação CSS em styles.css */
                  style={{
                    width: `${pct}%`,                                           // Largura dinâmica baseada no progresso
                    background: 'linear-gradient(90deg, #715c00, #c0001f)'     // Gradiente dourado → vermelho
                  }}
              ></div>
            </div>
          </div>


          {/* ═══════════════════════════════════════════════════════════
            CARTÃO DA PERGUNTA com opções de resposta
            ═══════════════════════════════════════════════════════════ */}
          <div className="relative group mb-8 anim-scale">

            {/* Brilho decorativo atrás do cartão (blur suave) */}
            <div
                className="absolute -inset-1 rounded-[2rem] blur opacity-10"
                style={{ background: 'linear-gradient(135deg,#fcd116,#7da0ff)' }}
            ></div>

            {/* Cartão principal */}
            <div
                className="relative bg-surface-container-lowest rounded-[1.5rem] p-7 md:p-10 overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(113,92,0,0.06)' }}
            >
              {/* Ícone decorativo em marca d'água (quase invisível) */}
              <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none p-4">
                <Icon name={question.icon} style={{ fontSize: '80px' }} />
              </div>

              {/* Texto da pergunta */}
              <h1 className="font-headline text-xl md:text-2xl font-bold leading-snug text-on-surface mb-8">
                {question.q[lang]}  {/* A pergunta no idioma activo */}
              </h1>


              {/* ── Opções de Resposta ────────────────────────────────
                opts.map() cria um botão para cada opção (A, B, C, D).
                'i' é o índice (0, 1, 2 ou 3).
            */}
              <div className="flex flex-col gap-3">
                {opts.map((opt, i) => {

                  /*
                    Sistema de estilo dinâmico para cada opção.
                    As variáveis bg, text, border e icon mudam dependendo do estado:
                      - Ainda não respondeu: opção seleccionada fica azul, resto neutro
                      - Já respondeu: correcta fica azul, errada fica vermelho claro
                  */

                  // Estilos por defeito (não seleccionada, não respondida)
                  let bg     = 'bg-surface-container-low';
                  let text   = 'text-on-surface';
                  let border = 'border border-outline-variant/10';
                  let icon   = null;

                  if (answered) {
                    // Após responder: mostrar feedback visual
                    if (i === question.answer) {
                      // Esta opção É a correcta — fundo azul, ícone de check
                      bg = ''; text = 'text-white'; border = '';
                      icon = <Icon name="check_circle" fill className="text-white" style={{ fontSize: '22px' }} />;

                    } else if (i === selected && selected !== question.answer) {
                      // Esta opção foi seleccionada mas É ERRADA — fundo vermelho subtil
                      bg = 'bg-error/10'; text = 'text-error'; border = 'border border-error/20';
                      icon = <Icon name="cancel" fill className="text-error" style={{ fontSize: '22px' }} />;
                    }
                    // As outras opções (nem correcta nem seleccionada errada) ficam com estilo neutro

                  } else if (selected === i) {
                    // Antes de responder: opção seleccionada fica azul (como pré-visualização)
                    bg = ''; text = 'text-white'; border = '';
                  }

                  // Booleanos auxiliares para clareza no código abaixo
                  const isCorrectSelected = answered && i === question.answer;
                  const isWrongSelected   = answered && i === selected && selected !== question.answer;

                  return (
                      <button
                          key={i}  // Chave única obrigatória no .map()
                          className={`option-btn flex items-center justify-between p-5 rounded-xl ${bg} ${text} ${border} text-left w-full`}
                          style={
                            /*
                              O estilo de fundo azul é aplicado via 'style' em vez de
                              classes Tailwind porque a cor exacta precisa de ser #335ab4.
                              Tailwind só tem classes pré-definidas; para cores personalizadas,
                              usamos style inline.
                            */
                            isCorrectSelected             ? { background: '#335ab4' } :
                                (!answered && selected === i) ? { background: '#335ab4' } :
                                    undefined  // 'undefined' = sem estilo inline (usa as classes CSS)
                          }
                          onClick={() => !answered && onSelect(i)}  // Só permite seleccionar se ainda não respondeu
                          disabled={answered}  // Desactivar os botões após responder
                      >
                        {/* Lado esquerdo: letra (A/B/C/D) + texto da opção */}
                        <div className="flex items-center gap-3">

                          {/* Bolinha com a letra — LETTERS['A','B','C','D'] de helpers.js */}
                          <span
                              className="w-9 h-9 rounded-full flex items-center justify-center font-bold font-headline text-sm flex-shrink-0"
                              style={{
                                background: (isCorrectSelected || (!answered && selected === i))
                                    ? 'rgba(255,255,255,0.2)'  // Fundo branco translúcido quando seleccionado
                                    : '#eae2d0'                // Fundo bege quando não seleccionado
                              }}
                          >
                        {LETTERS[i]}  {/* 'A', 'B', 'C' ou 'D' */}
                      </span>

                          {/* Texto da opção */}
                          <span className={`font-body ${answered || selected === i ? 'font-semibold' : 'font-medium'} text-base`}>
                        {opt}
                      </span>
                        </div>

                        {/* Lado direito: ícone de check ou X (só após responder) */}
                        {icon}
                      </button>
                  );
                })}
              </div>
            </div>
          </div>


          {/* ═══════════════════════════════════════════════════════════
            NAVEGAÇÃO — Botões Anterior e Próxima Pergunta
            ═══════════════════════════════════════════════════════════ */}
          <div className="flex justify-between items-center anim-fade delay-4">

            {/* Botão "Anterior" — desactivado se estamos na primeira pergunta */}
            <button
                onClick={onPrev}
                disabled={questionIdx === 0}  // Não pode voltar atrás da primeira pergunta
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-label text-sm"
            >
              <Icon name="arrow_back" style={{ fontSize: '20px' }} />
              {t.prev}  {/* "Anterior" */}
            </button>

            {/* Botão "Próxima Pergunta" — desactivado se nenhuma opção seleccionada */}
            <button
                onClick={onNext}
                disabled={selected === null}  // Só ativo depois de seleccionar uma opção
                className="px-8 py-3.5 rounded-full font-bold text-on-primary-fixed font-label btn-shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  /*
                    Cor dinâmica: gradiente dourado quando há uma opção seleccionada,
                    bege apagado quando não há selecção.
                  */
                  background: selected !== null ? 'linear-gradient(135deg,#715c00,#fcd116)' : '#eae2d0',
                  color:      selected !== null ? '#1f1b11' : '#7f7760'
                }}
            >
              {t.next}  {/* "Siguiente Pregunta" / "Próxima Pergunta" */}
            </button>
          </div>
        </main>

        {/* ── Elementos decorativos de fundo (círculos desfocados) ──────
          'fixed' = posicionados em relação ao ecrã (não à página).
          '-z-10' = atrás de todo o conteúdo.
          'blur-3xl' = muito desfocados, criando um efeito de luz ambiente.
          'hidden lg:block' = só visíveis em ecrãs grandes.
      */}
        <div className="hidden lg:block fixed bottom-24 -right-16 w-64 h-64 bg-surface-container rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="hidden lg:block fixed top-32 -left-16 w-52 h-52 bg-primary-container rounded-full blur-3xl opacity-20 -z-10"></div>

        {/* Navegação inferior para telemóvel */}
        <BottomNav t={t} screen="quiz" />
      </div>
  );
};