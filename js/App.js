/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║                          App.js                                 ║
  ║              Componente Raiz da Aplicação                       ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Este é o CÉREBRO da aplicação. É aqui que:                     ║
  ║   • Todos os dados importantes são guardados (estado)           ║
  ║   • Os temporizadores são controlados                           ║
  ║   • A lógica de navegação entre ecrãs é gerida                  ║
  ║   • Os resultados finais são calculados                         ║
  ║                                                                 ║
  ║  Fluxo da aplicação:                                            ║
  ║   home → question → feedback → question → … → results          ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

/*
  Destructuring (desestruturação) das funções do React.
  Em vez de escrever React.useState, React.useEffect, etc.,
  extraímos estas funções directamente para variáveis locais.

  - useState:    Guarda e actualiza dados (ex: qual ecrã está activo)
  - useEffect:   Executa código quando algo muda (ex: iniciar temporizador)
  - useRef:      Guarda referências que NÃO redesenham o ecrã (ex: ID do intervalo)
  - useCallback: Memoriza funções para evitar recriações desnecessárias
*/
const { useState, useEffect, useRef, useCallback } = React;

/*
  ─── COMPONENTE PRINCIPAL App ───────────────────────────────────────
  Um componente React é uma função que devolve JSX (o "HTML" do React).
  Este componente é o topo da hierarquia — todos os outros componentes
  (HomeScreen, QuestionScreen, etc.) são filhos deste.
*/
const App = () => {

  /*
    ── ESTADO DA APLICAÇÃO ─────────────────────────────────────────
    "Estado" (state) são os dados que podem mudar enquanto o utilizador
    usa a aplicação. Cada vez que o estado muda, o React redesenha
    automaticamente a interface para reflectir as novas informações.

    useState(valorInicial) devolve sempre dois elementos:
      1. O valor actual da variável
      2. A função para actualizar esse valor
  */

  // Idioma activo: 'es' (espanhol) ou 'pt' (português)
  const [lang, setLang] = useState('es');

  /*
    Qual ecrã está visível agora. Pode ser um de quatro valores:
      'home'      → Ecrã inicial
      'question'  → Ecrã de pergunta
      'feedback'  → Ecrã de acerto/erro
      'results'   → Ecrã de resultados finais
  */
  const [screen, setScreen] = useState('home');

  // Índice da pergunta actual (0 = primeira pergunta, 1 = segunda, etc.)
  const [questionIdx, setQuestionIdx] = useState(0);

  /*
    Array com todas as respostas do utilizador.
    Começa preenchido com 'null' para cada pergunta (sem resposta ainda).
    Ex: se houver 10 perguntas → [null, null, null, null, null, null, null, null, null, null]
    Quando o utilizador responde à pergunta 2, fica: [null, 2, null, ...]
    (o número é o índice da opção escolhida: 0=A, 1=B, 2=C, 3=D)
  */
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  // A opção que o utilizador seleccionou na pergunta actual (antes de confirmar)
  const [currentSelected, setCurrentSelected] = useState(null);

  // 'true' quando o utilizador já confirmou a resposta (clicou em "Seguinte")
  const [answered, setAnswered] = useState(false);

  // Segundos restantes no temporizador da pergunta actual (conta decrescente)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME); // QUESTION_TIME = 60s (definido em helpers.js)

  // Tempo total decorrido desde que o quiz começou (conta crescente, em segundos)
  const [totalTime, setTotalTime] = useState(0);


  /*
    ── REFERÊNCIAS (useRef) ─────────────────────────────────────────
    useRef guarda valores que queremos manter entre re-renderizações,
    mas cuja alteração NÃO deve causar um novo desenho do ecrã.
    Usamos refs para guardar os IDs dos intervalos (temporizadores)
    para poder cancelá-los quando necessário (clearInterval).
  */

  // ID do intervalo do temporizador por pergunta (conta decrescente de 60s)
  const timerRef = useRef(null);

  // ID do intervalo do temporizador total (conta o tempo geral do quiz)
  const totalTimerRef = useRef(null);


  /*
    ── ATALHOS PARA DADOS FREQUENTEMENTE USADOS ───────────────────
    Para não escrever i18n[lang] e questions[questionIdx] repetidamente.
  */

  // Textos no idioma activo (vindos do ficheiro i18n.js)
  const t = i18n[lang];

  // Pergunta actual (objecto com texto, opções, resposta correcta, etc.)
  const question = questions[questionIdx];


  /*
    ══════════════════════════════════════════════════════════════
    EFEITO 1: Temporizador por pergunta (conta decrescente)
    ══════════════════════════════════════════════════════════════
    useEffect executa o código dentro dele sempre que as variáveis
    na lista de dependências mudam ([screen, questionIdx]).

    Ou seja: sempre que muda o ecrã ou muda a pergunta, este código corre.
  */
  useEffect(() => {
    // Se não estamos no ecrã de perguntas, não fazer nada
    if (screen !== 'question') return;

    // Cancelar qualquer temporizador anterior que ainda possa estar a correr
    clearInterval(timerRef.current);

    // Reiniciar o tempo para 60 segundos (para cada nova pergunta)
    setTimeLeft(QUESTION_TIME);

    /*
      setInterval executa uma função de forma repetida a cada X milissegundos.
      1000ms = 1 segundo. Guardamos o ID devolvido para poder cancelar depois.
    */
    timerRef.current = setInterval(() => {
      /*
        A forma funcional de actualizar estado: em vez de usar 'timeLeft' directamente,
        usamos a versão anterior (prev) para garantir que o valor está sempre actualizado,
        mesmo que múltiplas actualizações aconteçam ao mesmo tempo.
      */
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Tempo esgotado! Cancelar o temporizador
          clearInterval(timerRef.current);

          /*
            Se o utilizador ainda não respondeu, avançar automaticamente
            como se tivesse esgotado o tempo (timedOut = true).
            "!answered" verifica se ainda não foi respondida.
          */
          if (!answered) handleNext(true);

          return 0; // O valor do contador fica em 0
        }
        return prev - 1; // Decrementar 1 segundo
      });
    }, 1000);

    /*
      Função de limpeza (cleanup): executada quando o componente é desmontado
      ou antes de o efeito correr novamente.
      Garante que não ficam temporizadores "órfãos" a correr em segundo plano.
    */
    return () => clearInterval(timerRef.current);

  }, [screen, questionIdx]); // ← Este efeito corre quando 'screen' ou 'questionIdx' mudam


  /*
    ══════════════════════════════════════════════════════════════
    EFEITO 2: Temporizador total (tempo geral do quiz)
    ══════════════════════════════════════════════════════════════
    Conta o tempo total enquanto o utilizador está a jogar
    (nos ecrãs 'question' e 'feedback').
    Para automaticamente quando sai desses ecrãs.
  */
  useEffect(() => {
    if (screen === 'question' || screen === 'feedback') {
      // Iniciar contagem crescente (incrementa 1 segundo a cada 1000ms)
      totalTimerRef.current = setInterval(() => setTotalTime(p => p + 1), 1000);
    } else {
      // Fora do quiz (ecrã inicial ou resultados): parar a contagem
      clearInterval(totalTimerRef.current);
    }
    // Limpeza: sempre cancelar ao sair do efeito
    return () => clearInterval(totalTimerRef.current);
  }, [screen]); // ← Este efeito corre quando 'screen' muda


  /*
    ══════════════════════════════════════════════════════════════
    ACÇÕES DO QUIZ (funções que respondem a interacções do utilizador)
    ══════════════════════════════════════════════════════════════
  */

  /*
    startQuiz — Inicia (ou reinicia) o quiz do zero.
    Chamada quando o utilizador clica em "Começar" no ecrã inicial.
  */
  const startQuiz = () => {
    setQuestionIdx(0);                                    // Voltar à primeira pergunta
    setAnswers(Array(questions.length).fill(null));       // Limpar todas as respostas
    setCurrentSelected(null);                             // Limpar selecção actual
    setAnswered(false);                                   // Marcar como não respondida
    setTotalTime(0);                                      // Reiniciar o temporizador total
    setScreen('question');                                // Navegar para o ecrã de perguntas
  };

  /*
    handleSelect — Chamada quando o utilizador clica numa opção de resposta.
    'idx' é o índice da opção clicada (0=A, 1=B, 2=C, 3=D).
  */
  const handleSelect = (idx) => {
    // Ignorar cliques se a pergunta já foi respondida (não permite mudar a resposta)
    if (answered) return;
    setCurrentSelected(idx); // Guardar a opção seleccionada
  };

  /*
    handleNext — Chamada quando o utilizador confirma a resposta.
    useCallback memoriza esta função e só a recria quando as suas
    dependências mudam, evitando recriações desnecessárias.

    timedOut: boolean que indica se o tempo esgotou (true) ou se o
    utilizador clicou voluntariamente (false, valor por defeito).
  */
  const handleNext = useCallback((timedOut = false) => {
    // Parar o temporizador por pergunta imediatamente
    clearInterval(timerRef.current);

    /*
      Se o tempo esgotou, guardamos -1 como resposta (nenhuma opção válida).
      Caso contrário, usamos a opção seleccionada pelo utilizador.
    */
    const sel = timedOut ? -1 : currentSelected;

    // Não fazer nada se não há nenhuma selecção (e não é timeout)
    if (sel === null) return;

    // Copiar o array de respostas e actualizar a posição actual
    const newAnswers = [...answers];      // Cópia para não mutar o estado directamente
    newAnswers[questionIdx] = sel;        // Guardar a resposta desta pergunta
    setAnswers(newAnswers);

    setAnswered(true);         // Marcar pergunta como respondida
    setScreen('feedback');     // Ir para o ecrã de feedback
  }, [currentSelected, answers, questionIdx]); // Dependências do useCallback

  /*
    handleFeedbackNext — Chamada no ecrã de feedback quando o utilizador
    clica em "Próxima Pergunta".
  */
  const handleFeedbackNext = () => {
    if (questionIdx + 1 >= questions.length) {
      // Era a última pergunta → ir para os resultados
      setScreen('results');
    } else {
      // Avançar para a próxima pergunta
      setQuestionIdx(q => q + 1);

      /*
        Se o utilizador já tinha respondido a esta pergunta anteriormente
        (voltou atrás e agora avança), mostrar a resposta que deu antes.
        Caso contrário, 'answers[questionIdx + 1]' será null.
      */
      setCurrentSelected(answers[questionIdx + 1]);
      setAnswered(false);        // Próxima pergunta começa como "não respondida"
      setScreen('question');     // Ir para o ecrã de pergunta
    }
  };

  /*
    handlePrev — Permite voltar à pergunta anterior (botão "Anterior").
    Útil para rever respostas antes de submeter.
  */
  const handlePrev = () => {
    // Não fazer nada se já estamos na primeira pergunta
    if (questionIdx === 0) return;

    setQuestionIdx(q => q - 1);                           // Recuar um índice
    setCurrentSelected(answers[questionIdx - 1]);         // Restaurar a resposta anterior
    setAnswered(false);                                   // Permitir alterar a resposta
  };


  /*
    ══════════════════════════════════════════════════════════════
    CÁLCULO DOS RESULTADOS FINAIS
    ══════════════════════════════════════════════════════════════
    Estas variáveis são calculadas sempre que o componente redesenha,
    mas só são relevantes no ecrã de resultados.
  */

  /*
    score — Número de respostas correctas.
    .filter() percorre o array de respostas e conta quantas
    coincidem com a resposta correcta de cada pergunta.
    'a' é a resposta dada, 'i' é o índice da pergunta.
  */
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  /*
    maxStreak — Maior sequência consecutiva de respostas correctas.
    Exemplo: [✓, ✓, ✗, ✓, ✓, ✓] → maior sequência = 3

    É uma IIFE (Immediately Invoked Function Expression):
    uma função anónima definida e executada imediatamente.
    Usada aqui para encapsular a lógica de cálculo da sequência.
  */
  const maxStreak = (() => {
    let max = 0;  // Maior sequência encontrada até agora
    let cur = 0;  // Sequência actual em curso

    answers.forEach((a, i) => {
      if (a === questions[i].answer) {
        // Resposta correcta: incrementar sequência actual
        cur++;
        max = Math.max(max, cur); // Actualizar máximo se necessário
      } else {
        // Resposta errada: reiniciar sequência actual
        cur = 0;
      }
    });

    return max;
  })(); // ← Os () no final executam a função imediatamente


  /*
    ══════════════════════════════════════════════════════════════
    RENDERIZAÇÃO (o que aparece no ecrã)
    ══════════════════════════════════════════════════════════════
    A função 'return' devolve o JSX — a estrutura visual do componente.
    JSX parece HTML mas é JavaScript: pode conter expressões JS dentro de {}.
  */
  return (
      /*
        Contentor principal que ocupa pelo menos 100% da altura do ecrã.
        "bg-background" e "text-on-surface" são cores do tema Tailwind.
        "font-body" define a fonte padrão para o texto corrido.
      */
      <div className="bg-background text-on-surface font-body" style={{ minHeight: '100vh' }}>

        {/* O cabeçalho (Header) aparece sempre, independentemente do ecrã activo.
          Recebe o idioma actual, a função para mudar idioma, os textos (t)
          e o ecrã actual (para saber o que mostrar na navegação). */}
        <Header lang={lang} setLang={setLang} t={t} currentScreen={screen} />

        {/* ── Renderização Condicional ─────────────────────────────────
          Apenas UM dos blocos abaixo é mostrado de cada vez,
          dependendo do valor de 'screen'.
          A sintaxe {condição && <Componente />} significa:
          "SE condição for verdadeira, mostrar o componente". */}

        {/* Ecrã inicial: mostrado quando screen === 'home' */}
        {screen === 'home' && (
            <HomeScreen t={t} lang={lang} onStart={startQuiz} />
        )}

        {/* Ecrã de perguntas: mostrado quando screen === 'question' */}
        {screen === 'question' && (
            <QuestionScreen
                t={t}                             // Textos do idioma actual
                lang={lang}                       // Idioma (para as opções de resposta)
                question={question}               // Dados da pergunta actual
                questionIdx={questionIdx}         // Número da pergunta (para "Pergunta X de Y")
                total={questions.length}          // Total de perguntas
                selected={currentSelected}        // Opção actualmente seleccionada
                onSelect={handleSelect}           // Função chamada ao clicar numa opção
                onNext={() => handleNext(false)}  // Função para confirmar resposta
                onPrev={handlePrev}               // Função para voltar atrás
                timeLeft={timeLeft}               // Tempo restante (para o relógio)
                answered={answered}               // Se já respondeu (bloqueia opções)
            />
        )}

        {/* Ecrã de feedback: mostrado quando screen === 'feedback' */}
        {screen === 'feedback' && (
            <FeedbackScreen
                t={t}                             // Textos do idioma actual
                lang={lang}                       // Idioma
                question={question}               // Pergunta actual (para mostrar a resposta correcta)
                selected={answers[questionIdx]}   // Resposta que o utilizador deu
                onNext={handleFeedbackNext}       // Função para avançar
            />
        )}

        {/* Ecrã de resultados: mostrado quando screen === 'results' */}
        {screen === 'results' && (
            <ResultsScreen
                t={t}                             // Textos do idioma actual
                lang={lang}                       // Idioma
                score={score}                     // Número de respostas correctas
                total={questions.length}          // Total de perguntas
                totalTime={totalTime}             // Tempo total decorrido
                maxStreak={maxStreak}             // Maior sequência de acertos
                onRestart={startQuiz}             // Função para recomeçar o quiz
            />
        )}
      </div>
  );
};

/*
  ── INICIALIZAÇÃO DA APLICAÇÃO ─────────────────────────────────────
  Esta linha liga o React à página HTML:
  1. document.getElementById('root') — encontra o <div id="root"> no index.html
  2. ReactDOM.createRoot()           — cria um "raiz" React nesse div
  3. .render(<App />)                — renderiza o componente App dentro dele

  A partir daqui, o React gere toda a interface de utilizador.
*/
ReactDOM.createRoot(document.getElementById('root')).render(<App />);