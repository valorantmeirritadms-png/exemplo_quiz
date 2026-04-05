/* ─── Shared UI Components ────────────────────────────────────────── */

/**
 * Material Symbol icon wrapper.
 * @param {{ name: string, fill?: boolean, className?: string, style?: object }} props
 */
const Icon = ({ name, fill = false, className = "", style }) => (
  <span
    className={`material-symbols-outlined ${fill ? 'fill-icon' : ''} ${className}`}
    style={style}
  >
    {name}
  </span>
);

/* ─── Language Toggle ─────────────────────────────────────────────── */
const LangToggle = ({ lang, setLang }) => (
  <div className="flex items-center gap-1 bg-surface-container rounded-full p-1">
    {['es', 'pt'].map(l => (
      <button
        key={l}
        onClick={() => setLang(l)}
        className={`lang-toggle px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-label ${
          lang === l
            ? 'bg-primary text-on-primary shadow-sm'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        {l === 'es' ? '🇨🇴 ES' : '🇧🇷 PT'}
      </button>
    ))}
  </div>
);

/* ─── Header ──────────────────────────────────────────────────────── */
const Header = ({ lang, setLang, t, currentScreen }) => (
  <header
    className="bg-background sticky top-0 z-[100]"
    style={{ borderBottom: '1px solid #f6eddb' }}
  >
    <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-6xl mx-auto">
      <div className="text-xl md:text-2xl font-black text-primary italic font-headline tracking-tight">
        {t.appName}
      </div>
      <div className="flex items-center gap-3">
        <LangToggle lang={lang} setLang={setLang} />
        {currentScreen === 'home' && (
          <nav className="hidden md:flex items-center gap-6 ml-2">
            <a
              className="text-primary border-b-2 border-primary font-label text-xs font-bold uppercase tracking-widest py-1"
              href="#"
            >
              {t.explore}
            </a>
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

/* ─── Bottom Navigation (Mobile) ─────────────────────────────────── */
const BottomNav = ({ t, screen }) => (
  <nav
    className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-background rounded-t-3xl"
    style={{ boxShadow: '0 -8px 32px rgba(113,92,0,0.08)' }}
  >
    {[
      { icon: 'explore', label: t.explore, active: screen === 'home' },
      { icon: 'quiz',    label: t.play,    active: screen !== 'home' },
      { icon: 'person',  label: t.profile, active: false },
    ].map(({ icon, label, active }) => (
      <a
        key={label}
        className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all ${
          active ? 'bg-primary-fixed text-on-surface' : 'text-on-surface-variant'
        }`}
        href="#"
      >
        <Icon name={icon} fill={active} />
        <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">
          {label}
        </span>
      </a>
    ))}
  </nav>
);

/* ─── Footer ──────────────────────────────────────────────────────── */
const Footer = ({ t }) => (
  <footer className="bg-surface-container w-full py-10 px-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
    <div className="flex flex-col items-center md:items-start gap-2">
      <div className="font-headline font-bold text-lg text-primary">{t.appName}</div>
      <p className="font-body text-sm text-on-surface-variant text-center md:text-left">
        {t.copyright}
      </p>
    </div>
    <div className="flex gap-6">
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
