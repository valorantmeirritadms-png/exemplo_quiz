/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║                  js/components/shared.js                        ║
  ║          Componentes de Interface Partilhados                   ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Este ficheiro contém componentes pequenos e reutilizáveis       ║
  ║  que aparecem em múltiplos ecrãs da aplicação:                  ║
  ║                                                                 ║
  ║   • Icon       — Ícone de material design                       ║
  ║   • LangToggle — Botão para trocar idioma (ES / PT)             ║
  ║   • Header     — Barra de topo da aplicação                     ║
  ║   • BottomNav  — Navegação inferior (telemóvel)                 ║
  ║   • Footer     — Rodapé da aplicação                            ║
  ╚══════════════════════════════════════════════════════════════════╝
*/


/*
  ─── COMPONENTE: Icon ────────────────────────────────────────────────
  Um invólucro (wrapper) simples para os ícones do Google Material Symbols.

  Como funciona a biblioteca de ícones:
  Quando escrevemos <span class="material-symbols-outlined">timer</span>,
  a fonte do Google converte automaticamente a palavra "timer" num ícone
  de relógio. O nome tem de ser exactamente um dos ícones disponíveis.

  Props (propriedades que este componente recebe):
    name      — Nome do ícone (ex: "timer", "check_circle", "cancel")
    fill      — Boolean: true = ícone preenchido, false = apenas contorno (padrão)
    className — Classes CSS adicionais para personalizar tamanho/cor
    style     — Objecto de estilos CSS inline para personalização extra
*/
const Icon = ({ name, fill = false, className = "", style }) => (
    <span
        /*
          "material-symbols-outlined" é a classe base da biblioteca de ícones.
          "fill-icon" (definida em styles.css) activa o preenchimento sólido
          quando 'fill' é true.
          Template literal (`) permite combinar várias classes numa string.
        */
        className={`material-symbols-outlined ${fill ? 'fill-icon' : ''} ${className}`}
        style={style}
    >
    {/* O conteúdo de texto é o nome do ícone — a fonte converte-o em símbolo */}
      {name}
  </span>
);


/*
  ─── COMPONENTE: LangToggle ──────────────────────────────────────────
  Botão de troca de idioma — aparece no cabeçalho.
  Permite alternar entre Espanhol (ES) e Português (PT).

  Props:
    lang    — Idioma activo actual ('es' ou 'pt')
    setLang — Função para actualizar o idioma (vinda do App.js via estado)
*/
const LangToggle = ({ lang, setLang }) => (
    /* Contentor pill (cápsula) com fundo subtil */
    <div className="flex items-center gap-1 bg-surface-container rounded-full p-1">

      {/*
      .map() percorre o array ['es', 'pt'] e cria um botão para cada idioma.
      É a forma React de criar elementos repetidos sem escrever código duplicado.
      'key' é obrigatório quando se usa .map() — ajuda o React a identificar
      cada elemento de forma única para actualizações eficientes.
    */}
      {['es', 'pt'].map(l => (
          <button
              key={l}
              onClick={() => setLang(l)}  // Ao clicar, actualizar o idioma para este
              className={`lang-toggle px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-label ${
                  /*
                    Estilo condicional: se este botão representa o idioma activo,
                    aplicar classes de "activo" (fundo sólido, texto contrastante).
                    Caso contrário, aplicar estilo de "inactivo" (texto mais suave).
                  */
                  lang === l
                      ? 'bg-primary text-on-primary shadow-sm'   // Idioma activo
                      : 'text-on-surface-variant hover:text-on-surface' // Idioma inactivo
              }`}
          >
            {/* Emoji de bandeira + código do idioma */}
            {l === 'es' ? '🇨🇴 ES' : '🇧🇷 PT'}
          </button>
      ))}
    </div>
);


