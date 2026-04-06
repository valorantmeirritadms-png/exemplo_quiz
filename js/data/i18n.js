/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║                  js/data/i18n.js                                ║
  ║       Internacionalização — Textos em Dois Idiomas              ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  "i18n" é a abreviatura de "internationalisation" (i + 18       ║
  ║  letras + n). É a prática de preparar uma aplicação para        ║
  ║  suportar múltiplos idiomas.                                    ║
  ║                                                                 ║
  ║  Este ficheiro define um objecto com TODOS os textos visíveis   ║
  ║  na interface, organizados por idioma:                          ║
  ║    i18n.es → todos os textos em Espanhol                        ║
  ║    i18n.pt → todos os textos em Português (do Brasil)           ║
  ║                                                                 ║
  ║  Como funciona na prática:                                      ║
  ║    No App.js: const t = i18n[lang];                             ║
  ║    Nos componentes: {t.start} → "Empezar" ou "Começar"          ║
  ║    dependendo de 'lang' ('es' ou 'pt').                         ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

/*
  O objecto i18n tem dois sub-objectos, um por idioma.
  Cada chave (ex: 'appName', 'start') corresponde a um texto
  que aparece algures na interface.
  As chaves são IGUAIS em ambos os idiomas — só os valores mudam.
*/
const i18n = {

  /* ─── Textos em Espanhol ─────────────────────────────────────────── */
  es: {
    appName:         "Vallenato Quiz",            // Nome da aplicação (igual em ambos os idiomas)
    tagline:         "Edición Especial",           // Pequena etiqueta no banner principal
    heroTitle1:      "Quiz:",                      // Primeira linha do título principal
    heroTitle2:      "Orgullo",                    // Segunda linha (em dourado e itálico)
    heroTitle3:      "Colombiano",                 // Terceira linha (em vermelho)
    heroDesc:        "Descubre la magia de nuestra tierra. Un viaje por los ritmos del acordeón, el aroma del café y la biodiversidad que nos hace únicos.",
    start:           "Empezar",                   // Botão principal do HomeScreen
    ranking:         "Ver Ranking",               // Botão secundário do HomeScreen
    categories:      "Categorías Populares",      // Título da secção de categorias
    seeAll:          "Ver todas",                 // Link "Ver todas" as categorias

    /* Cartão de Categoria 1 — Biodiversidade */
    cat1Name:        "Biodiversidad",
    cat1Desc:        "Desde las cumbres de los Andes hasta las profundidades del Amazonas.",
    cat1Count:       "15 Preguntas",

    /* Cartão de Categoria 2 — Música e Arte */
    cat2Name:        "Música y Arte",
    cat2Desc:        "El vallenato, la cumbia y los maestros que pintaron nuestra historia.",
    cat2Count:       "20 Preguntas",

    /* Cartão de Categoria 3 — História */
    cat3Name:        "Historia",
    cat3Desc:        "Los hitos que forjaron la identidad de la nación más acogedora.",
    cat3Count:       "12 Preguntas",

    recordLabel:     "Récord Actual",             // Etiqueta da pílula flutuante no HomeScreen

    /* Rodapé */
    copyright:       "© 2024 El Moderno Vallenato. Hecho con orgullo colombiano.",
    privacy:         "Privacidad",
    terms:           "Términos",
    contact:         "Contacto",

    /* Navegação (cabeçalho e BottomNav) */
    explore:         "Explorar",
    play:            "Jugar",
    profile:         "Perfil",

    /* Ecrã de perguntas */
    question:        "Pregunta",                  // "Pregunta 3 de 10"
    of:              "de",                         // "de" em "Pregunta X de Y"
    prev:            "Anterior",                  // Botão voltar
    next:            "Siguiente Pregunta",         // Botão avançar

    /* Ecrã de feedback */
    correct:         "¡Correcto!",                // Quando acerta
    incorrect:       "¡Incorrecto!",              // Quando erra
    correctAnswer:   "La respuesta correcta era:", // Texto antes da resposta correcta
    nextQuestion:    "Siguiente Pregunta",         // Botão no ecrã de feedback
    knowledgeTitle:  "Conocimiento de Altura",     // Título grande quando acerta
    almostTitle:     "¡Casi!",                     // Título grande quando erra
    funFact:         "Dato Curioso",               // Etiqueta do cartão informativo

    /* Ecrã de resultados */
    finalResult:     "Resultado Final",
    playAgain:       "Volver a jugar",
    shareScore:      "Compartir mi puntaje",
    streak:          "Racha Ganadora",             // Maior sequência de acertos
    streakSuffix:    "Preguntas seguidas",          // "3 Preguntas seguidas"
    totalTime:       "Tiempo Total",

    /* Níveis de desempenho (baseados na percentagem de acertos) */
    expertLabel:     "¡Eres un experto en Colombia!",  // ≥ 80%
    goodLabel:       "¡Muy buen resultado!",            // ≥ 50%
    okLabel:         "Sigue aprendiendo.",              // < 50%
    levelLegend:     "¡Nivel Leyenda!",                // Etiqueta do nível ≥ 80%
    levelPro:        "¡Nivel Pro!",                    // Etiqueta do nível ≥ 50%
    levelStudent:    "Nivel Aprendiz",                 // Etiqueta do nível < 50%

    catLabel:        "Símbolos Patrios",               // Etiqueta de categoria (não usado actualmente)
    chooseCategory:  "Elige una categoría para comenzar", // Instrução (não usado actualmente)
  },

  /* ─── Textos em Português ────────────────────────────────────────── */
  pt: {
    appName:         "Vallenato Quiz",            // Mesmo nome em português
    tagline:         "Edição Especial",
    heroTitle1:      "Quiz:",
    heroTitle2:      "Orgulho",
    heroTitle3:      "Colombiano",
    heroDesc:        "Descubra a magia da nossa terra. Uma viagem pelos ritmos do acordeão, o aroma do café e a biodiversidade que nos torna únicos.",
    start:           "Começar",
    ranking:         "Ver Ranking",
    categories:      "Categorias Populares",
    seeAll:          "Ver todas",

    cat1Name:        "Biodiversidade",
    cat1Desc:        "Dos picos dos Andes até as profundezas da Amazônia.",
    cat1Count:       "15 Perguntas",

    cat2Name:        "Música e Arte",
    cat2Desc:        "O vallenato, a cumbia e os mestres que pintaram nossa história.",
    cat2Count:       "20 Perguntas",

    cat3Name:        "História",
    cat3Desc:        "Os marcos que forjaram a identidade da nação mais acolhedora.",
    cat3Count:       "12 Perguntas",

    recordLabel:     "Recorde Atual",

    copyright:       "© 2024 O Moderno Vallenato. Feito com orgulho colombiano.",
    privacy:         "Privacidade",
    terms:           "Termos",
    contact:         "Contato",

    explore:         "Explorar",
    play:            "Jogar",
    profile:         "Perfil",

    question:        "Pergunta",
    of:              "de",
    prev:            "Anterior",
    next:            "Próxima Pergunta",

    correct:         "Correto!",
    incorrect:       "Incorreto!",
    correctAnswer:   "A resposta correta era:",
    nextQuestion:    "Próxima Pergunta",
    knowledgeTitle:  "Conhecimento de Altitude",
    almostTitle:     "Quase!",
    funFact:         "Curiosidade",

    finalResult:     "Resultado Final",
    playAgain:       "Jogar novamente",
    shareScore:      "Compartilhar pontuação",
    streak:          "Sequência Vencedora",
    streakSuffix:    "Perguntas seguidas",
    totalTime:       "Tempo Total",

    expertLabel:     "Você é um especialista em Colômbia!",
    goodLabel:       "Muito bom resultado!",
    okLabel:         "Continue aprendendo.",
    levelLegend:     "Nível Lenda!",
    levelPro:        "Nível Pro!",
    levelStudent:    "Nível Aprendiz",

    catLabel:        "Símbolos Pátrios",
    chooseCategory:  "Escolha uma categoria para começar",
  },
};