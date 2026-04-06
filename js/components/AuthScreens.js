/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║              js/components/AuthScreens.js                       ║
  ║   Ecrãs de Autenticação: Login, Registro e Convite              ║
  ║                                                                 ║
  ║   Todos os ecrãs são OPCIONAIS — o quiz funciona sem login.     ║
  ║                                                                 ║
  ║   InviteScreen — Aviso pré-quiz a sugerir login                 ║
  ║   LoginScreen  — Formulário de entrada                          ║
  ║   RegisterScreen — Formulário de registo                        ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const { useState } = React;

/* ─── InviteScreen ────────────────────────────────────────────────────
   Aparece quando o utilizador clica "Começar" sem estar logado.
   Oferece criar conta OU continuar como convidado.
   Props:
     t          — Textos traduzidos
     onLogin    — Navegar para Login
     onRegister — Navegar para Registro
     onGuest    — Continuar sem conta (inicia o quiz)
*/
const InviteScreen = ({ t, onLogin, onRegister, onGuest }) => (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

        {/* Coluna de texto */}
        <div className="md:col-span-6 flex flex-col gap-8 order-2 md:order-1">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1 rounded-full text-secondary font-label text-xs font-bold tracking-[1.5px] uppercase"
                  style={{ background: 'rgba(125,160,255,0.2)', backdropFilter: 'blur(12px)' }}>
              {t.inviteTag}
            </span>
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-on-surface leading-[1.1] tracking-[-0.02em]">
              {t.inviteTitle1}{' '}
              <span className="text-primary italic">{t.inviteTitle2}</span>
              {t.inviteTitle3}
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-body max-w-md">
              {t.inviteDesc}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
                onClick={onRegister}
                className="text-white font-headline font-bold py-5 px-10 rounded-full text-lg shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg,#715c00,#fcd116)' }}
            >
              {t.inviteCreate}
              <Icon name="arrow_forward" />
            </button>
            <button
                onClick={onGuest}
                className="text-center font-label font-medium text-on-surface-variant hover:text-secondary transition-colors duration-200 py-2"
            >
              {t.inviteGuest}
            </button>
            <button
                onClick={onLogin}
                className="text-center font-label font-medium text-secondary hover:underline transition-colors duration-200 py-1 text-sm"
            >
              {t.loginNoAccount ? '' : ''}{t.loginBtn ? t.loginBtn : 'Login'}
            </button>
          </div>

          {/* Mini cards de benefícios */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: 'military_tech', label: t.inviteMedals, color: 'text-primary' },
              { icon: 'history',       label: t.inviteHistory, color: 'text-secondary' },
              { icon: 'emoji_events',  label: t.invitePrizes,  color: 'text-tertiary' },
            ].map(({ icon, label, color }) => (
                <div key={label} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
                  <Icon name={icon} className={`${color} mb-2`} style={{ fontSize: '28px' }} />
                  <p className="text-xs font-bold text-on-surface uppercase tracking-wider">{label}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Coluna de imagem */}
        <div className="md:col-span-6 relative order-1 md:order-2 flex justify-center">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl -z-10 opacity-30"
               style={{ background: '#ffe17b' }}></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl -z-10 opacity-20"
               style={{ background: '#dae1ff' }}></div>
          <div className="relative w-full aspect-square max-w-md bg-surface-container rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-2xl">
            <img
                src={IMAGES.celebration}
                alt="Colombian Culture"
                className="w-full h-full object-cover opacity-90"
                onError={e => e.target.style.display = 'none'}
            />
            <div className="absolute inset-0 flex items-end p-8"
                 style={{ background: 'linear-gradient(to top, rgba(113,92,0,0.5), transparent)' }}>
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl w-full"
                   style={{ border: '1px solid rgba(255,255,255,0.3)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                       style={{ background: '#715c00' }}>1º</div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Carlos Vives</p>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Lenda do Vallenato</p>
                  </div>
                  <Icon name="stars" fill className="text-primary ml-auto" style={{ fontSize: '24px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);


/* ─── LoginScreen ─────────────────────────────────────────────────────
   Props:
     t          — Textos traduzidos
     onLogin    — Callback chamado com { email, password } ao submeter
     onRegister — Navegar para Registro
     onGuest    — Continuar sem conta
     error      — Mensagem de erro (string ou null)
*/
const LoginScreen = ({ t, onLogin, onRegister, onGuest, error }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email || !password) return;
    onLogin(email, password);
  };

  return (
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-3xl bg-surface-container-lowest"
             style={{ boxShadow: '0 32px 64px rgba(113,92,0,0.08)' }}>

          {/* Painel lateral decorativo */}
          <div className="md:col-span-7 relative hidden md:flex bg-secondary overflow-hidden flex-col justify-between p-12 text-on-secondary">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <img src={IMAGES.hero} alt="Colombia" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0"
                 style={{ background: 'linear-gradient(to top right, rgba(51,90,180,0.8), transparent)' }}></div>
            <div className="relative">
              <span className="font-headline font-extrabold italic text-4xl tracking-tighter"
                    style={{ color: '#ffe17b' }}>Vallenato Quiz</span>
            </div>
            <div className="relative space-y-6">
              <h1 className="font-headline text-6xl font-black leading-none tracking-tight -ml-2">
                El Ritmo <br /> de la <br /> Sabiduría.
              </h1>
              <p className="text-xl max-w-md font-medium leading-relaxed opacity-80">
                Únete a la comunidad que celebra la cultura, la música y el alma de Colombia.
              </p>
            </div>
            <div className="relative flex items-center gap-4">
              <div className="h-12 w-12 rounded-full border-2 flex items-center justify-center"
                   style={{ borderColor: 'rgba(255,225,123,0.4)' }}>
                <Icon name="music_note" style={{ color: '#ffe17b' }} />
              </div>
              <span className="text-sm uppercase tracking-widest font-bold">Orgullo Colombiano</span>
            </div>
          </div>

          {/* Formulário */}
          <div className="md:col-span-5 p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest">
            <div className="mb-4 block md:hidden">
              <span className="font-headline font-extrabold italic text-3xl tracking-tighter text-primary">Vallenato Quiz</span>
            </div>
            <header className="mb-10">
              <h2 className="font-headline text-4xl font-bold text-on-surface tracking-tight mb-2">{t.loginTitle}</h2>
              <p className="text-on-surface-variant font-medium">{t.loginSubtitle}</p>
            </header>

            {error && (
                <div className="mb-6 p-4 rounded-xl text-sm font-bold"
                     style={{ background: '#ffdad6', color: '#93000a' }}>
                  {error}
                </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-[1.5px] text-on-surface-variant">
                  {t.loginEmail}
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nombre@ejemplo.com"
                    className="w-full px-5 py-4 rounded-xl bg-surface-container border-none text-on-surface placeholder:text-outline-variant font-medium transition-all"
                    style={{ outline: 'none', boxShadow: 'none' }}
                    onFocus={e => e.target.style.boxShadow = '0 0 0 2px #fcd116'}
                    onBlur={e => e.target.style.boxShadow = 'none'}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase tracking-[1.5px] text-on-surface-variant">
                    {t.loginPassword}
                  </label>
                  <a className="text-xs font-bold text-secondary hover:underline" href="#">
                    {t.loginForgot}
                  </a>
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 rounded-xl bg-surface-container border-none text-on-surface placeholder:text-outline-variant font-medium transition-all"
                    style={{ outline: 'none', boxShadow: 'none' }}
                    onFocus={e => e.target.style.boxShadow = '0 0 0 2px #fcd116'}
                    onBlur={e => e.target.style.boxShadow = 'none'}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <button
                  onClick={handleSubmit}
                  className="w-full py-4 rounded-full font-headline font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg,#715c00,#fcd116)', color: '#1f1b11' }}
              >
                {t.loginBtn}
              </button>
            </div>

            <div className="my-8 flex items-center gap-4">
              <div className="flex-grow h-px" style={{ background: 'rgba(208,198,171,0.3)' }}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-outline">{t.loginOr}</span>
              <div className="flex-grow h-px" style={{ background: 'rgba(208,198,171,0.3)' }}></div>
            </div>

            <button
                onClick={onGuest}
                className="w-full py-3 rounded-xl bg-surface-container font-bold text-on-surface-variant hover:bg-surface-container-highest transition-colors text-sm mb-6"
            >
              {t.loginGuest}
            </button>

            <footer className="text-center">
              <p className="text-on-surface-variant font-medium">
                {t.loginNoAccount}
                <button
                    onClick={onRegister}
                    className="text-primary font-bold hover:underline ml-1"
                >
                  {t.loginCreateLink}
                </button>
              </p>
            </footer>
          </div>
        </div>
      </div>
  );
};


/* ─── RegisterScreen ──────────────────────────────────────────────────
   Props:
     t          — Textos traduzidos
     onRegister — Callback com { name, email, password }
     onLogin    — Voltar ao login
     onGuest    — Continuar sem conta
     error      — Mensagem de erro
*/
const RegisterScreen = ({ t, onRegister, onLogin, onGuest, error }) => {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !password) return;
    onRegister(name, email, password);
  };

  const inputStyle = {
    background: '#fcf3e1',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
  };

  return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 md:py-20"
           style={{ background: '#fff8ef', backgroundImage: 'radial-gradient(#d0c6ab 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>
        <div className="relative w-full max-w-5xl flex flex-col md:flex-row bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-2xl">

          {/* Painel lateral com imagem */}
          <div className="md:w-1/2 relative min-h-[300px] md:min-h-full">
            <div className="absolute inset-0 bg-cover bg-center"
                 style={{ backgroundImage: `url(${IMAGES.hero})` }}></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white"
                 style={{ background: 'linear-gradient(to top, rgba(113,92,0,0.85), transparent)' }}>
              <h1 className="font-headline font-black text-4xl md:text-5xl italic tracking-tighter mb-4 leading-none">
                Vallenato Quiz
              </h1>
              <p className="font-label text-sm uppercase tracking-[0.2em] opacity-90 pl-4"
                 style={{ borderLeft: '2px solid #fcd116' }}>
                Descubre tu alma Colombiana
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest">
            <div className="mb-10">
              <h2 className="font-headline font-extrabold text-3xl text-primary mb-2 tracking-tight">{t.registerTitle}</h2>
              <p className="text-on-surface-variant font-medium">{t.registerSubtitle}</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl text-sm font-bold"
                     style={{ background: '#ffdad6', color: '#93000a' }}>
                  {error}
                </div>
            )}

            <div className="space-y-6">
              {[
                { label: t.registerName,     value: name,     set: setName,     icon: 'person', type: 'text',     ph: 'Juan Pérez' },
                { label: t.registerEmail,    value: email,    set: setEmail,    icon: 'mail',   type: 'email',    ph: 'hola@vallenato.co' },
                { label: t.registerPassword, value: password, set: setPassword, icon: 'lock',   type: 'password', ph: '••••••••' },
              ].map(({ label, value, set, icon, type, ph }) => (
                  <div key={label} className="space-y-2">
                    <label className="block font-label text-xs font-bold uppercase tracking-widest text-secondary ml-1">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon name={icon} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                      <input
                          type={type}
                          value={value}
                          onChange={e => set(e.target.value)}
                          placeholder={ph}
                          className="w-full pl-12 pr-4 py-4 rounded-xl text-on-surface placeholder:text-outline-variant transition-all"
                          style={inputStyle}
                          onFocus={e => e.target.style.boxShadow = '0 0 0 2px #715c00'}
                          onBlur={e => e.target.style.boxShadow = 'none'}
                          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      />
                    </div>
                  </div>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <button
                    onClick={handleSubmit}
                    className="w-full py-4 font-headline font-bold text-lg rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg,#715c00,#fcd116)', color: '#1f1b11' }}
                >
                  {t.registerBtn}
                </button>
                <button
                    onClick={onGuest}
                    className="w-full py-3 rounded-full font-medium text-sm text-on-surface-variant hover:text-secondary transition-colors"
                >
                  {t.loginGuest}
                </button>
              </div>
            </div>

            <div className="mt-10 pt-8 flex flex-col items-center gap-4"
                 style={{ borderTop: '1px solid rgba(208,198,171,0.3)' }}>
              <p className="text-sm text-on-surface-variant font-medium">{t.registerHasAcc}</p>
              <button
                  onClick={onLogin}
                  className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors group"
              >
                <Icon name="arrow_back" className="group-hover:-translate-x-1 transition-transform" style={{ fontSize: '18px' }} />
                {t.registerBackLogin}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};
