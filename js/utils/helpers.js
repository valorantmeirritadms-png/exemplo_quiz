/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║               js/utils/helpers.js                               ║
  ║         Funções Auxiliares e Constantes Globais                 ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Este ficheiro é carregado antes de todos os componentes.       ║
  ║  Contém:                                                        ║
  ║    • formatTime()    — Formata segundos em "MM:SS"              ║
  ║    • LETTERS         — Array com as letras A, B, C, D           ║
  ║    • IMAGES          — URLs das imagens usadas na aplicação     ║
  ║    • QUESTION_TIME   — Duração do temporizador por pergunta     ║
  ╚══════════════════════════════════════════════════════════════════╝
*/


/*
  ─── FUNÇÃO: formatTime ──────────────────────────────────────────────
  Converte um número de segundos no formato de texto "MM:SS"
  (minutos:segundos) para mostrar no relógio do quiz.

  Exemplos:
    formatTime(0)   → "00:00"
    formatTime(5)   → "00:05"
    formatTime(60)  → "01:00"
    formatTime(75)  → "01:15"
    formatTime(3661)→ "61:01" (não limita horas)

  @param {number} s - O total de segundos a formatar
  @returns {string} - Texto no formato "MM:SS"
*/
const formatTime = (s) =>
    /*
      Esta é uma arrow function de uma linha (sem chaves {}).
      O template literal (crase `) permite inserir expressões ${...} no texto.

      Math.floor(s / 60) — Calcula os minutos (parte inteira da divisão por 60).
        Ex: 75 / 60 = 1.25 → Math.floor(1.25) = 1 minuto

      s % 60 — Calcula os segundos restantes (resto da divisão por 60).
        Ex: 75 % 60 = 15 segundos

      .padStart(2, '0') — Garante que o número tem sempre 2 dígitos,
        adicionando um zero à esquerda se necessário.
        Ex: String(5).padStart(2, '0') → "05"
            String(12).padStart(2, '0') → "12" (já tem 2 dígitos, não altera)

      String(...) — Converte o número para texto antes de usar .padStart().
    */
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;


/*
  ─── CONSTANTE: LETTERS ──────────────────────────────────────────────
  Array com as quatro letras usadas como identificadores das opções
  de resposta (A, B, C, D).

  Usado em QuestionScreen.js para mostrar a letra antes de cada opção:
    LETTERS[0] → 'A'
    LETTERS[1] → 'B'
    LETTERS[2] → 'C'
    LETTERS[3] → 'D'
*/
const LETTERS = ['A', 'B', 'C', 'D'];


/*
  ─── CONSTANTE: IMAGES ───────────────────────────────────────────────
  Objecto com os URLs das imagens usadas em diferentes ecrãs.
  Usar um objecto central facilita a manutenção: se o URL mudar,
  só é necessário alterar aqui, e não em cada componente que usa a imagem.

  Todas as imagens são do Unsplash (banco de imagens gratuito).
  Os parâmetros no URL:
    w=800   → largura máxima em píxeis (reduz o tamanho do ficheiro)
    q=80    → qualidade JPEG (80% — boa qualidade, ficheiro mais pequeno)

  Uso:
    hero:        Paisagem colombiana — usada no ecrã inicial e FeedbackScreen (quando errou)
    coffee:      Xícara de café     — usada no bento grid do HomeScreen
    condor:      Cóndor dos Andes   — usada no FeedbackScreen (quando acertou)
    celebration: Celebração         — usada no ResultsScreen
    orchid:      Orquídea           — usada no bento grid do HomeScreen
*/
const IMAGES = {
  hero:        "https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=800&q=80",
  coffee:      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  condor:      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&q=80",
  celebration: "https://images.unsplash.com/photo-1567942712661-82b9b407abbf?w=600&q=80",
  orchid:      "https://images.unsplash.com/photo-1490750967868-88df5691cc7b?w=600&q=80",
};


/*
  ─── CONSTANTE: QUESTION_TIME ────────────────────────────────────────
  Duração do temporizador para cada pergunta, em segundos.
  Actualmente definido como 60 segundos (1 minuto por pergunta).

  Para alterar o tempo, basta mudar este valor aqui.
  O App.js usa esta constante em:
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    setTimeLeft(QUESTION_TIME); // ao reiniciar o temporizador
*/
const QUESTION_TIME = 60;