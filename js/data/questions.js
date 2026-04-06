/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║                js/data/questions.js                             ║
  ║          Base de Dados das Perguntas do Quiz                    ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Contém o array 'questions' com todas as perguntas do quiz.     ║
  ║                                                                 ║
  ║  Cada pergunta é um objecto com a seguinte estrutura:           ║
  ║                                                                 ║
  ║  {                                                              ║
  ║    category: { es: "...", pt: "..." }  Nome da categoria        ║
  ║    q:        { es: "...", pt: "..." }  Texto da pergunta        ║
  ║    options:  { es: [...], pt: [...] }  Array com 4 opções       ║
  ║    answer:   número (0, 1, 2 ou 3)    Índice da opção correcta  ║
  ║    fact:     { es: "...", pt: "..." }  Facto curioso            ║
  ║    icon:     "nome_do_icone"           Ícone Material Symbols   ║
  ║  }                                                              ║
  ║                                                                 ║
  ║  Para adicionar perguntas: copiar um bloco existente,           ║
  ║  alterar os valores e adicionar ao array.                       ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

/*
  'const questions' define uma constante global.
  É um array (lista) de objectos, onde cada objecto = uma pergunta.
  Os colchetes [] definem o array.
  As chaves {} definem cada objecto dentro do array.
*/
const questions = [

  /* ─── Pergunta 1 ─────────────────────────────────────────────────── */
  {
    /* Categoria mostrada acima da pergunta no QuestionScreen */
    category: { es: "Símbolos Patrios", pt: "Símbolos Pátrios" },

    /* Texto completo da pergunta nos dois idiomas */
    q: {
      es: "¿Cuál es el ave nacional de Colombia?",
      pt: "Qual é a ave nacional da Colômbia?"
    },

    /* As 4 opções de resposta (índices 0, 1, 2 e 3 = A, B, C e D) */
    options: {
      es: ["Cóndor de los Andes", "Colibrí", "Turpial", "Águila Real"],
      pt: ["Condor dos Andes",    "Beija-flor", "Turpial", "Águia Real"]
    },

    /* Índice da opção correcta: 0 = "Cóndor de los Andes" / "Condor dos Andes" */
    answer: 0,

    /* Facto curioso mostrado no ecrã de feedback */
    fact: {
      es: "El Cóndor de los Andes es una de las aves voladoras más grandes del mundo, con una envergadura de hasta 3,2 metros.",
      pt: "O Condor dos Andes é uma das maiores aves voadoras do mundo, com envergadura de até 3,2 metros."
    },

    /* Nome do ícone Material Symbols para decoração no cartão da pergunta */
    icon: "emoji_nature"
  },

  /* ─── Pergunta 2 ─────────────────────────────────────────────────── */
  {
    category: { es: "Geografía",  pt: "Geografia" },
    q: {
      es: "¿Cuál es la capital de Colombia?",
      pt: "Qual é a capital da Colômbia?"
    },
    options: {
      es: ["Medellín", "Cali", "Bogotá", "Barranquilla"],
      pt: ["Medellín", "Cali", "Bogotá", "Barranquilla"]
    },
    answer: 2,  /* Bogotá é a opção de índice 2 (C) */
    fact: {
      es: "Bogotá, conocida como la 'Atenas Suramericana', se ubica a 2.625 metros sobre el nivel del mar y es una de las capitales más altas del mundo.",
      pt: "Bogotá, conhecida como a 'Atenas Sul-Americana', fica a 2.625 metros acima do nível do mar e é uma das capitais mais altas do mundo."
    },
    icon: "location_city"
  },

  /* ─── Pergunta 3 ─────────────────────────────────────────────────── */
  {
    category: { es: "Música", pt: "Música" },
    q: {
      es: "¿En qué año fue declarado el Vallenato Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO?",
      pt: "Em que ano o Vallenato foi declarado Patrimônio Cultural Imaterial da Humanidade pela UNESCO?"
    },
    options: {
      es: ["2010", "2013", "2016", "2019"],
      pt: ["2010", "2013", "2016", "2019"]
    },
    answer: 2,  /* 2016 é a opção de índice 2 (C) */
    fact: {
      es: "En 2016, la UNESCO declaró el vallenato como Patrimonio Cultural Inmaterial de la Humanidad, reconociendo su profundo arraigo en la identidad colombiana.",
      pt: "Em 2016, a UNESCO declarou o vallenato como Patrimônio Cultural Imaterial da Humanidade, reconhecendo seu profundo enraizamento na identidade colombiana."
    },
    icon: "music_note"
  },

  /* ─── Pergunta 4 ─────────────────────────────────────────────────── */
  {
    category: { es: "Naturaleza", pt: "Natureza" },
    q: {
      es: "Colombia es el país con mayor diversidad de ¿qué animal en el mundo?",
      pt: "A Colômbia é o país com maior diversidade de qual animal no mundo?"
    },
    options: {
      es: ["Mariposas", "Aves",        "Ranas",  "Orquídeas"],
      pt: ["Borboletas", "Aves",       "Rãs",    "Orquídeas"]
    },
    answer: 1,  /* Aves é a opção de índice 1 (B) */
    fact: {
      es: "Colombia alberga más de 1.900 especies de aves, siendo el país con mayor diversidad aviar del planeta. ¡Casi el 20% de todas las especies del mundo!",
      pt: "A Colômbia abriga mais de 1.900 espécies de aves, sendo o país com maior diversidade aviar do planeta. Quase 20% de todas as espécies do mundo!"
    },
    icon: "flutter_dash"
  },

  /* ─── Pergunta 5 ─────────────────────────────────────────────────── */
  {
    category: { es: "Historia", pt: "História" },
    q: {
      es: "¿Quién fue el libertador que independizó a Colombia?",
      pt: "Quem foi o libertador que independizou a Colômbia?"
    },
    options: {
      es: ["Antonio Nariño", "Francisco de Paula Santander", "Simón Bolívar", "Rafael Núñez"],
      pt: ["Antonio Nariño", "Francisco de Paula Santander", "Simón Bolívar", "Rafael Núñez"]
    },
    answer: 2,  /* Simón Bolívar é a opção de índice 2 (C) */
    fact: {
      es: "Simón Bolívar, el 'Libertador', fue clave en la independencia de Colombia, Venezuela, Ecuador, Perú y Bolivia, soñando con la Gran Colombia.",
      pt: "Simón Bolívar, o 'Libertador', foi fundamental na independência da Colômbia, Venezuela, Equador, Peru e Bolívia, sonhando com a Gran Colombia."
    },
    icon: "history_edu"
  },

  /* ─── Pergunta 6 ─────────────────────────────────────────────────── */
  {
    category: { es: "Gastronomía", pt: "Gastronomia" },
    q: {
      es: "¿Cuál es el plato típico de la región paisa en Colombia?",
      pt: "Qual é o prato típico da região paisa na Colômbia?"
    },
    options: {
      es: ["Ajiaco", "Bandeja Paisa", "Sancocho", "Lechona"],
      pt: ["Ajiaco", "Bandeja Paisa", "Sancocho", "Lechona"]
    },
    answer: 1,  /* Bandeja Paisa é a opção de índice 1 (B) */
    fact: {
      es: "La Bandeja Paisa es el plato más emblemático de Antioquia. Incluye frijoles, chicharrón, chorizo, huevo frito, arroz, aguacate y arepa, ¡todo en un solo plato!",
      pt: "A Bandeja Paisa é o prato mais emblemático de Antioquia. Inclui feijão, torresmo, linguiça, ovo frito, arroz, abacate e arepa, tudo em um único prato!"
    },
    icon: "restaurant"
  },

  /* ─── Pergunta 7 ─────────────────────────────────────────────────── */
  {
    category: { es: "Literatura", pt: "Literatura" },
    q: {
      es: "¿Qué escritor colombiano ganó el Premio Nobel de Literatura en 1982?",
      pt: "Qual escritor colombiano ganhou o Prêmio Nobel de Literatura em 1982?"
    },
    options: {
      es: ["Tomás González", "Álvaro Mutis", "Gabriel García Márquez", "Héctor Abad Faciolince"],
      pt: ["Tomás González", "Álvaro Mutis", "Gabriel García Márquez", "Héctor Abad Faciolince"]
    },
    answer: 2,  /* Gabriel García Márquez é a opção de índice 2 (C) */
    fact: {
      es: "Gabriel García Márquez, autor de 'Cien años de soledad', recibió el Nobel de Literatura en 1982 y es uno de los escritores más importantes del mundo.",
      pt: "Gabriel García Márquez, autor de 'Cem Anos de Solidão', recebeu o Nobel de Literatura em 1982 e é um dos escritores mais importantes do mundo."
    },
    icon: "menu_book"
  },

  /* ─── Pergunta 8 ─────────────────────────────────────────────────── */
  {
    category: { es: "Geografía", pt: "Geografia" },
    q: {
      es: "¿Cuántos océanos bordean el territorio colombiano?",
      pt: "Quantos oceanos banham o território colombiano?"
    },
    options: {
      es: ["Ninguno", "Uno", "Dos",  "Tres"],
      pt: ["Nenhum",  "Um",  "Dois", "Três"]
    },
    answer: 2,  /* Dois é a opção de índice 2 (C) — Pacífico e Atlântico */
    fact: {
      es: "Colombia es el único país de América del Sur que tiene costas tanto en el Océano Pacífico como en el Mar Caribe (Atlántico), una ventaja geográfica única.",
      pt: "A Colômbia é o único país da América do Sul com costas tanto no Oceano Pacífico quanto no Mar do Caribe (Atlântico), uma vantagem geográfica única."
    },
    icon: "water"
  },

  /* ─── Pergunta 9 ─────────────────────────────────────────────────── */
  {
    category: { es: "Flores", pt: "Flores" },
    q: {
      es: "¿Cuál es la flor nacional de Colombia?",
      pt: "Qual é a flor nacional da Colômbia?"
    },
    options: {
      es: ["Rosa", "Orquídea Cattleya Trianae", "Girasol",   "Heliconias"],
      pt: ["Rosa", "Orquídea Cattleya Trianae", "Girassol",  "Helicônias"]
    },
    answer: 1,  /* Orquídea Cattleya Trianae é a opção de índice 1 (B) */
    fact: {
      es: "La Orquídea Cattleya trianae, conocida como 'La Flor de Mayo' o 'Christmas Orchid', es la flor nacional de Colombia y símbolo de biodiversidad.",
      pt: "A Orquídea Cattleya trianae, conhecida como 'A Flor de Maio' ou 'Christmas Orchid', é a flor nacional da Colômbia e símbolo de biodiversidade."
    },
    icon: "local_florist"
  },

  /* ─── Pergunta 10 ────────────────────────────────────────────────── */
  {
    category: { es: "Café", pt: "Café" },
    q: {
      es: "¿En qué región de Colombia se concentra la mayor producción de café de alta calidad?",
      pt: "Em qual região da Colômbia se concentra a maior produção de café de alta qualidade?"
    },
    options: {
      es: ["Llanos Orientales", "Eje Cafetero", "Costa Caribe", "Amazonas"],
      pt: ["Llanos Orientales", "Eixo Cafeeiro", "Costa Caribe", "Amazônia"]
    },
    answer: 1,  /* Eje Cafetero / Eixo Cafeeiro é a opção de índice 1 (B) */
    fact: {
      es: "El Eje Cafetero (Caldas, Risaralda y Quindío) fue declarado Patrimonio Cultural de la Humanidad por la UNESCO en 2011. El café colombiano es famoso mundialmente por su suavidad.",
      pt: "O Eixo Cafeeiro (Caldas, Risaralda e Quindío) foi declarado Patrimônio Cultural da Humanidade pela UNESCO em 2011. O café colombiano é famoso mundialmente pela sua suavidade."
    },
    icon: "coffee"
  }

  /*
    ─── COMO ADICIONAR MAIS PERGUNTAS ──────────────────────────────
    Copie e cole o bloco abaixo, preenchendo os valores:

  ,{
    category: { es: "Categoria em ES", pt: "Categoria em PT" },
    q: {
      es: "A pergunta em espanhol?",
      pt: "A pergunta em português?"
    },
    options: {
      es: ["Opção A em ES", "Opção B em ES", "Opção C em ES", "Opção D em ES"],
      pt: ["Opção A em PT", "Opção B em PT", "Opção C em PT", "Opção D em PT"]
    },
    answer: 0,  // Índice da resposta correcta (0=A, 1=B, 2=C, 3=D)
    fact: {
      es: "Facto curioso em espanhol.",
      pt: "Facto curioso em português."
    },
    icon: "nome_do_icone"  // Ver lista em: fonts.google.com/icons
  }
  */

]; /* Fim do array de perguntas */