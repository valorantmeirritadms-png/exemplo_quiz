/* ─── Quiz Questions ──────────────────────────────────────────────── */
const questions = [
  {
    category: { es: "Símbolos Patrios", pt: "Símbolos Pátrios" },
    q: {
      es: "¿Cuál es el ave nacional de Colombia?",
      pt: "Qual é a ave nacional da Colômbia?"
    },
    options: {
      es: ["Cóndor de los Andes", "Colibrí", "Turpial", "Águila Real"],
      pt: ["Condor dos Andes", "Beija-flor", "Turpial", "Águia Real"]
    },
    answer: 0,
    fact: {
      es: "El Cóndor de los Andes es una de las aves voladoras más grandes del mundo, con una envergadura de hasta 3,2 metros.",
      pt: "O Condor dos Andes é uma das maiores aves voadoras do mundo, com envergadura de até 3,2 metros."
    },
    icon: "emoji_nature"
  },
  {
    category: { es: "Geografía", pt: "Geografia" },
    q: {
      es: "¿Cuál es la capital de Colombia?",
      pt: "Qual é a capital da Colômbia?"
    },
    options: {
      es: ["Medellín", "Cali", "Bogotá", "Barranquilla"],
      pt: ["Medellín", "Cali", "Bogotá", "Barranquilla"]
    },
    answer: 2,
    fact: {
      es: "Bogotá, conocida como la 'Atenas Suramericana', se ubica a 2.625 metros sobre el nivel del mar y es una de las capitales más altas del mundo.",
      pt: "Bogotá, conhecida como a 'Atenas Sul-Americana', fica a 2.625 metros acima do nível do mar e é uma das capitais mais altas do mundo."
    },
    icon: "location_city"
  },
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
    answer: 2,
    fact: {
      es: "En 2016, la UNESCO declaró el vallenato como Patrimonio Cultural Inmaterial de la Humanidad, reconociendo su profundo arraigo en la identidad colombiana.",
      pt: "Em 2016, a UNESCO declarou o vallenato como Patrimônio Cultural Imaterial da Humanidade, reconhecendo seu profundo enraizamento na identidade colombiana."
    },
    icon: "music_note"
  },
  {
    category: { es: "Naturaleza", pt: "Natureza" },
    q: {
      es: "Colombia es el país con mayor diversidad de ¿qué animal en el mundo?",
      pt: "A Colômbia é o país com maior diversidade de qual animal no mundo?"
    },
    options: {
      es: ["Mariposas", "Aves", "Ranas", "Orquídeas"],
      pt: ["Borboletas", "Aves", "Rãs", "Orquídeas"]
    },
    answer: 1,
    fact: {
      es: "Colombia alberga más de 1.900 especies de aves, siendo el país con mayor diversidad aviar del planeta. ¡Casi el 20% de todas las especies del mundo!",
      pt: "A Colômbia abriga mais de 1.900 espécies de aves, sendo o país com maior diversidade aviar do planeta. Quase 20% de todas as espécies do mundo!"
    },
    icon: "flutter_dash"
  },
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
    answer: 2,
    fact: {
      es: "Simón Bolívar, el 'Libertador', fue clave en la independencia de Colombia, Venezuela, Ecuador, Perú y Bolivia, soñando con la Gran Colombia.",
      pt: "Simón Bolívar, o 'Libertador', foi fundamental na independência da Colômbia, Venezuela, Equador, Peru e Bolívia, sonhando com a Gran Colombia."
    },
    icon: "history_edu"
  },
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
    answer: 1,
    fact: {
      es: "La Bandeja Paisa es el plato más emblemático de Antioquia. Incluye frijoles, chicharrón, chorizo, huevo frito, arroz, aguacate y arepa, ¡todo en un solo plato!",
      pt: "A Bandeja Paisa é o prato mais emblemático de Antioquia. Inclui feijão, torresmo, linguiça, ovo frito, arroz, abacate e arepa, tudo em um único prato!"
    },
    icon: "restaurant"
  },
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
    answer: 2,
    fact: {
      es: "Gabriel García Márquez, autor de 'Cien años de soledad', recibió el Nobel de Literatura en 1982 y es uno de los escritores más importantes del mundo.",
      pt: "Gabriel García Márquez, autor de 'Cem Anos de Solidão', recebeu o Nobel de Literatura em 1982 e é um dos escritores mais importantes do mundo."
    },
    icon: "menu_book"
  },
  {
    category: { es: "Geografía", pt: "Geografia" },
    q: {
      es: "¿Cuántos océanos bordean el territorio colombiano?",
      pt: "Quantos oceanos banham o território colombiano?"
    },
    options: {
      es: ["Ninguno", "Uno", "Dos", "Tres"],
      pt: ["Nenhum", "Um", "Dois", "Três"]
    },
    answer: 2,
    fact: {
      es: "Colombia es el único país de América del Sur que tiene costas tanto en el Océano Pacífico como en el Mar Caribe (Atlántico), una ventaja geográfica única.",
      pt: "A Colômbia é o único país da América do Sul com costas tanto no Oceano Pacífico quanto no Mar do Caribe (Atlântico), uma vantagem geográfica única."
    },
    icon: "water"
  },
  {
    category: { es: "Flores", pt: "Flores" },
    q: {
      es: "¿Cuál es la flor nacional de Colombia?",
      pt: "Qual é a flor nacional da Colômbia?"
    },
    options: {
      es: ["Rosa", "Orquídea Cattleya Trianae", "Girasol", "Heliconias"],
      pt: ["Rosa", "Orquídea Cattleya Trianae", "Girassol", "Helicônias"]
    },
    answer: 1,
    fact: {
      es: "La Orquídea Cattleya trianae, conocida como 'La Flor de Mayo' o 'Christmas Orchid', es la flor nacional de Colombia y símbolo de biodiversidad.",
      pt: "A Orquídea Cattleya trianae, conhecida como 'A Flor de Maio' ou 'Christmas Orchid', é a flor nacional da Colômbia e símbolo de biodiversidade."
    },
    icon: "local_florist"
  },
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
    answer: 1,
    fact: {
      es: "El Eje Cafetero (Caldas, Risaralda y Quindío) fue declarado Patrimonio Cultural de la Humanidad por la UNESCO en 2011. El café colombiano es famoso mundialmente por su suavidad.",
      pt: "O Eixo Cafeeiro (Caldas, Risaralda e Quindío) foi declarado Patrimônio Cultural da Humanidade pela UNESCO em 2011. O café colombiano é famoso mundialmente pela sua suavidade."
    },
    icon: "coffee"
  }
];
