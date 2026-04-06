import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  pt: {
    // Header
    appTitle: "Quiz Colômbia",
    login: "Entrar",
    register: "Registar",
    logout: "Sair",
    levels: "Níveis",
    
    // Auth
    welcomeBack: "Bem-vindo de volta!",
    createAccount: "Criar Conta",
    email: "Email",
    password: "Palavra-passe",
    name: "Nome",
    enterEmail: "Introduza o seu email",
    enterPassword: "Introduza a sua palavra-passe",
    enterName: "Introduza o seu nome",
    noAccount: "Não tem conta?",
    hasAccount: "Já tem conta?",
    
    // Home
    heroTitle: "Quanto sabes sobre a Colômbia?",
    heroSubtitle: "Testa os teus conhecimentos sobre cantores, cultura, gastronomia, história e mais!",
    startPlaying: "Começar a Jogar",
    selectLevel: "Seleciona um Nível",
    
    // Levels
    level: "Nível",
    questions: "perguntas",
    locked: "Bloqueado",
    completed: "Concluído",
    
    // Level themes
    cantores: "Cantores",
    cultura: "Cultura",
    gastronomia: "Gastronomia",
    historia: "História",
    narcotrafico: "Narcotráfico",
    
    // Quiz
    question: "Pergunta",
    of: "de",
    next: "Próxima",
    finish: "Terminar",
    score: "Pontuação",
    yourScore: "A tua pontuação",
    correct: "Correto!",
    incorrect: "Incorreto!",
    theCorrectAnswer: "A resposta correta é:",
    
    // Results
    congratulations: "Parabéns!",
    tryAgain: "Tenta outra vez!",
    levelCompleted: "Nível Concluído",
    levelUnlocked: "Novo nível desbloqueado!",
    backToLevels: "Voltar aos Níveis",
    playAgain: "Jogar Novamente",
    
    // Footer
    madeWith: "Feito com",
    forColombia: "para a Colômbia"
  },
  es: {
    // Header
    appTitle: "Quiz Colombia",
    login: "Iniciar sesión",
    register: "Registrarse",
    logout: "Salir",
    levels: "Niveles",
    
    // Auth
    welcomeBack: "¡Bienvenido de nuevo!",
    createAccount: "Crear Cuenta",
    email: "Correo electrónico",
    password: "Contraseña",
    name: "Nombre",
    enterEmail: "Ingresa tu correo",
    enterPassword: "Ingresa tu contraseña",
    enterName: "Ingresa tu nombre",
    noAccount: "¿No tienes cuenta?",
    hasAccount: "¿Ya tienes cuenta?",
    
    // Home
    heroTitle: "¿Cuánto sabes sobre Colombia?",
    heroSubtitle: "¡Pon a prueba tus conocimientos sobre cantantes, cultura, gastronomía, historia y más!",
    startPlaying: "Empezar a Jugar",
    selectLevel: "Selecciona un Nivel",
    
    // Levels
    level: "Nivel",
    questions: "preguntas",
    locked: "Bloqueado",
    completed: "Completado",
    
    // Level themes
    cantores: "Cantantes",
    cultura: "Cultura",
    gastronomia: "Gastronomía",
    historia: "Historia",
    narcotrafico: "Narcotráfico",
    
    // Quiz
    question: "Pregunta",
    of: "de",
    next: "Siguiente",
    finish: "Terminar",
    score: "Puntuación",
    yourScore: "Tu puntuación",
    correct: "¡Correcto!",
    incorrect: "¡Incorrecto!",
    theCorrectAnswer: "La respuesta correcta es:",
    
    // Results
    congratulations: "¡Felicitaciones!",
    tryAgain: "¡Inténtalo de nuevo!",
    levelCompleted: "Nivel Completado",
    levelUnlocked: "¡Nuevo nivel desbloqueado!",
    backToLevels: "Volver a los Niveles",
    playAgain: "Jugar de Nuevo",
    
    // Footer
    madeWith: "Hecho con",
    forColombia: "para Colombia"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('quiz_colombia_lang');
    return saved || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('quiz_colombia_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'pt' ? 'es' : 'pt');
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
