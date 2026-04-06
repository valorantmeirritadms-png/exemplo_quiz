/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║             js/tailwind.config.js                               ║
  ║       Configuração Personalizada do Tailwind CSS                ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  O Tailwind CSS é uma biblioteca de classes utilitárias.        ║
  ║  Este ficheiro ESTENDE o Tailwind com cores, fontes e bordas    ║
  ║  específicas deste projecto.                                    ║
  ║                                                                 ║
  ║  Após esta configuração, classes como "bg-primary" ou           ║
  ║  "text-secondary" ficam disponíveis em todo o projecto,         ║
  ║  apontando para as cores aqui definidas.                        ║
  ║                                                                 ║
  ║  O sistema de cores segue o padrão Material Design 3 (M3)       ║
  ║  do Google, com cores inspiradas na bandeira da Colômbia:       ║
  ║    • Amarelo/Dourado (#715c00, #fcd116, #ffe17b)                ║
  ║    • Azul (#335ab4, #7da0ff)                                    ║
  ║    • Vermelho (#c0001f)                                         ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

/*
  'tailwind.config' é uma variável global que o script do Tailwind
  (carregado no index.html) detecta automaticamente para aplicar
  a configuração personalizada.
*/
tailwind.config = {

  /*
    darkMode: "class" — O modo escuro é activado adicionando a classe
    "dark" ao elemento <html>. Actualmente não está implementado,
    mas esta configuração prepara o projecto para tal funcionalidade.
  */
  darkMode: "class",

  theme: {
    /*
      'extend' adiciona novas definições às existentes no Tailwind,
      sem substituir as classes padrão.
      Se usássemos apenas 'colors:' (sem extend), substituiríamos
      TODAS as cores do Tailwind pelas nossas.
    */
    extend: {

      /*
        ── PALETA DE CORES ─────────────────────────────────────────
        Cada par chave:valor define uma nova classe de cor.

        Nomenclatura do Material Design 3:
          primary         — Cor principal da marca (ações primárias)
          secondary       — Cor de suporte (elementos secundários)
          tertiary        — Cor de acento (elementos terciários, erros)
          surface         — Cor de superfície (fundos de cartões)
          background      — Cor de fundo da página
          on-X            — Cor do texto que fica "sobre" X
                            Ex: "on-primary" = cor do texto em cima de "primary"

        Variantes de superfície (do mais claro ao mais escuro):
          surface-container-lowest  → branco puro (#ffffff)
          surface-container-low     → muito claro
          surface-container         → claro
          surface-container-high    → médio
          surface-container-highest → mais escuro

        Uso prático:
          <div class="bg-primary text-on-primary">
            → fundo dourado escuro com texto branco
          </div>
      */
      colors: {
        /* ── Cores de Contentor ── */
        "primary-container":          "#fcd116",  // Amarelo vivo colombiano
        "secondary-container":        "#7da0ff",  // Azul claro
        "tertiary-container":         "#ffc8c4",  // Rosa claro (usado em erros)
        "primary-fixed":              "#ffe17b",  // Amarelo muito claro
        "primary-fixed-dim":          "#ecc300",  // Amarelo médio
        "tertiary-fixed":             "#ffdad7",  // Rosa muito claro
        "tertiary-fixed-dim":         "#ffb3ae",  // Rosa médio

        /* ── Cores Principais ── */
        "primary":                    "#715c00",  // Dourado escuro — cor principal da marca
        "secondary":                  "#335ab4",  // Azul colombiano — cor secundária
        "tertiary":                   "#c0001f",  // Vermelho colombiano — cor terciária
        "error":                      "#ba1a1a",  // Vermelho de erro

        /* ── Inversas ── */
        "inverse-primary":            "#ecc300",
        "inverse-surface":            "#343024",

        /* ── Superfícies (fundos de camadas) ── */
        "background":                 "#fff8ef",  // Fundo da página inteira (creme muito claro)
        "surface":                    "#fff8ef",  // Superfície base (igual ao fundo)
        "surface-bright":             "#fff8ef",
        "surface-dim":                "#e2d9c8",  // Superfície escurecida

        /* Variantes do contentor de superfície (do mais claro ao mais escuro) */
        "surface-container-lowest":   "#ffffff",  // Branco puro (cartões em destaque)
        "surface-container-low":      "#fcf3e1",  // Quase branco, toque creme
        "surface-container":          "#f6eddb",  // Creme claro
        "surface-container-high":     "#f0e7d5",  // Creme médio
        "surface-container-highest":  "#eae2d0",  // Creme escuro (bordas, divisores)

        "surface-variant":            "#eae2d0",
        "surface-tint":               "#715c00",

        /* ── Cores de Texto "on-X" (texto sobre cada cor de fundo) ── */
        "on-background":              "#1f1b11",  // Texto sobre o fundo da página (castanho muito escuro)
        "on-surface":                 "#1f1b11",  // Texto sobre superfícies
        "on-surface-variant":         "#4d4632",  // Texto secundário, menos contrastante
        "on-primary":                 "#ffffff",  // Texto branco sobre primary dourado escuro
        "on-secondary":               "#ffffff",  // Texto branco sobre secondary azul
        "on-tertiary":                "#ffffff",  // Texto branco sobre tertiary vermelho
        "on-primary-container":       "#6e5a00",  // Texto escuro sobre primary-container amarelo
        "on-secondary-container":     "#003387",  // Texto azul escuro sobre secondary-container
        "on-tertiary-container":      "#bb001e",  // Texto vermelho sobre tertiary-container rosa
        "on-error-container":         "#93000a",  // Texto de erro escuro

        /* ── Linhas e Contornos ── */
        "outline":                    "#7f7760",  // Cor das bordas normais
        "outline-variant":            "#d0c6ab",  // Cor das bordas subtis
      },

      /*
        ── FAMÍLIAS DE FONTES ─────────────────────────────────────
        Define três "papéis" de fonte, cada um com uma família tipográfica:
          font-headline — Plus Jakarta Sans: títulos e cabeçalhos (impacto visual)
          font-body     — Be Vietnam Pro: texto corrido (legibilidade)
          font-label    — Be Vietnam Pro: etiquetas, botões, navegação

        Uso: <h1 class="font-headline"> ou <p class="font-body">
      */
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "sans-serif"],  // Títulos expressivos
        "body":     ["Be Vietnam Pro",    "sans-serif"],  // Texto de leitura
        "label":    ["Be Vietnam Pro",    "sans-serif"],  // Etiquetas e UI
      },

      /*
        ── RAIOS DE BORDA ──────────────────────────────────────────
        Define o arredondamento padrão das bordas.
        O Tailwind usa estes valores nas classes como rounded-lg, rounded-xl.

        Estes valores sobrescrevem os padrão do Tailwind.
        Nota: "full" (9999px) cria bordas completamente redondas (pílulas/círculos).
      */
      borderRadius: {
        "DEFAULT": "0.25rem",   // rounded — ligeiramente arredondado (4px)
        "lg":      "0.5rem",    // rounded-lg — médio (8px)
        "xl":      "0.75rem",   // rounded-xl — generoso (12px)
        "full":    "9999px",    // rounded-full — completamente redondo (botões pílula)
      },
    },
  },
};
