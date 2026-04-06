/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║              js/components/RankingScreen.js                     ║
  ║                    Ecrã de Ranking Global                       ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

const RankingScreen = ({ t, lang, user, onNavigate }) => {
  const ranking = Auth.getRanking();

  /* Preenche com dados de exemplo se não houver entradas reais */
  const displayRanking = ranking.length > 0 ? ranking : [
    { userName: 'Valeria Rojas',  score: 10, total: 10, totalTime: 95  },
    { userName: 'Mateo G.',       score: 9,  total: 10, totalTime: 102 },
    { userName: 'Dr. Fuentes',    score: 8,  total: 10, totalTime: 115 },
    { userName: 'Camila Osorio',  score: 8,  total: 10, totalTime: 120 },
    { userName: 'Juan P. Mora',   score: 7,  total: 10, totalTime: 130 },
    { userName: 'Elena Giraldo',  score: 7,  total: 10, totalTime: 145 },
    { userName: 'Carlos V.',      score: 6,  total: 10, totalTime: 155 },
  ];

  const top3   = displayRanking.slice(0, 3);
  const rest   = displayRanking.slice(3);
  const myPos  = user ? displayRanking.findIndex(r => r.userId === user.id) : -1;

  const medals = ['🥇', '🥈', '🥉'];

  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 md:px-6 py-12 md:py-20">

          {/* ── Cabeçalho editorial ───────────────────────────── */}
          <header className="mb-16">
            <div className="inline-block px-4 py-1 rounded-full text-secondary font-bold text-xs tracking-[1.5px] uppercase mb-4"
                 style={{ background: 'rgba(125,160,255,0.15)', backdropFilter: 'blur(12px)' }}>
              {t.rankingTag}
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-background mb-4 leading-none">
              {t.rankingTitle1} <br />
              <span className="text-primary italic">{t.rankingTitle2}</span>
            </h1>
            <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed">
              {t.rankingDesc}
            </p>
          </header>

          {/* ── Tabela de ranking ──────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden"
               style={{ boxShadow: '0 32px 64px -12px rgba(113,92,0,0.08)' }}>

            {/* Pódio top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0"
                 style={{ borderBottom: '1px solid rgba(208,198,171,0.1)' }}>

              {/* Posição 2 */}
              <div className="p-8 flex flex-col items-center text-center bg-surface-container-low/30 md:border-r"
                   style={{ borderColor: 'rgba(208,198,171,0.1)' }}>
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-headline font-black bg-surface-container"
                       style={{ border: '4px solid #f0e7d5' }}>
                    {top3[1] ? top3[1].userName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-sm"
                       style={{ background: '#9ca3af' }}>
                    🥈
                  </div>
                </div>
                <span className="font-headline font-bold text-xl mb-1">{top3[1]?.userName || '—'}</span>
                <span className="text-secondary font-bold text-sm">{top3[1] ? `${top3[1].score}/${top3[1].total} pts` : '—'}</span>
                <div className="mt-2 text-xs uppercase tracking-widest font-bold text-outline">{t.rankingPos} 2</div>
              </div>

              {/* Posição 1 — destaque */}
              <div className="p-10 flex flex-col items-center text-center"
                   style={{ background: '#ffe17b' }}>
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-headline font-black bg-white"
                       style={{ border: '4px solid #715c00' }}>
                    {top3[0] ? top3[0].userName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-lg text-xl"
                       style={{ background: '#fcd116', borderColor: '#ffe17b' }}>
                    🏆
                  </div>
                </div>
                <span className="font-headline font-bold text-2xl mb-1">{top3[0]?.userName || '—'}</span>
                <span className="font-black text-lg" style={{ color: '#715c00' }}>{top3[0] ? `${top3[0].score}/${top3[0].total} pts` : '—'}</span>
                <div className="mt-3 px-4 py-1 text-white rounded-full text-xs uppercase tracking-[2px] font-bold"
                     style={{ background: '#715c00' }}>{t.rankingChampion}</div>
              </div>

              {/* Posição 3 */}
              <div className="p-8 flex flex-col items-center text-center bg-surface-container-low/30 md:border-l"
                   style={{ borderColor: 'rgba(208,198,171,0.1)' }}>
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-headline font-black bg-surface-container"
                       style={{ border: '4px solid #f0e7d5' }}>
                    {top3[2] ? top3[2].userName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-sm"
                       style={{ background: '#cd7f32' }}>
                    🥉
                  </div>
                </div>
                <span className="font-headline font-bold text-xl mb-1">{top3[2]?.userName || '—'}</span>
                <span className="text-secondary font-bold text-sm">{top3[2] ? `${top3[2].score}/${top3[2].total} pts` : '—'}</span>
                <div className="mt-2 text-xs uppercase tracking-widest font-bold text-outline">{t.rankingPos} 3</div>
              </div>
            </div>

            {/* Posições 4+ */}
            <div className="divide-y" style={{ borderColor: 'rgba(208,198,171,0.1)' }}>
              {rest.map((r, i) => (
                  <div key={i}
                       className="flex items-center justify-between px-8 py-5 hover:bg-surface-container-low transition-colors duration-200">
                    <div className="flex items-center gap-6">
                      <span className="font-headline font-black text-2xl text-outline-variant w-8">
                        {String(i + 4).padStart(2, '0')}
                      </span>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline font-bold text-lg bg-surface-container text-on-surface">
                        {r.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-headline font-semibold text-on-surface">{r.userName}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-on-background">{r.score}/{r.total}</span>
                      <span className="text-[10px] text-outline uppercase tracking-widest font-bold">{t.rankingPts}</span>
                    </div>
                  </div>
              ))}
            </div>

            {/* Posição do utilizador logado */}
            {user && (
                <div className="px-8 py-6 flex items-center justify-between"
                     style={{ background: 'rgba(51,90,180,0.08)', borderTop: '1px solid rgba(51,90,180,0.15)' }}>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-headline font-bold text-lg"
                         style={{ background: '#335ab4' }}>
                      {myPos >= 0 ? myPos + 1 : '—'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">{t.rankingYou}</span>
                      <span className="font-headline font-bold text-on-background">{user.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-secondary text-xl">{user.xp || 0} XP</span>
                      <span className="text-[10px] text-outline uppercase tracking-widest font-bold">{t.rankingPts}</span>
                    </div>
                    <button
                        onClick={() => onNavigate('home')}
                        className="text-white px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 shadow-lg"
                        style={{ background: '#335ab4' }}>
                      {t.rankingLevelUp}
                    </button>
                  </div>
                </div>
            )}
          </div>

          {/* ── CTA inferior ─────────────────────────────────── */}
          <section className="mt-24 mb-12 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="font-headline text-3xl font-bold mb-4 tracking-tight">{t.rankingCtaTitle}</h2>
              <p className="text-on-surface-variant leading-relaxed">{t.rankingCtaDesc}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="text-white p-8 rounded-xl max-w-xs relative overflow-hidden group"
                   style={{ background: '#c0001f' }}>
                <Icon name="music_note"
                      className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-500"
                      style={{ fontSize: '96px' }} />
                <h3 className="font-headline font-bold text-xl mb-2">{t.rankingDaily}</h3>
                <p className="text-white/80 text-sm mb-6">{t.rankingDailyDesc}</p>
                <button
                    onClick={() => onNavigate('home')}
                    className="w-full bg-white py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
                    style={{ color: '#c0001f' }}>
                  {t.rankingStart}
                </button>
              </div>
            </div>
          </section>
        </main>

        <Footer t={t} />
        <BottomNav t={t} screen="ranking" onNavigate={onNavigate} />
      </div>
  );
};
