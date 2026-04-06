/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║           js/components/ResultsScreen.js                        ║
  ║                Ecrã de Resultados Finais                        ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Mostrado quando o utilizador termina todas as perguntas.       ║
  ║                                                                 ║
  ║  Apresenta:                                                     ║
  ║    • Imagem de celebração com nível conquistado                 ║
  ║    • Pontuação (ex: "7/10")                                     ║
  ║    • Mensagem motivacional baseada na pontuação                 ║
  ║    • Estatísticas: maior sequência e tempo total                ║
  ║    • Botões para recomeçar ou partilhar resultado               ║
  ║                                                                 ║
  ║  Níveis:                                                        ║
  ║    ≥ 80% acertos → "Nível Lenda!" + "És um especialista!"       ║
  ║    ≥ 50% acertos → "Nível Pro!"   + "Muito bom resultado!"      ║
  ║    < 50% acertos → "Nível Aprendiz" + "Continua a aprender."   ║
  ║                                                                 ║
  ║  Props recebidas:                                               ║
  ║    t          — Textos traduzidos                               ║
  ║    lang       — Idioma activo                                   ║
  ║    score      — Número de respostas correctas                   ║
  ║    total      — Total de perguntas                              ║
  ║    totalTime  — Tempo total decorrido (em segundos)             ║
  ║    maxStreak  — Maior sequência consecutiva de acertos          ║
  ║    onRestart  — Função para recomeçar o quiz                    ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const ResultsScreen = ({ t, lang, score, total, totalTime, maxStreak, onRestart }) => {

  /*
    pct — Percentagem de acertos (valor entre 0 e 1, não 0 a 100).
    Ex: 7 acertos em 10 perguntas → pct = 0.7
    Usamos valores entre 0 e 1 para facilitar as comparações abaixo.
  */
  const pct = score / total;

  /*
    level e label — Texto do nível e mensagem motivacional.
    'let' permite reatribuição (ao contrário de 'const').
    As variáveis são declaradas sem valor inicial e atribuídas
    no bloco if/else abaixo.
  */
  let level, label;

  if (pct >= 0.8) {
    // 80% ou mais: nível máximo
    level = t.levelLegend;  // "Nível Lenda!"
    label = t.expertLabel;  // "És um especialista em Colômbia!"
  } else if (pct >= 0.5) {
    // Entre 50% e 79%: nível intermédio
    level = t.levelPro;     // "Nível Pro!"
    label = t.goodLabel;    // "Muito bom resultado!"
  } else {
    // Menos de 50%: nível iniciante
    level = t.levelStudent; // "Nível Aprendiz"
    label = t.okLabel;      // "Continua a aprender."
  }

  return (
      /*
        'relative overflow-hidden' — necessário para os elementos decorativos
        de fundo não ultrapassarem os limites do componente.
      */
      <div className="flex flex-col min-h-screen relative overflow-hidden">

        {/* ── Decorações de fundo ────────────────────────────────────
          Estes elementos são puramente visuais e não interactivos.
          'absolute inset-0' = cobrem toda a área.
          'pointer-events-none z-0' = ficam atrás do conteúdo.
      */}

        {/* Padrão de confetti (pontos coloridos) — definido em styles.css */}
        <div className="absolute inset-0 confetti-pattern pointer-events-none z-0"></div>

        {/* Brilho amarelo no canto superior direito */}
        <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-40 z-0"
            style={{ background: 'rgba(252,209,22,0.25)' }}
        ></div>

        {/* Brilho vermelho no canto inferior esquerdo */}
        <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 z-0"
            style={{ background: 'rgba(192,0,31,0.15)' }}
        ></div>


        {/* ── Conteúdo principal — 'relative z-10' para ficar à frente das decorações */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 pb-28 md:pb-16 relative z-10">
          <section className="flex flex-col items-center text-center max-w-2xl w-full">


            {/* ═══════════════════════════════════════════════════════
              IMAGEM DE CELEBRAÇÃO com etiqueta de nível
              ═══════════════════════════════════════════════════════ */}
            <div className="relative mb-10 anim-scale" style={{ transform: 'rotate(2deg)' }}>  {/* Ligeiramente inclinada para dinamismo */}

              {/* Brilho amarelo atrás da imagem */}
              <div
                  className="absolute inset-0 rounded-xl blur-xl opacity-40"
                  style={{ background: '#ffe17b' }}
              ></div>

              {/* Imagem de celebração */}
              <img
                  src={IMAGES.celebration}
                  alt="Celebration"
                  className="relative w-52 h-52 md:w-64 md:h-64 object-cover rounded-xl editorial-shadow"
                  style={{ border: '4px solid white' }}
                  onError={e => e.target.style.display = 'none'}
              />

              {/* Etiqueta do nível — sobreposta na imagem, ligeiramente rodada */}
              <div
                  className="absolute -bottom-5 -right-5 text-on-secondary px-5 py-2 rounded-full font-headline font-bold text-base shadow-lg"
                  style={{ background: '#335ab4', transform: 'rotate(3deg)' }}
              >
                {level}  {/* Ex: "Nível Lenda!" */}
              </div>
            </div>


            {/* ═══════════════════════════════════════════════════════
              PONTUAÇÃO E MENSAGEM
              ═══════════════════════════════════════════════════════ */}
            <div className="mb-12 anim-fade-up delay-1">

              {/* Rótulo "Resultado Final" */}
              <h2 className="font-label text-xs font-bold tracking-[0.2em] uppercase text-secondary mb-3">
                {t.finalResult}
              </h2>

              {/* Pontuação em destaque — ex: "7/10" com a barra em amarelo */}
              <h1
                  className="font-headline font-extrabold tracking-tighter mb-4"
                  style={{ fontSize: 'clamp(4rem,12vw,7rem)', lineHeight: 1 }}
              >
                {score}
                <span style={{ color: '#fcd116' }}>/</span>  {/* Barra em amarelo */}
                {total}
              </h1>

              {/* Mensagem motivacional */}
              <p className="font-headline text-2xl md:text-3xl font-bold text-primary leading-tight max-w-xl mx-auto">
                {label}  {/* Ex: "Muito bom resultado!" */}
              </p>
            </div>


            {/* ═══════════════════════════════════════════════════════
              GRELHA DE ESTATÍSTICAS
              ═══════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12 anim-fade-up delay-2">

              {/* Cartão de Sequência — ocupa 2 das 3 colunas */}
              <div
                  className="md:col-span-2 bg-surface-container-low p-6 rounded-xl flex flex-col justify-between items-start text-left"
                  style={{ borderLeft: '4px solid #715c00' }}  // Linha decorativa dourada à esquerda
              >
                {/* Etiqueta */}
                <span className="font-label text-xs uppercase tracking-widest text-outline mb-2">{t.streak}</span>

                {/* Número da sequência + sufixo */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline font-extrabold text-on-surface">{maxStreak}</span>
                  <span className="text-sm text-on-surface-variant">{t.streakSuffix}</span>
                  {/* Ex: "3 Perguntas seguidas" */}
                </div>

                {/* Mini barra de progresso da sequência */}
                <div className="w-full h-2.5 bg-surface-container-highest rounded-full mt-3 overflow-hidden">
                  <div
                      className="h-full rounded-full"
                      style={{
                        /*
                          Largura proporcional à sequência máxima.
                          Ex: maxStreak=3, total=10 → 30% de largura.
                          Multiplicar por 100 para converter de decimal para percentagem.
                        */
                        width: `${(maxStreak / total) * 100}%`,
                        background: 'linear-gradient(90deg,#715c00,#c0001f)'
                      }}
                  ></div>
                </div>
              </div>

              {/* Cartão de Tempo Total — ocupa 1 coluna */}
              <div
                  className="glass p-6 rounded-xl flex flex-col justify-center items-center text-center"
                  style={{ background: 'rgba(51,90,180,0.12)' }}
              >
                {/* Ícone de relógio */}
                <Icon name="timer" fill className="text-secondary mb-2" style={{ fontSize: '32px' }} />

                {/* Tempo formatado — ex: "02:34" */}
                <span className="text-xl font-headline font-bold text-secondary">{formatTime(totalTime)}</span>

                {/* Etiqueta */}
                <span className="font-label text-xs text-secondary/70 mt-1">{t.totalTime}</span>
              </div>
            </div>


            {/* ═══════════════════════════════════════════════════════
              BOTÕES DE ACÇÃO
              ═══════════════════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto anim-fade-up delay-3">

              {/* Botão "Jogar novamente" — reinicia o quiz do início */}
              <button
                  onClick={onRestart}  // Chama startQuiz() no App.js, que reinicia tudo
                  className="group inline-flex items-center justify-center px-9 py-4 font-headline font-bold btn-shadow hover:shadow-xl transition-all active:scale-95 rounded-full gap-2"
                  style={{ background: 'linear-gradient(135deg,#715c00,#fcd116)', color: '#1f1b11' }}
              >
                {t.playAgain}
                {/*
                'group-hover:rotate-180' — ao fazer hover no botão (o .group),
                o ícone de refresh roda 180 graus.
                'duration-500' = a transição demora 500ms.
              */}
                <Icon
                    name="refresh"
                    className="group-hover:rotate-180 transition-transform duration-500"
                    style={{ fontSize: '20px' }}
                />
              </button>

              {/* Botão "Partilhar pontuação" — estilisticamente secundário */}
              <button className="inline-flex items-center justify-center px-9 py-4 font-headline font-bold bg-surface-container-highest text-on-surface rounded-full transition-all hover:bg-outline-variant/20 active:scale-95 gap-2">
                {t.shareScore}
                <Icon name="share" style={{ fontSize: '20px' }} />
              </button>
            </div>

          </section>
        </main>

        {/* Rodapé e navegação inferior */}
        <Footer t={t} />
        <BottomNav t={t} screen="quiz" />
      </div>
  );
};