/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║              js/components/ProfileScreen.js                     ║
  ║                    Ecrã de Perfil do Utilizador                 ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const ProfileScreen = ({ t, lang, user, onNavigate, onLogout }) => {
  if (!user) {
    return (
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow flex items-center justify-center px-4 py-20 text-center">
            <div className="max-w-sm">
              <Icon name="account_circle" className="text-outline-variant mb-6" style={{ fontSize: '80px' }} />
              <h2 className="font-headline text-3xl font-bold mb-3 text-on-surface">{t.profileNotLogged}</h2>
              <p className="text-on-surface-variant mb-8">{t.inviteDesc}</p>
              <div className="flex flex-col gap-3">
                <button
                    onClick={() => onNavigate('login')}
                    className="w-full py-4 rounded-full font-headline font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg,#715c00,#fcd116)', color: '#1f1b11' }}>
                  {t.profileLoginBtn}
                </button>
                <button
                    onClick={() => onNavigate('register')}
                    className="w-full py-4 rounded-full font-headline font-bold text-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">
                  {t.registerBtn}
                </button>
              </div>
            </div>
          </main>
          <Footer t={t} />
          <BottomNav t={t} screen="profile" onNavigate={onNavigate} />
        </div>
    );
  }

  const xp         = user.xp || 0;
  const level      = user.level || 1;
  const xpInLevel  = xp % 1000;
  const xpNeeded   = 1000;
  const pct        = Math.min((xpInLevel / xpNeeded) * 100, 100);

  const userRanking = Auth.getRanking();
  const myPos       = userRanking.findIndex(r => r.userId === user.id);
  const myBest      = userRanking.find(r => r.userId === user.id);

  const achievements = [
    { icon: 'workspace_premium', label: 'Puro Sangue',   sub: '100% em História', color: '#715c00', bg: '#ffe17b', locked: false },
    { icon: 'map',               label: 'Explorador',    sub: 'Geog. Nível 5',    color: '#335ab4', bg: '#dae1ff', locked: false },
    { icon: 'music_note',        label: 'Vallenatero',   sub: 'Mestre do Ritmo',  color: '#c0001f', bg: '#ffc8c4', locked: false },
    { icon: 'lock',              label: 'Bloqueado',     sub: '',                 color: '#7f7760', bg: '#eae2d0', locked: true  },
  ];

  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* ── Sidebar ────────────────────────────────────── */}
            <aside className="w-full lg:w-1/3 flex flex-col gap-8">

              {/* Card de avatar e stats rápidas */}
              <div className="bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8"
                     style={{ background: 'rgba(252,209,22,0.2)' }}></div>
                <div className="relative flex flex-col items-center text-center">

                  {/* Avatar com letra */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-headline font-black text-white"
                         style={{ border: '4px solid #fcd116', background: 'linear-gradient(135deg,#715c00,#335ab4)' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                            style={{ background: '#335ab4', color: 'white' }}>
                      <Icon name="edit" style={{ fontSize: '16px' }} />
                    </button>
                  </div>

                  <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-1">{user.name}</h1>
                  <p className="text-secondary font-bold uppercase tracking-widest text-xs font-label mb-6">
                    {level >= 10 ? 'Mestre Vallenato' : level >= 5 ? 'Especialista' : 'Aprendiz'}
                  </p>

                  {/* Mini stats */}
                  <div className="w-full bg-surface-container p-4 rounded-xl flex justify-around items-center">
                    {[
                      { val: level,                               sub: t.profileLevel  },
                      { val: xp >= 1000 ? `${(xp/1000).toFixed(1)}k` : xp, sub: t.profileXP },
                      { val: myPos >= 0 ? `#${myPos + 1}` : '—', sub: t.profileGlobal },
                    ].map(({ val, sub }) => (
                        <div key={sub} className="text-center">
                          <span className="block text-2xl font-black text-primary">{val}</span>
                          <span className="text-[10px] font-label uppercase tracking-wider text-outline">{sub}</span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Barra de progresso XP */}
              <div className="p-8 rounded-xl"
                   style={{ background: 'rgba(51,90,180,0.08)', border: '1px solid rgba(51,90,180,0.15)' }}>
                <h3 className="font-headline font-bold text-secondary mb-4 uppercase tracking-widest text-sm">
                  {t.profileProgress}
                </h3>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-secondary">{t.profileLevel} {level}</span>
                  <span className="text-on-surface-variant">{xpInLevel} / {xpNeeded} XP</span>
                </div>
                <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000"
                       style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#715c00,#c0001f)' }}></div>
                </div>
                <p className="mt-4 text-xs text-on-surface-variant leading-relaxed italic">
                  {`Faltam ${xpNeeded - xpInLevel} XP para o ${t.profileLevel} ${level + 1}!`}
                </p>
              </div>

              {/* Botão logout */}
              <button
                  onClick={onLogout}
                  className="w-full py-3 rounded-full font-bold text-sm border-2 text-outline hover:text-tertiary hover:border-tertiary transition-colors flex items-center justify-center gap-2"
                  style={{ borderColor: '#d0c6ab' }}>
                <Icon name="logout" style={{ fontSize: '18px' }} />
                {t.profileLogout}
              </button>
            </aside>

            {/* ── Conteúdo principal ─────────────────────────── */}
            <section className="w-full lg:w-2/3 flex flex-col gap-10">

              {/* Estatísticas */}
              <div>
                <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-on-background mb-8 flex items-center gap-4">
                  {t.profileStats}
                  <span className="h-px flex-grow bg-outline-variant/20"></span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: 'verified',        val: myBest ? `${Math.round((myBest.score/myBest.total)*100)}%` : '—', sub: t.profileAcc,    color: '#715c00', border: '#715c00' },
                    { icon: 'bolt',            val: myBest ? myBest.maxStreak : '—',                               sub: t.profileStreak,  color: '#335ab4', border: '#335ab4' },
                    { icon: 'timer',           val: myBest ? formatTime(myBest.totalTime) : '—',                   sub: t.profileTime,    color: '#c0001f', border: '#c0001f' },
                  ].map(({ icon, val, sub, color, border }) => (
                      <div key={sub} className="bg-surface-container-lowest p-6 rounded-xl"
                           style={{ borderLeft: `4px solid ${border}` }}>
                        <Icon name={icon} fill className="mb-3" style={{ fontSize: '32px', color }} />
                        <h4 className="text-3xl font-black text-on-surface leading-none mb-1">{val}</h4>
                        <p className="text-xs font-label uppercase tracking-widest text-outline">{sub}</p>
                      </div>
                  ))}
                </div>
              </div>

              {/* Conquistas */}
              <div>
                <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-on-background mb-8 flex items-center gap-4">
                  {t.profileAchiev}
                  <span className="h-px flex-grow bg-outline-variant/20"></span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {achievements.map(({ icon, label, sub, color, bg, locked }) => (
                      <div key={label}
                           className={`aspect-square bg-surface-container-lowest rounded-xl p-4 flex flex-col items-center justify-center text-center group transition-transform hover:-translate-y-1 ${locked ? 'opacity-50' : ''}`}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner"
                             style={{ background: bg }}>
                          <Icon name={icon} fill={!locked} style={{ fontSize: '28px', color }} />
                        </div>
                        <span className="text-xs font-bold font-headline leading-tight">{label}</span>
                        {sub && <span className="text-[10px] text-outline mt-1 uppercase tracking-tighter">{sub}</span>}
                      </div>
                  ))}
                </div>
              </div>

              {/* Botão editar perfil */}
              <div className="mt-4">
                <button className="w-full md:w-auto px-12 py-4 font-headline font-extrabold rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                        style={{ background: 'linear-gradient(135deg,#715c00,#fcd116)', color: '#1f1b11' }}>
                  {t.profileEdit}
                </button>
              </div>
            </section>
          </div>
        </main>

        <Footer t={t} />
        <BottomNav t={t} screen="profile" onNavigate={onNavigate} />
      </div>
  );
};