/*
  ─── COMPONENTE: Header ──────────────────────────────────────────────
  Barra de navegação fixa no topo da página.
  Sempre visível, independentemente do ecrã activo.

  Props:
    lang          — Idioma actual
    setLang       — Função para mudar idioma
    t             — Objecto com todos os textos traduzidos
    currentScreen — Qual o ecrã activo (para mostrar/esconder links de navegação)
*/
const Header = ({ lang, setLang, t, currentScreen }) => (
    <header
        className="bg-background sticky top-0 z-[100]"  // sticky: fica fixo ao fazer scroll
        style={{ borderBottom: '1px solid #f6eddb' }}    // Linha subtil na base do cabeçalho
    >
      {/* Contentor com largura máxima e margens automáticas para centrar */}
      <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-6xl mx-auto">

        {/* Logótipo / Nome da aplicação — texto estilizado como logótipo */}
        <div className="text-xl md:text-2xl font-black text-primary italic font-headline tracking-tight">
          {t.appName}  {/* "Vallenato Quiz" — vem do ficheiro i18n.js */}
        </div>

        {/* Lado direito do cabeçalho: toggle de idioma + navegação (só em ecrã grande) */}
        <div className="flex items-center gap-3">

          {/* Botão de troca de idioma (sempre visível) */}
          <LangToggle lang={lang} setLang={setLang} />

          {/*
          Navegação só aparece no ecrã inicial ('home') e apenas em écrans
          maiores (hidden md:flex = escondido em móvel, flexível em tablet+).
          No quiz activo, esta navegação não aparece para não distrair.
        */}
          {currentScreen === 'home' && (
              <nav className="hidden md:flex items-center gap-6 ml-2">
                {/* Link "Explorar" — activo (com linha por baixo) */}
                <a
                    className="text-primary border-b-2 border-primary font-label text-xs font-bold uppercase tracking-widest py-1"
                    href="#"
                >
                  {t.explore}
                </a>
                {/* Link "Jogar" — inactivo */}
                <a
                    className="text-on-surface-variant hover:text-primary transition-colors font-label text-xs font-bold uppercase tracking-widest py-1"
                    href="#"
                >
                  {t.play}
                </a>
              </nav>
          )}
        </div>
      </div>
    </header>
);


/*
  ─── COMPONENTE: BottomNav ───────────────────────────────────────────
  Barra de navegação inferior para telemóveis.
  Só aparece em écrans pequenos (md:hidden = escondida em tablet e desktop).
  É uma convenção comum em aplicações móveis (semelhante às apps nativas).

  Props:
    t      — Textos traduzidos
    screen — Ecrã actual ('home' ou outro) para destacar o item activo
*/
const BottomNav = ({ t, screen }) => (
    <nav
        className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-background rounded-t-3xl"
        style={{ boxShadow: '0 -8px 32px rgba(113,92,0,0.08)' }}  // Sombra para cima
    >
      {/*
      Array de objectos com os dados de cada item de navegação.
      .map() cria o JSX para cada item automaticamente.

      Cada item tem:
        icon   — Nome do ícone Material
        label  — Texto abaixo do ícone
        active — Boolean: true se este é o item activo
    */}
      {[
        { icon: 'explore', label: t.explore, active: screen === 'home' },
        { icon: 'quiz',    label: t.play,    active: screen !== 'home' },
        { icon: 'person',  label: t.profile, active: false },              // Perfil: sempre inactivo (funcionalidade futura)
      ].map(({ icon, label, active }) => (
          <a
              key={label}
              className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all ${
                  // Item activo: fundo amarelo claro. Item inactivo: cinzento
                  active ? 'bg-primary-fixed text-on-surface' : 'text-on-surface-variant'
              }`}
              href="#"
          >
            {/* Ícone — preenchido se activo, contorno se inactivo */}
            <Icon name={icon} fill={active} />

            {/* Etiqueta de texto abaixo do ícone */}
            <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">
          {label}
        </span>
          </a>
      ))}
    </nav>
);


/*
  ─── COMPONENTE: Footer ──────────────────────────────────────────────
  Rodapé da aplicação. Aparece no ecrã inicial e no ecrã de resultados.

  Props:
    t — Textos traduzidos (copyright, links legais, etc.)
*/
const Footer = ({ t }) => (
    <footer className="bg-surface-container w-full py-10 px-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">

      {/* Bloco esquerdo: nome da app + copyright */}
      <div className="flex flex-col items-center md:items-start gap-2">
        <div className="font-headline font-bold text-lg text-primary">{t.appName}</div>
        <p className="font-body text-sm text-on-surface-variant text-center md:text-left">
          {t.copyright}  {/* Ex: "© 2024 El Moderno Vallenato. Hecho con orgullo colombiano." */}
        </p>
      </div>

      {/* Links legais: Privacidade, Termos, Contacto */}
      <div className="flex gap-6">
        {/*
        [t.privacy, t.terms, t.contact] é um array com os três textos.
        .map() cria um link para cada um, usando o próprio texto como 'key'.
      */}
        {[t.privacy, t.terms, t.contact].map(l => (
            <a
                key={l}
                className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
            >
              {l}
            </a>
        ))}
      </div>
    </footer>
);