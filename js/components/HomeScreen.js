/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║              js/components/HomeScreen.js                        ║
  ║                  Ecrã Inicial (Página de Boas-Vindas)           ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Este é o primeiro ecrã que o utilizador vê ao abrir a app.     ║
  ║  É composto por duas secções principais:                        ║
  ║                                                                 ║
  ║  1. HERO — Grande banner de apresentação com:                   ║
  ║     • Fundo abstracto com as cores da bandeira colombiana       ║
  ║     • Título principal e descrição                              ║
  ║     • Botões "Começar" e "Ver Ranking"                          ║
  ║     • Grelha de imagens (bento grid)                            ║
  ║                                                                 ║
  ║  2. CATEGORIAS — Três cartões de categoria clicáveis            ║
  ║                                                                 ║
  ║  Props recebidas do App.js:                                     ║
  ║    t       — Textos traduzidos do idioma activo                 ║
  ║    lang    — Idioma activo ('es' ou 'pt')                       ║
  ║    onStart — Função para iniciar o quiz (definida no App.js)    ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

/*
  HomeScreen é um componente funcional definido como arrow function.
  A sintaxe ({ t, lang, onStart }) usa destructuring directamente
  nos parâmetros — é equivalente a escrever:
    const HomeScreen = (props) => { const { t, lang, onStart } = props; ... }
*/
const HomeScreen = ({ t, lang, onStart }) => (
    /*
      O componente devolve directamente JSX (sem corpo de função com 'return').
      Quando usamos () => ( ... ) em vez de () => { return ... },
      o 'return' é implícito.

      Contentor principal: coluna flexível que ocupa a altura total do ecrã.
    */
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow">  {/* flex-grow: expande para ocupar o espaço disponível */}


        {/* ═══════════════════════════════════════════════════════════
          SECÇÃO HERO — Banner principal de apresentação
          min-h-[90vh] = altura mínima de 90% do ecrã (viewport height)
          overflow-hidden = esconde qualquer conteúdo que ultrapasse as bordas
          ═══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden py-16 px-4 md:px-12">

          {/* ── Fundo abstracto: Bandeira da Colômbia ──────────────────
            Três faixas horizontais com as cores da bandeira (amarelo, azul, vermelho).
            'absolute inset-0' = posicionado por cima do fundo, cobrindo toda a área.
            'z-0' = camada inferior (o conteúdo fica por cima, no z-10).
            'opacity-[0.07]' = muito transparente (7%) — apenas uma sugestão de cor.
            'pointer-events-none' = os cliques "passam através" deste elemento.
        */}
          <div className="absolute inset-0 z-0 flex flex-col opacity-[0.07] pointer-events-none">
            <div className="h-1/2" style={{ background: '#715c00' }}></div>  {/* Amarelo/dourado — metade superior */}
            <div className="h-1/4" style={{ background: '#335ab4' }}></div>  {/* Azul — quarto */}
            <div className="h-1/4" style={{ background: '#c0001f' }}></div>  {/* Vermelho — quarto inferior */}
          </div>

          {/*
          Grelha de conteúdo (12 colunas em ecrã grande, 1 coluna em móvel).
          'relative z-10' = fica por cima do fundo abstracto.
          'max-w-6xl mx-auto' = largura máxima centrada na página.
        */}
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">

            {/* ── Coluna de conteúdo (texto) — ocupa 7 das 12 colunas ── */}
            <div className="lg:col-span-7 flex flex-col items-start">

              {/* Etiqueta "Edición Especial" — pequena pílula de destaque */}
              <span
                  className="anim-fade bg-tertiary-container text-on-tertiary-container px-4 py-1.5 rounded-full font-label text-xs font-bold tracking-[0.2em] uppercase mb-6 ml-2"
                  style={{ color: '#bb001e' }}  // Vermelho colombiano
              >
              {t.tagline}  {/* "Edición Especial" / "Edição Especial" */}
            </span>

              {/*
              Título principal — usa clamp() para tamanho de fonte responsivo:
              clamp(mínimo, preferido, máximo) = entre 3.5rem e 7rem, dependendo da largura.
              'anim-fade-up delay-1' = animação de entrada com atraso de 0.08s.
            */}
              <h1
                  className="anim-fade-up delay-1 font-headline font-extrabold tracking-tighter leading-[0.9] mb-6"
                  style={{ fontSize: 'clamp(3.5rem,10vw,7rem)', marginLeft: '-2%' }}
              >
                {t.heroTitle1}<br />  {/* "Quiz:" */}
                {/* "Orgullo" / "Orgulho" — em dourado e itálico */}
                <span style={{ color: '#715c00', fontStyle: 'italic' }}>{t.heroTitle2}</span><br />
                {/* "Colombiano" — em vermelho */}
                <span style={{ color: '#c0001f' }}>{t.heroTitle3}</span>
              </h1>

              {/*
              Parágrafo descritivo com destaque lateral (borda esquerda amarela).
              'anim-fade-up delay-2' = animação com mais atraso (0.16s).
            */}
              <p
                  className="anim-fade-up delay-2 text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 font-body leading-relaxed pl-4"
                  style={{ borderLeft: '4px solid #fcd116' }}  // Linha vertical amarela à esquerda
              >
                {t.heroDesc}
              </p>

              {/* ── Botões de acção ─────────────────────────────────── */}
              <div className="anim-fade-up delay-3 flex flex-col sm:flex-row gap-3 pl-2 w-full sm:w-auto">

                {/* Botão principal "Começar" — gradiente dourado */}
                <button
                    onClick={onStart}  // Chama a função startQuiz() definida no App.js
                    className="px-8 py-4 font-headline font-bold text-lg rounded-full text-white flex items-center justify-center gap-2 btn-shadow hover:scale-105 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #715c00, #fcd116)' }}
                >
                  {t.start}  {/* "Empezar" / "Começar" */}
                  <Icon name="play_arrow" />  {/* Ícone de "play" → triângulo */}
                </button>

                {/* Botão secundário "Ver Ranking" — estilo neutro */}
                <button className="px-8 py-4 bg-surface-container-highest text-on-surface font-headline font-bold text-lg rounded-full hover:bg-surface-container transition-all">
                  {t.ranking}
                </button>
              </div>
            </div>


            {/* ── Coluna de imagens (bento grid) — 5 das 12 colunas ──
              Bento grid = disposição assimétrica de cartões, inspirada
              na tendência de design "Bento" (caixa de refeição japonesa).
          */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 relative">

              {/* Pílula flutuante com recorde actual — só visível em ecrã médio+ */}
              <div
                  className="absolute -top-10 -right-2 z-20 glass px-4 py-3 rounded-2xl editorial-shadow hidden md:flex items-center gap-2"
                  style={{ border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <Icon name="workspace_premium" fill className="text-secondary" style={{ fontSize: '28px' }} />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 text-on-secondary-container">
                    {t.recordLabel}  {/* "Récord Actual" */}
                  </p>
                  <p className="text-base font-bold text-secondary">2,450 pts</p>
                </div>
              </div>

              {/* Imagem 1: Orquídea — canto superior esquerdo */}
              <div className="rounded-[2rem] overflow-hidden aspect-[4/5] bg-surface-container editorial-shadow">
                <img
                    src={IMAGES.orchid}    // URL da imagem (definida em helpers.js)
                    alt="Orquídea"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    onError={e => e.target.style.display = 'none'}  // Esconder se a imagem falhar
                />
              </div>

              {/* Imagem 2: Café — canto superior direito, deslocado para baixo */}
              <div className="mt-10 rounded-[2rem] overflow-hidden aspect-[4/5] editorial-shadow">
                <img
                    src={IMAGES.coffee}
                    alt="Café"
                    className="w-full h-full object-cover"
                    onError={e => e.target.style.display = 'none'}
                />
              </div>

              {/* Imagem 3: Colombia — ocupa as duas colunas, formato panorâmico */}
              <div
                  className="col-span-2 rounded-[2rem] overflow-hidden bg-surface-container-highest editorial-shadow relative"
                  style={{ aspectRatio: '16/8' }}  // Proporção widescreen
              >
                <img
                    src={IMAGES.hero}
                    alt="Colombia"
                    className="w-full h-full object-cover opacity-80"
                    onError={e => e.target.style.display = 'none'}
                />
                {/* Gradiente escuro na parte inferior para tornar o texto legível */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(31,27,17,0.6), transparent)' }}
                ></div>
                {/* Texto sobreposto na imagem */}
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="font-headline font-bold text-lg">Tradición Vallenata</p>
                  <p className="text-xs opacity-70">El corazón de nuestra cultura</p>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* ═══════════════════════════════════════════════════════════
          SECÇÃO CATEGORIAS — Três cartões de categoria
          ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-surface-container-low">
          <div className="max-w-6xl mx-auto px-4 md:px-8">

            {/* Cabeçalho da secção com título e link "Ver todas" */}
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline text-3xl font-bold mb-3 tracking-tight">{t.categories}</h2>
                {/* Linha decorativa vermelha abaixo do título */}
                <div className="h-1.5 w-20 rounded-full" style={{ background: '#c0001f' }}></div>
              </div>
              <a className="text-primary font-bold hover:underline flex items-center gap-1 text-sm" href="#">
                {t.seeAll} <Icon name="arrow_forward" className="text-sm" style={{ fontSize: '18px' }} />
              </a>
            </div>

            {/* Grelha de 3 cartões de categoria */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/*
              Array de objectos com os dados de cada categoria.
              Cada objecto tem: nome, descrição, contagem, ícone, cor, fundo.
              'mt: true' indica que o segundo cartão deve ter margem superior
              (cria um efeito visual "escalonado").
            */}
              {[
                { name: t.cat1Name, desc: t.cat1Desc, count: t.cat1Count, icon: 'landscape',   color: '#715c00', bg: '#ffe17b' },
                { name: t.cat2Name, desc: t.cat2Desc, count: t.cat2Count, icon: 'music_note',  color: '#335ab4', bg: '#dae1ff', mt: true },
                { name: t.cat3Name, desc: t.cat3Desc, count: t.cat3Count, icon: 'history_edu', color: '#c0001f', bg: '#ffc8c4' },
              ].map(({ name, desc, count, icon, color, bg, mt }) => (
                  <div
                      key={name}                 // Identificador único obrigatório no .map()
                      onClick={onStart}          // Clicar no cartão também inicia o quiz
                      className={`bg-surface-container-lowest p-7 rounded-[2rem] editorial-shadow hover:-translate-y-2 transition-all cursor-pointer group ${mt ? 'md:mt-8' : ''}`}
                  >
                    {/* Ícone da categoria com fundo colorido transparente */}
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors"
                        style={{ background: bg + '33' }}  // '33' em hex = ~20% de opacidade
                    >
                      <Icon name={icon} style={{ color, fontSize: '28px' }} />
                    </div>

                    <h3 className="font-headline text-xl font-bold mb-3">{name}</h3>
                    <p className="text-on-surface-variant text-sm mb-5 leading-relaxed">{desc}</p>

                    {/* Contagem de perguntas — ex: "15 Perguntas" */}
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color }}>{count}</span>
                  </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Rodapé e navegação inferior (componentes definidos em shared.js) */}
      <Footer t={t} />
      <BottomNav t={t} screen="home" />
    </div>
);